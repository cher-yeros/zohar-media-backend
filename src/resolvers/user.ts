import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Op, Transaction } from "sequelize";
import { AuthenticationError, BadRequestError } from "../helpers/error_handler";
import BibleStudyApplication from "../models/bible_study.model";
import Partnership from "../models/partnership.model";
import Token from "../models/token.model";
import User from "../models/user.model";
import {
  sendMemberEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../services/sendEmail";
import {
  BulkEmailInputType,
  CreateUserInputType,
} from "../types/resolvers-types";
import sequelize from "../utils/db.connection";

const userResolvers = {
  Query: {
    user: async (_: any, { id }: { id: number }, ___: any) => {},
    users: async (_: any, __: any, ___: any) => {},
    verifyEmail: async (_: any, { token }: { token: String }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const verificationToken = await Token.findOne({ where: { token } });

        if (!verificationToken || verificationToken.expiryDate < new Date()) {
          return new BadRequestError("Invalid or Expired token");
        }

        const user = await User.findByPk(verificationToken.userId);

        if (user?.is_verified) {
          return new BadRequestError("Email is already verified");
        }

        if (user) {
          user.is_verified = true;
          await user.save();
        }

        await verificationToken.destroy();

        return true;
      } catch (error: any) {
        return new BadRequestError(error);
      }
    },
  },

  Mutation: {
    createUser: async (
      _: any,
      { input }: { input: CreateUserInputType },
      ___: any
    ) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      const emailFound = await User.findOne({
        where: {
          email: input.email,
        },
      });

      if (emailFound) {
        return new AuthenticationError("Email is already taken!");
      }

      try {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(input.password, salt);
        const result = await User.create(
          { ...input, password },
          { transaction: t }
        );

        const token = await Token.create(
          { userId: result.id },
          { transaction: t }
        );

        await sendVerificationEmail(
          result.email,
          token.token,
          result.first_name,
          result.last_name
        );

        await t.commit();
        return result;
      } catch (error) {
        if (t) {
          await t.rollback();
        }
        return new AuthenticationError(`${error}`);
      }
    },
    loginUser: async (
      _: any,
      { input }: { input: CreateUserInputType },
      ___: any
    ) => {
      const userInfo = await User.findOne({
        where: { email: input.email },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (!userInfo) {
        return new AuthenticationError(`Invalid Email or Password`);
      }
      if (userInfo.banned) {
        return new AuthenticationError(`Your Account has been banned.`);
      }
      if (!userInfo.is_verified) {
        return new AuthenticationError(`Verify Your Email first`);
      }
      const { password, ...user } = userInfo.dataValues;
      const correctPassword = await bcrypt.compare(input.password, password);
      if (!correctPassword) {
        return new AuthenticationError(`Invalid Email or Password 2`);
      }
      // const user = dataValues;
      const token = jwt.sign({ user }, process.env.JWT_SECRET!);
      return { token, user: userInfo };
    },
    // updateProfile: async (
    //   _: any,
    //   { input }: { input: UpdateProfileInputType },
    //   ___: any
    // ) => {
    //   const { skills, ...user } = input;
    //   let t: Transaction = await sequelize.transaction({
    //     isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    //   });
    //   try {
    //     const user = await User.update(
    //       { ...input },
    //       {
    //         where: {
    //           id: input.id,
    //         },
    //       }
    //     ).then(async () => {
    //       return await User.findOne({
    //         where: {
    //           id: input.id,
    //         },
    //       });
    //     });

    //     await t.commit();
    //     return true;
    //   } catch (error) {
    //     if (t) {
    //       await t.rollback();
    //     }
    //     throw new Error(`${error}`);
    //   }
    // },

    requestResetPassword: async (
      _: any,
      { email }: { email: string },
      ___: any
    ) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      const user = await User.findOne({ where: { email }, transaction: t });

      if (!user) {
        throw new Error("User not found");
      }

      const token = await Token.create({ userId: user.id }, { transaction: t });

      const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour expiration

      await User.update(
        { resetToken: token.token, resetTokenExpires },
        { where: { id: user.id }, transaction: t }
      );

      t.commit();
      try {
        await sendPasswordResetEmail(
          user.email,
          token.token,
          user.first_name,
          user.last_name
        );
      } catch (error: any) {
        t.rollback();
        return new BadRequestError(error.message);
      }

      return "Password reset token sent to email";
    },
    resetPassword: async (
      _: any,
      {
        email,
        resetToken,
        newPassword,
      }: { email: string; resetToken: string; newPassword: string }
    ) => {
      const user = await User.findOne({
        where: {
          email,
          resetToken,
          resetTokenExpires: { [Op.gt]: new Date() },
        },
      });
      if (!user) {
        throw new Error("Invalid or expired reset token");
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await User.update(
        {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpires: null,
        },
        {
          where: {
            id: user.id,
          },
        }
      );
      // await user.save();

      return "Password has been reset successfully";
    },
    sendBulkEmailForPropheticSchoolMembers: async (
      _: any,
      { input }: { input: BulkEmailInputType },
      ___: any
    ) => {
      const members = await BibleStudyApplication.findAll();

      let received: Object[] = [];
      let notRecieved: Object[] = [];

      await Promise.all(
        members.map(async (member) => {
          try {
            await sendMemberEmail({
              to: member.email,
              first_name: member.first_name,
              last_name: member.last_name,
              title: input.title,
              subject: input.subject,
              body: input.body,
            });

            received.push({
              first_name: member.first_name,
              last_name: member.last_name,
              email: member.email,
            });
          } catch (error) {
            notRecieved.push({
              first_name: member.first_name,
              last_name: member.last_name,
              email: member.email,
            });
          }
        })
      );

      return { received, notRecieved };
    },
    sendBulkEmailForPartners: async (
      _: any,
      { input }: { input: BulkEmailInputType },
      ___: any
    ) => {
      const partners = await Partnership.findAll();

      let received: Object[] = [];
      let notRecieved: Object[] = [];

      await Promise.all(
        partners.map(async (partner) => {
          try {
            await sendMemberEmail({
              to: partner.email,
              first_name: partner.first_name,
              last_name: partner.last_name,
              title: input.title,
              subject: input.subject,
              body: input.body,
            });

            received.push({
              first_name: partner.first_name,
              last_name: partner.last_name,
              email: partner.email,
            });
          } catch (error) {
            notRecieved.push({
              first_name: partner.first_name,
              last_name: partner.last_name,
              email: partner.email,
            });
          }
        })
      );

      return { received, notRecieved };
    },
  },
};
export default userResolvers;
