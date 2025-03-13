import { Transaction } from "sequelize";
import Payment from "../models/payment.model";
import {
  ConfirmPaymentInputType,
  CreatePaymentInputType,
  UserType,
} from "../types/resolvers-types";
import sequelize from "../utils/db.connection";

const paymentResolvers = {
  Mutation: {
    createPayment: async (
      _: any,
      { input }: { input: CreatePaymentInputType },
      { user }: { user: UserType }
    ) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const payment = await Payment.create({
          ...input,
          employer_id: user.id,
        });

        await t.commit();
        return payment;
      } catch (error) {
        console.log(`Error: company_vehicle_dispatch. ${error}`);
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },
    confirmPayment: async (
      _: any,
      { input }: { input: ConfirmPaymentInputType },
      ___: any
    ) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });
    },
  },
  Query: {
    payments: async () => {
      return await Payment.findAll({});
    },
  },
};

export default paymentResolvers;
