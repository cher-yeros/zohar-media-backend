
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import PartnershipPayment from '../../models/partners_payment.model';

const partnershippaymentResolvers = {
  Query: {
    partnershippayment: async (_: any, { id }: { id: number }, ___: any) => {
      return await PartnershipPayment.findByPk(id);
    },
    allPartnershipPayments: async (_: any, __: any, ___: any) => {
      return await PartnershipPayment.findAll();
    },
  },

  Mutation: {
    createPartnershipPayment: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await PartnershipPayment.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updatePartnershipPayment: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await PartnershipPayment.findByPk(id);
      if (!instance) {
        throw new Error('PartnershipPayment not found');
      }
      await instance.update(input);
      return instance;
    },

    deletePartnershipPayment: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await PartnershipPayment.findByPk(id);
      if (!instance) {
        throw new Error('PartnershipPayment not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default partnershippaymentResolvers;
