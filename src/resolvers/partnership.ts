import { Transaction } from "sequelize";
import { UserAccount } from "../types";
import { CreatePartnershipInputType } from "../types/resolvers-types";
import sequelize from "../utils/db.connection";
import Partnership from "../models/partnership.model";
import createChapaPayment from "../services/services";
import Payment from "../models/payment.model";
import { BadRequestError } from "../helpers/error_handler";
import { PubSub } from "graphql-subscriptions";
import { PAYMENT_SUCCESSFUL, PAYMENT_VERIFIED } from "../helpers/constants";
const pubsub = new PubSub();

const partnershipResolvers = {
  Query: {},
  Mutation: {
    createPartnership: async (
      _: any,
      { input }: { input: CreatePartnershipInputType },
      { user }: { user: UserAccount }
    ) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const paymentInstance = await createChapaPayment({
          first_name: input.firstname,
          last_name: input.lastname,
          phone: input.phone,
          email: input.email,
          amount: input.amount,
          currency: input.currency,
        });

        const partnership = await Partnership.create(
          {
            ...input,
            user_id: user.id,
          },
          { transaction: t }
        );

        const payment = await Payment.create(
          {
            amount: input.amount,
            status: "PENDING",
            tx_ref: paymentInstance.tx_ref,
            partnership_id: partnership.id,
            user_id: user.id,
          },
          {
            transaction: t,
          }
        );

        t.commit();

        return paymentInstance;
      } catch (error: any) {
        t.rollback();
        return new BadRequestError(error);
      }
    },
  },
  Subscription: {
    paymentSuccessful: {
      subscribe: (_: any, { tx_ref }: { tx_ref: string }) =>
        pubsub.asyncIterator([`${PAYMENT_SUCCESSFUL}.${tx_ref}`]),
    },
    paymentVerified: {
      subscribe: (_: any, { tx_ref }: { tx_ref: string }) =>
        pubsub.asyncIterator([`${PAYMENT_VERIFIED}.${tx_ref}`]),
    },
  },
};

export default partnershipResolvers;
