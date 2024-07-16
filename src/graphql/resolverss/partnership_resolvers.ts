
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import Partnership from '../../models/partnership.model';

const partnershipResolvers = {
  Query: {
    partnership: async (_: any, { id }: { id: number }, ___: any) => {
      return await Partnership.findByPk(id);
    },
    allPartnerships: async (_: any, __: any, ___: any) => {
      return await Partnership.findAll();
    },
  },

  Mutation: {
    createPartnership: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await Partnership.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updatePartnership: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await Partnership.findByPk(id);
      if (!instance) {
        throw new Error('Partnership not found');
      }
      await instance.update(input);
      return instance;
    },

    deletePartnership: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await Partnership.findByPk(id);
      if (!instance) {
        throw new Error('Partnership not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default partnershipResolvers;
