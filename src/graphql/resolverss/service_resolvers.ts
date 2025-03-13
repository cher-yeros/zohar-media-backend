
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import Service from '../../models/service.model';

const serviceResolvers = {
  Query: {
    service: async (_: any, { id }: { id: number }, ___: any) => {
      return await Service.findByPk(id);
    },
    allServices: async (_: any, __: any, ___: any) => {
      return await Service.findAll();
    },
  },

  Mutation: {
    createService: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await Service.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateService: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await Service.findByPk(id);
      if (!instance) {
        throw new Error('Service not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteService: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await Service.findByPk(id);
      if (!instance) {
        throw new Error('Service not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default serviceResolvers;
