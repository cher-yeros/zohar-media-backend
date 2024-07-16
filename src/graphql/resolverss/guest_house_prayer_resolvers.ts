
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import GuestHousePrayer from '../../models/guest_house_prayer.model';

const guesthouseprayerResolvers = {
  Query: {
    guesthouseprayer: async (_: any, { id }: { id: number }, ___: any) => {
      return await GuestHousePrayer.findByPk(id);
    },
    allGuestHousePrayers: async (_: any, __: any, ___: any) => {
      return await GuestHousePrayer.findAll();
    },
  },

  Mutation: {
    createGuestHousePrayer: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await GuestHousePrayer.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateGuestHousePrayer: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await GuestHousePrayer.findByPk(id);
      if (!instance) {
        throw new Error('GuestHousePrayer not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteGuestHousePrayer: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await GuestHousePrayer.findByPk(id);
      if (!instance) {
        throw new Error('GuestHousePrayer not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default guesthouseprayerResolvers;
