
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import ServiceCategory from '../../models/service_category.model';

const servicecategoryResolvers = {
  Query: {
    servicecategory: async (_: any, { id }: { id: number }, ___: any) => {
      return await ServiceCategory.findByPk(id);
    },
    allServiceCategorys: async (_: any, __: any, ___: any) => {
      return await ServiceCategory.findAll();
    },
  },

  Mutation: {
    createServiceCategory: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await ServiceCategory.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateServiceCategory: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await ServiceCategory.findByPk(id);
      if (!instance) {
        throw new Error('ServiceCategory not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteServiceCategory: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await ServiceCategory.findByPk(id);
      if (!instance) {
        throw new Error('ServiceCategory not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default servicecategoryResolvers;
