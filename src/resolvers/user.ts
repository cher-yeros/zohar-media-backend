import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Transaction } from "sequelize";
import { AuthenticationError, BadRequestError } from "../helpers/error_handler";
import Token from "../models/token.model";
import User from "../models/user.model";
import { sendVerificationEmail } from "../services/sendEmail";
import { CreateUserInputType } from "../types/resolvers-types";
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

        await sendVerificationEmail(result.email, token.token);

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
      console.log({ user });
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
    // editProfile: async (
    //   _: any,
    //   { input }: { input: EditProfileInputType },
    //   ___: any
    // ) => {
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
    //     if (!user) {
    //       throw new Error(`User not found `);
    //     }

    //     await t.commit();
    //     return true;
    //   } catch (error) {
    //     if (t) {
    //       await t.rollback();
    //     }
    //     throw new Error(`${error}`);
    //   }
    // },

    // banUser: async (
    //   _: any,
    //   { user_id, ban }: { user_id: number; ban: boolean },
    //   ___: any
    // ) => {
    //   const banned = await User.update(
    //     {
    //       banned: ban,
    //     },
    //     {
    //       where: {
    //         id: user_id,
    //       },
    //     }
    //   );
    //   return true;
    // },
    // deleteUser: async (_: any, { user_id }: { user_id: number }, ___: any) => {
    //   const result = await User.destroy({
    //     where: {
    //       id: user_id,
    //     },
    //   });
    //   return true;
    // },
    // requestResetPassword: async (_: any, { email }: { email: string }) => {
    //   const user = await User.findOne({ where: { email } });
    //   if (!user) {
    //     throw new Error("User not found");
    //   }

    //   const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    //   const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour expiration

    //   user.resetToken = resetToken;
    //   user.resetTokenExpires = resetTokenExpires;
    //   await user.save();

    //   const transporter = nodemailer.createTransport({
    //     host: "sandbox.smtp.mailtrap.io",
    //     port: 2525,
    //     // service: "gmail",
    //     auth: {
    //       user: process.env.EMAIL_USER,
    //       pass: process.env.APP_EMAIL_PASS,
    //     },
    //   });
    //   const mailOptions = {
    //     from: process.env.GMAIL_USER,
    //     to: email,
    //     subject: "Password Reset",
    //     text: `To reset your password, use this token: ${resetToken}`,
    //   };

    //   await transporter.sendMail(mailOptions);

    //   return "Password reset token sent to email";
    // },
    // resetPassword: async (
    //   _: any,
    //   {
    //     email,
    //     resetToken,
    //     newPassword,
    //   }: { email: string; resetToken: string; newPassword: string }
    // ) => {
    //   const user = await User.findOne({
    //     where: {
    //       email,
    //       resetToken,
    //       resetTokenExpires: { [Op.gt]: new Date() },
    //     },
    //   });
    //   if (!user) {
    //     throw new Error("Invalid or expired reset token");
    //   }
    //   const hashedPassword = await bcrypt.hash(newPassword, 10);

    //   await User.update(
    //     {
    //       password: hashedPassword,
    //       resetToken: null,
    //       resetTokenExpires: null,
    //     },
    //     {
    //       where: {
    //         id: user.id,
    //       },
    //     }
    //   );
    //   // await user.save();

    //   return "Password has been reset successfully";
    // },
  },
};
export default userResolvers;
