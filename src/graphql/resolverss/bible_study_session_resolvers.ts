
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import BibleStudySession from '../../models/bible_study_session.model';

const biblestudysessionResolvers = {
  Query: {
    biblestudysession: async (_: any, { id }: { id: number }, ___: any) => {
      return await BibleStudySession.findByPk(id);
    },
    allBibleStudySessions: async (_: any, __: any, ___: any) => {
      return await BibleStudySession.findAll();
    },
  },

  Mutation: {
    createBibleStudySession: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await BibleStudySession.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateBibleStudySession: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await BibleStudySession.findByPk(id);
      if (!instance) {
        throw new Error('BibleStudySession not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteBibleStudySession: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await BibleStudySession.findByPk(id);
      if (!instance) {
        throw new Error('BibleStudySession not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default biblestudysessionResolvers;
