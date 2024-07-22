
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import PrayerRequest from '../../models/prayer_request.model';

const prayerrequestResolvers = {
  Query: {
    prayerrequest: async (_: any, { id }: { id: number }, ___: any) => {
      return await PrayerRequest.findByPk(id);
    },
    allPrayerRequests: async (_: any, __: any, ___: any) => {
      return await PrayerRequest.findAll();
    },
  },

  Mutation: {
    createPrayerRequest: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await PrayerRequest.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updatePrayerRequest: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await PrayerRequest.findByPk(id);
      if (!instance) {
        throw new Error('PrayerRequest not found');
      }
      await instance.update(input);
      return instance;
    },

    deletePrayerRequest: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await PrayerRequest.findByPk(id);
      if (!instance) {
        throw new Error('PrayerRequest not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default prayerrequestResolvers;
