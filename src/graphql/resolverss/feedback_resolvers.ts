
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import Feedback from '../../models/feedback.model';

const feedbackResolvers = {
  Query: {
    feedback: async (_: any, { id }: { id: number }, ___: any) => {
      return await Feedback.findByPk(id);
    },
    allFeedbacks: async (_: any, __: any, ___: any) => {
      return await Feedback.findAll();
    },
  },

  Mutation: {
    createFeedback: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await Feedback.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateFeedback: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await Feedback.findByPk(id);
      if (!instance) {
        throw new Error('Feedback not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteFeedback: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await Feedback.findByPk(id);
      if (!instance) {
        throw new Error('Feedback not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default feedbackResolvers;
