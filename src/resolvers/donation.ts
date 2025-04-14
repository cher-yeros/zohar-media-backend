import { Transaction } from "sequelize";
import Donation from "../models/donation.model";
import Payment from "../models/payment.model";
import createChapaPayment, { PaymentTypes } from "../services/services";
import { UserAccount } from "../types";
import sequelize from "../utils/db.connection";

import paypal from "@paypal/checkout-server-sdk";
import { CreateDonationInputType } from "../types/resolvers-types";
import { BadRequestError } from "../helpers/error_handler";
import { sendDonationConfirmationEmail } from "../services/sendEmail";

let clientId = process.env.PAYPAL_SANDBOX_CLIENT_ID!;
let clientSecret = process.env.PAYPAL_SANDBOX_CLIENT_SECRET!;
let paypalApi = process.env.PAYPAL_SANDBOX_PAYPAL_API!;

let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

const donationResolvers = {
  Query: {
    donation: async (_: any, { id }: { id: number }, ___: any) => {
      return await Donation.findByPk(id);
    },
    allDonations: async (_: any, __: any, ___: any) => {
      return await Donation.findAll({ include: [Payment] });
    },
  },

  Mutation: {
    createDonation: async (
      _: any,
      { input }: { input: CreateDonationInputType },
      { user }: { user: UserAccount }
    ) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await Donation.create(input, { transaction: t });

        const paymentInstance = await createChapaPayment({
          ...input,
          reason: PaymentTypes.Donation,
          currency: input.currency,
        });

        const payment = await Payment.create(
          {
            first_name: input.first_name,
            last_name: input.last_name,
            email: input.email,
            phone: input.phone,
            amount: input.amount,
            currency: input.currency,
            tx_ref: paymentInstance.tx_ref,
            user_id: user?.id,
            reason: "For Partnership",
            payment_method: input.payment_method,
          },
          {
            transaction: t,
          }
        );

        await Donation.update(
          { payment_id: payment.id },
          { where: { id: result.id }, transaction: t }
        );

        await t.commit();
        return paymentInstance;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        console.log(error);
        throw new Error(`${error}`);
      }
    },

    createDonationOrder: async (
      _: any,
      { input }: { input: CreateDonationInputType },
      { user }: { user: UserAccount }
    ) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      const visitor = await Donation.create(
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
              value: input.amount.toString(),
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
            amount: input.amount,
            currency: "ETB",
            tx_ref: order.result?.id,
            user_id: user?.id,
            reason: "For Donation",
            payment_method: input.payment_method,
          },
          { transaction: t }
        );

        await Donation.update(
          { status: "PAID" },
          {
            where: {
              id: visitor?.id,
            },
            transaction: t,
          }
        );

        await t.commit();
        return order.result?.id;
      } catch (err: any) {
        // console.log(err);
        await t.rollback();
        return new BadRequestError(err.message);
      }
    },
    captureDonationOrder: async (
      _: any,
      { orderID }: { orderID: string },
      { user }: { user: UserAccount }
    ) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      const payment = await Payment.findOne({
        where: {
          tx_ref: orderID,
        },
        transaction: t,
      });

      if (!payment) {
        if (t) {
          t.rollback();
        }
        return new BadRequestError("No payment found");
      }

      // let payment = await Payment.update(
      //   { status: "COMPLETED" },
      //   {
      //     where: {
      //       tx_ref: orderID,
      //     },
      //     transaction: t,
      //   }
      // );

      if (!payment) {
        return new BadRequestError("Payment not found!");
      }

      const request = new paypal.orders.OrdersCaptureRequest(orderID);
      // request.requestBody({});

      try {
        const capture = await client.execute(request);

        await Payment.update(
          {
            status: capture.result?.status,
          },
          {
            where: {
              tx_ref: orderID,
            },
            transaction: t,
          }
        );

        await sendDonationConfirmationEmail(
          payment.email,
          payment.first_name,
          payment.last_name
        );

        await t.commit();
        return capture;
      } catch (err: any) {
        await t.rollback();
        return new BadRequestError(err.message);
      }
    },

    updateDonation: async (
      _: any,
      { id, input }: { id: number; input: any },
      ___: any
    ) => {
      const instance = await Donation.findByPk(id);
      if (!instance) {
        throw new Error("Donation not found");
      }
      await instance.update(input);
      return instance;
    },

    deleteDonation: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await Donation.findByPk(id);
      if (!instance) {
        throw new Error("Donation not found");
      }
      await instance.destroy();
      return "Deleted";
    },
  },
};

export default donationResolvers;
