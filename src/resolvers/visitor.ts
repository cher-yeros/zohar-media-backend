import { Transaction } from "sequelize";
import VisitorSchedule from "../models/guest_house_prayer_schedule.model";
import {
  CreateVisitorInputType,
  CreateVisitorScheduleInputType,
  UpdateVisitorScheduleInputType,
  UserType,
} from "../types/resolvers-types";

import paypal from "@paypal/checkout-server-sdk";
import { BadRequestError } from "../helpers/error_handler";
import Payment from "../models/payment.model";
import User from "../models/user.model";
import Visitor from "../models/visitor.model";
import { sendVisitorConfirmationEmail } from "../services/sendEmail";
import createChapaPayment, { PaymentTypes } from "../services/services";
import { UserAccount } from "../types";
import sequelize from "../utils/db.connection";

let clientId = process.env.PAYPAL_SANDBOX_CLIENT_ID!;
let clientSecret = process.env.PAYPAL_SANDBOX_CLIENT_SECRET!;
let paypalApi = process.env.PAYPAL_SANDBOX_PAYPAL_API!;

let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

const geustHouseResolvers = {
  Query: {
    VisitorSchedules: async (_: any, __: any, { user }: { user: UserType }) => {
      let result = await VisitorSchedule.findAll({
        order: [["createdAt", "DESC"]],
      });

      return result;
    },
    //     Visitors: async (
    //       _: any,
    //       __: any,
    //       { user }: { user: UserType }
    //     ) => {
    //       let result;

    //       if (user && user.role === "admin") {
    //         result = await Visitor.findAll({});
    //       } else {
    //         result = await Visitor.findAll({
    //           where: {
    //             status: {
    //               [Op.not]: "CLOSED",
    //             },
    //           },
    //         });
    //       }
    //       return result;
    //     },
    VisitorScheulesForUsers: async (
      _: any,
      __: any,
      { user }: { user: UserType }
    ) => {
      let result = await VisitorSchedule.findAll({
        where: {
          status: "OPEN",

          // end_time: {
          //   [Op.lt]: new Date(),
          // },
        },
        order: [["createdAt", "DESC"]],
      });

      return result;
    },
    Visitors: async (_: any, __: any, { user }: { user: UserType }) => {
      const result = await Visitor.findAll({
        include: [User],
        order: [["createdAt", "DESC"]],
      });
      return result;
    },
    // myGuestHouseApplications: async (
    //   _: any,
    //   __: any,
    //   { user }: { user: UserType }
    // ) => {
    //   const result = await Visitor.findAll({
    //     where: { user_id: user.id },
    //     include: [VisitorSchedule],
    //   });
    //   return result;
    // },
  },
  Mutation: {
    createVisitorSchedule: async (
      _: any,
      { input }: { input: CreateVisitorScheduleInputType },
      { user, pubsub }: { pubsub: any; user: UserType }
    ) => {
      const result = await VisitorSchedule.create({
        ...input,
        date: input.start_time,
      });

      return result;
    },
    createVisitor: async (
      _: any,
      { input }: { input: CreateVisitorInputType },
      { user, pubsub }: { pubsub: any; user: UserType }
    ) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      const visitor = await Visitor.create(
        {
          ...input,
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
          reason: PaymentTypes.Visitor,
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
            user_id: user?.id,
            reason: "For Visitors Program",
            payment_method: input.payment_method,
          },
          { transaction: t }
        );

        await Visitor.update(
          { status: "PENDING", payment_id: payment.id },
          {
            where: {
              id: visitor.id,
            },
            transaction: t,
          }
        );

        t.commit();
        return paymentInstance;
      } catch (error: any) {
        t.rollback();
        console.log(error);
        return new BadRequestError(error.message);
      }
    },

    // closeVisitorSchedule: async (
    //   _: any,
    //   { id }: { id: number },
    //   { user, pubsub }: { pubsub: any; user: UserType }
    // ) => {
    //   const result = await Visitor.update(
    //     {
    //       status: "CLOSED",
    //     },
    //     { where: { id } }
    //   );
    //   return result;
    // },

    createGuestHouseOrder: async (
      _: any,
      { input }: { input: CreateVisitorInputType },
      { user }: { user: UserAccount }
    ) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      const guestHouse = await Visitor.create(
        {
          ...input,
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
            reason: "For Guest House Prayer Registraton",
            payment_method: input.payment_method,
          },
          { transaction: t }
        );

        await Visitor.update(
          { status: "PAID" },
          {
            where: {
              id: guestHouse.id,
            },
            transaction: t,
          }
        );
        await sendVisitorConfirmationEmail(
          input.email,
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
    captureGuestHouseOrder: async (
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

    updateVisitorSchedule: async (
      _: any,
      { input }: { input: UpdateVisitorScheduleInputType },
      ___: any
    ) => {
      try {
        const [updated] = await VisitorSchedule.update(
          { ...input },
          { where: { id: input.id } }
        );
        return updated > 0;
      } catch (error) {
        throw new Error("Error updating guest house schedule");
      }
    },
    deleteVisitorSchedule: async (_: any, { id }: { id: number }, ___: any) => {
      try {
        const result = await VisitorSchedule.destroy({
          where: { id },
        });
        return result > 0;
      } catch (error) {
        throw new Error("Error deleting guest");
      }
    },
    deleteVisitor: async (_: any, { id }: { id: number }, ___: any) => {
      try {
        const result = await await Visitor.destroy({ where: { id } });
        return result > 0;
      } catch (error) {
        throw new Error("Error deleting guest");
      }
    },
  },
};
export default geustHouseResolvers;
