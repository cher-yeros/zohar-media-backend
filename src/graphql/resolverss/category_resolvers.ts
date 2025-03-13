
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import Category from '../../models/category.model';

const categoryResolvers = {
  Query: {
    category: async (_: any, { id }: { id: number }, ___: any) => {
      return await Category.findByPk(id);
    },
    allCategorys: async (_: any, __: any, ___: any) => {
      return await Category.findAll();
    },
  },

  Mutation: {
    createCategory: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await Category.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateCategory: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await Category.findByPk(id);
      if (!instance) {
        throw new Error('Category not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteCategory: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await Category.findByPk(id);
      if (!instance) {
        throw new Error('Category not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default categoryResolvers;
