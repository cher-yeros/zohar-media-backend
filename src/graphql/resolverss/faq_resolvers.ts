
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import FAQ from '../../models/faq.model';

const faqResolvers = {
  Query: {
    faq: async (_: any, { id }: { id: number }, ___: any) => {
      return await FAQ.findByPk(id);
    },
    allFAQs: async (_: any, __: any, ___: any) => {
      return await FAQ.findAll();
    },
  },

  Mutation: {
    createFAQ: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await FAQ.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateFAQ: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await FAQ.findByPk(id);
      if (!instance) {
        throw new Error('FAQ not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteFAQ: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await FAQ.findByPk(id);
      if (!instance) {
        throw new Error('FAQ not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default faqResolvers;
