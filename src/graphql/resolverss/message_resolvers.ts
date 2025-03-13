
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import Message from '../../models/message.model';

const messageResolvers = {
  Query: {
    message: async (_: any, { id }: { id: number }, ___: any) => {
      return await Message.findByPk(id);
    },
    allMessages: async (_: any, __: any, ___: any) => {
      return await Message.findAll();
    },
  },

  Mutation: {
    createMessage: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await Message.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateMessage: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await Message.findByPk(id);
      if (!instance) {
        throw new Error('Message not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteMessage: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await Message.findByPk(id);
      if (!instance) {
        throw new Error('Message not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default messageResolvers;
