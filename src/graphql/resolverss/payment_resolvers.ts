
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import Payment from '../../models/payment.model';

const paymentResolvers = {
  Query: {
    payment: async (_: any, { id }: { id: number }, ___: any) => {
      return await Payment.findByPk(id);
    },
    allPayments: async (_: any, __: any, ___: any) => {
      return await Payment.findAll();
    },
  },

  Mutation: {
    createPayment: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await Payment.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updatePayment: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await Payment.findByPk(id);
      if (!instance) {
        throw new Error('Payment not found');
      }
      await instance.update(input);
      return instance;
    },

    deletePayment: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await Payment.findByPk(id);
      if (!instance) {
        throw new Error('Payment not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default paymentResolvers;
