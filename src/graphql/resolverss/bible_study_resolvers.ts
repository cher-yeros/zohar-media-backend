
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import BibleStudyApplication from '../../models/bible_study.model';

const biblestudyapplicationResolvers = {
  Query: {
    biblestudyapplication: async (_: any, { id }: { id: number }, ___: any) => {
      return await BibleStudyApplication.findByPk(id);
    },
    allBibleStudyApplications: async (_: any, __: any, ___: any) => {
      return await BibleStudyApplication.findAll();
    },
  },

  Mutation: {
    createBibleStudyApplication: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await BibleStudyApplication.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateBibleStudyApplication: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await BibleStudyApplication.findByPk(id);
      if (!instance) {
        throw new Error('BibleStudyApplication not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteBibleStudyApplication: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await BibleStudyApplication.findByPk(id);
      if (!instance) {
        throw new Error('BibleStudyApplication not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default biblestudyapplicationResolvers;
