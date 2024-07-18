import { Transaction } from "sequelize";
import Donation from "../models/donation.model";
import Payment from "../models/payment.model";
import createChapaPayment, { PaymentTypes } from "../services/services";
import { UserAccount } from "../types";
import { CreateDonationInputType } from "../types/resolvers-types";
import sequelize from "../utils/db.connection";

const donationResolvers = {
  Query: {
    donation: async (_: any, { id }: { id: number }, ___: any) => {
      return await Donation.findByPk(id);
    },
    allDonations: async (_: any, __: any, ___: any) => {
      return await Donation.findAll();
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
