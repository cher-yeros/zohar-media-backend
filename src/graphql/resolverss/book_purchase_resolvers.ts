
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import BookPurchase from '../../models/book_purchase.model';

const bookpurchaseResolvers = {
  Query: {
    bookpurchase: async (_: any, { id }: { id: number }, ___: any) => {
      return await BookPurchase.findByPk(id);
    },
    allBookPurchases: async (_: any, __: any, ___: any) => {
      return await BookPurchase.findAll();
    },
  },

  Mutation: {
    createBookPurchase: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await BookPurchase.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateBookPurchase: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await BookPurchase.findByPk(id);
      if (!instance) {
        throw new Error('BookPurchase not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteBookPurchase: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await BookPurchase.findByPk(id);
      if (!instance) {
        throw new Error('BookPurchase not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default bookpurchaseResolvers;
