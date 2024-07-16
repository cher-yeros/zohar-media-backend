
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import PaymentAmountLookup from '../../models/payment_amount_lookup.model';

const paymentamountlookupResolvers = {
  Query: {
    paymentamountlookup: async (_: any, { id }: { id: number }, ___: any) => {
      return await PaymentAmountLookup.findByPk(id);
    },
    allPaymentAmountLookups: async (_: any, __: any, ___: any) => {
      return await PaymentAmountLookup.findAll();
    },
  },

  Mutation: {
    createPaymentAmountLookup: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await PaymentAmountLookup.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updatePaymentAmountLookup: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await PaymentAmountLookup.findByPk(id);
      if (!instance) {
        throw new Error('PaymentAmountLookup not found');
      }
      await instance.update(input);
      return instance;
    },

    deletePaymentAmountLookup: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await PaymentAmountLookup.findByPk(id);
      if (!instance) {
        throw new Error('PaymentAmountLookup not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default paymentamountlookupResolvers;
