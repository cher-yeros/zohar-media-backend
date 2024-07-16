
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import GuestHousePrayerSchedule from '../../models/guest_house_prayer_schedule.model';

const guesthouseprayerscheduleResolvers = {
  Query: {
    guesthouseprayerschedule: async (_: any, { id }: { id: number }, ___: any) => {
      return await GuestHousePrayerSchedule.findByPk(id);
    },
    allGuestHousePrayerSchedules: async (_: any, __: any, ___: any) => {
      return await GuestHousePrayerSchedule.findAll();
    },
  },

  Mutation: {
    createGuestHousePrayerSchedule: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await GuestHousePrayerSchedule.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateGuestHousePrayerSchedule: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await GuestHousePrayerSchedule.findByPk(id);
      if (!instance) {
        throw new Error('GuestHousePrayerSchedule not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteGuestHousePrayerSchedule: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await GuestHousePrayerSchedule.findByPk(id);
      if (!instance) {
        throw new Error('GuestHousePrayerSchedule not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default guesthouseprayerscheduleResolvers;
