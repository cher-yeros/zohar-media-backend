
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import Notification from '../../models/notification.model';

const notificationResolvers = {
  Query: {
    notification: async (_: any, { id }: { id: number }, ___: any) => {
      return await Notification.findByPk(id);
    },
    allNotifications: async (_: any, __: any, ___: any) => {
      return await Notification.findAll();
    },
  },

  Mutation: {
    createNotification: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await Notification.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateNotification: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await Notification.findByPk(id);
      if (!instance) {
        throw new Error('Notification not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteNotification: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await Notification.findByPk(id);
      if (!instance) {
        throw new Error('Notification not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default notificationResolvers;
