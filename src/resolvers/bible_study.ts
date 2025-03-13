import { Op, Transaction } from "sequelize";
import { BadRequestError } from "../helpers/error_handler";
import BibleStudyApplication from "../models/bible_study.model";
import BibleStudySession from "../models/bible_study_session.model";
import Payment from "../models/payment.model";
import User from "../models/user.model";
import { sendBibleStudyEmail } from "../services/sendEmail";
import createChapaPayment, { PaymentTypes } from "../services/services";
import {
  CreateBibleStudyApplicationInputType,
  CreateBibleStudySessionInputType,
  UpdateBibleStudySessionInputType,
  UserType,
} from "../types/resolvers-types";
import sequelize from "../utils/db.connection";

import paypal from "@paypal/checkout-server-sdk";
import { UserAccount } from "../types";

let clientId = process.env.PAYPAL_SANDBOX_CLIENT_ID!;
let clientSecret = process.env.PAYPAL_SANDBOX_CLIENT_SECRET!;
let paypalApi = process.env.PAYPAL_SANDBOX_PAYPAL_API!;

let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

const bibleStudyResolvers = {
  Query: {
    bibleStudySessions: async (
      _: any,
      __: any,
      { user }: { user: UserType }
    ) => {
      let result;

      if (user && user.role === "admin") {
        result = await BibleStudySession.findAll({
          order: [["createdAt", "Desc"]],
        });
      } else {
        result = await BibleStudySession.findAll({
          order: [["createdAt", "Desc"]],
          where: {
            status: {
              [Op.not]: "CLOSED",
            },
          },
        });
      }
      return result;
    },
    bibleStudySessionsForUsers: async (
      _: any,
      __: any,
      { user }: { user: UserType }
    ) => {
      let result = await BibleStudySession.findAll({
        where: {
          status: {
            [Op.not]: "CLOSED",
          },
          // end_date: {
          //   [Op.lt]: new Date(),
          // },
        },
        order: [["createdAt", "Desc"]],
      });

      return result;
    },
    bibleStudyApplications: async (
      _: any,
      __: any,
      { user }: { user: UserType }
    ) => {
      const result = await BibleStudyApplication.findAll({
        include: [User, BibleStudySession],
        order: [["createdAt", "Desc"]],
      });
      return result;
    },
    myBibleStudyApplications: async (
      _: any,
      __: any,
      { user }: { user: UserType }
    ) => {
      const result = await BibleStudyApplication.findAll({
        where: { user_id: user.id },
        include: [BibleStudySession],
        order: [["createdAt", "Desc"]],
      });
      return result;
    },
  },
  Mutation: {
    createBibleStudySession: async (
      _: any,
      { input }: { input: CreateBibleStudySessionInputType },
      { user, pubsub }: { pubsub: any; user: UserType }
    ) => {
      const result = await BibleStudySession.create({
        ...input,
      });
      return result;
    },
    applyForBibleStudy: async (
      _: any,
      { input }: { input: CreateBibleStudyApplicationInputType },
      { user, pubsub }: { pubsub: any; user: UserType }
    ) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      const bs_session = await BibleStudySession.findOne({
        where: {
          id: input.bible_study_session_id,
        },
        transaction: t,
      });

      const application = await BibleStudyApplication.create(
        {
          ...input,
          ...bs_session,
          user_id: user.id,
          title: bs_session?.title,
          description: bs_session?.description,
          date: bs_session?.date,
          zoom_id: bs_session?.zoom_id,
          zoom_link: bs_session?.zoom_link,
          zoom_passcode: bs_session?.zoom_passcode,
        },
        { transaction: t }
      );

      try {
        const paymentInstance = await createChapaPayment({
          first_name: input.first_name,
          last_name: input.last_name,
          email: input.email,
          phone: input.phone,
          amount: input.payment_amount,
          currency: "ETB",
          reason: PaymentTypes.BibleStudy,
        });

        const payment = await Payment.create(
          {
            first_name: input.first_name,
            last_name: input.last_name,
            email: input.email,
            phone: input.phone,
            amount: input.payment_amount,
            currency: "ETB",
            tx_ref: paymentInstance.tx_ref,
            user_id: user.id,
            reason: "For Bible Study Registraton",
            payment_method: input.payment_method,
          },
          { transaction: t }
        );

        await BibleStudyApplication.update(
          { status: "PAID" },
          {
            where: {
              id: application.id,
            },
            transaction: t,
          }
        );
        await sendBibleStudyEmail(
          input.email,
          {
            zoom_id: bs_session?.zoom_id!,
            zoom_link: bs_session?.zoom_link!,
            zoom_passcode: bs_session?.zoom_passcode!,
          },
          input.first_name,
          input.last_name
        );

        t.commit();
        return paymentInstance;
      } catch (error: any) {
        t.rollback();
        console.log(error);
        return new BadRequestError(error.message);
      }

      return { id: 1 };
    },
    registerBiblesStudyMembers: async (
      _: any,
      { input }: { input: CreateBibleStudyApplicationInputType },
      { user, pubsub }: { pubsub: any; user: UserType }
    ) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      const member = await BibleStudyApplication.create(
        {
          ...input,
          status: "PAID",
        },
        { transaction: t }
      );

      t.commit();

      return member;
    },
    closeBibleStudySession: async (
      _: any,
      { id }: { id: number },
      { user, pubsub }: { pubsub: any; user: UserType }
    ) => {
      const result = await BibleStudySession.update(
        {
          status: "CLOSED",
        },
        { where: { id } }
      );
      return result;
    },

    createBibleStudyOrder: async (
      _: any,
      { input }: { input: CreateBibleStudyApplicationInputType },
      { user }: { user: UserAccount }
    ) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      const bs_session = await BibleStudySession.findOne({
        where: {
          id: input.bible_study_session_id,
        },
        transaction: t,
      });

      const application = await BibleStudyApplication.create(
        {
          ...input,
          ...bs_session,
          user_id: user.id,
          title: bs_session?.title,
          description: bs_session?.description,
          date: bs_session?.date,
          zoom_id: bs_session?.zoom_id,
          zoom_link: bs_session?.zoom_link,
          zoom_passcode: bs_session?.zoom_passcode,
        },
        { transaction: t }
      );

      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");

      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: input.payment_amount.toString(),
            },
          },
        ],
      });

      try {
        const order = await client.execute(request);

        const payment = await Payment.create(
          {
            first_name: input.first_name,
            last_name: input.last_name,
            email: input.email,
            phone: input.phone,
            amount: input.payment_amount,
            currency: "ETB",
            tx_ref: order.result?.id,
            user_id: user.id,
            reason: "For Bible Study Registraton",
            payment_method: input.payment_method,
          },
          { transaction: t }
        );

        await BibleStudyApplication.update(
          { status: "PAID" },
          {
            where: {
              id: application.id,
            },
            transaction: t,
          }
        );

        await sendBibleStudyEmail(
          input.email,
          {
            zoom_id: bs_session?.zoom_id!,
            zoom_link: bs_session?.zoom_link!,
            zoom_passcode: bs_session?.zoom_passcode!,
          },
          input.first_name,
          input.last_name
        );

        await t.commit();
        return order.result?.id;
      } catch (err: any) {
        // console.log(err);
        await t.rollback();
        return new BadRequestError(err.message);
      }
    },
    captureBibleStudyOrder: async (
      _: any,
      { orderID }: { orderID: string },
      { user }: { user: UserAccount }
    ) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      let payment = await Payment.update(
        { status: "COMPLETED" },
        {
          where: {
            tx_ref: orderID,
          },
          transaction: t,
        }
      );

      const request = new paypal.orders.OrdersCaptureRequest(orderID);
      // request.requestBody({});

      try {
        const capture = await client.execute(request);

        await t.commit();
        return capture;
      } catch (err: any) {
        await t.rollback();
        return new BadRequestError(err.message);
      }
    },
    updateBibleStudySession: async (
      _: any,
      { input }: { input: UpdateBibleStudySessionInputType }
    ) => {
      try {
        const [updated] = await BibleStudySession.update(
          {
            ...input,
          },
          {
            where: { id: input.id },
          }
        );
        return updated > 0; // Return true if at least one row was affected
      } catch (error) {
        throw new Error("Error updating gallery");
      }
    },
    deleteBibleStudySession: async (_: any, { id }: { id: number }) => {
      try {
        const result = await BibleStudySession.destroy({
          where: { id },
        });
        return result > 0; // Return true if at least one row was affected
      } catch (error) {
        console.log(error);
        throw new Error("Error deleting gallery");
      }
    },

    deleteBibleStudyApplication: async (_: any, { id }: { id: number }) => {
      try {
        const result = await BibleStudyApplication.destroy({
          where: { id },
        });
        return result > 0; // Return true if at least one row was affected
      } catch (error) {
        throw new Error("Error deleting gallery");
      }
    },
  },
};
export default bibleStudyResolvers;
