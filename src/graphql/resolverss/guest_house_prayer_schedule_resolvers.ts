
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import VisitorSchedule from '../../models/guest_house_prayer_schedule.model';

const visitorscheduleResolvers = {
  Query: {
    visitorschedule: async (_: any, { id }: { id: number }, ___: any) => {
      return await VisitorSchedule.findByPk(id);
    },
    allVisitorSchedules: async (_: any, __: any, ___: any) => {
      return await VisitorSchedule.findAll();
    },
  },

  Mutation: {
    createVisitorSchedule: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await VisitorSchedule.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateVisitorSchedule: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await VisitorSchedule.findByPk(id);
      if (!instance) {
        throw new Error('VisitorSchedule not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteVisitorSchedule: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await VisitorSchedule.findByPk(id);
      if (!instance) {
        throw new Error('VisitorSchedule not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default visitorscheduleResolvers;
