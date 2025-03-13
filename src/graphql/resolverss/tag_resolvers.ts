
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import Tag from '../../models/tag.model';

const tagResolvers = {
  Query: {
    tag: async (_: any, { id }: { id: number }, ___: any) => {
      return await Tag.findByPk(id);
    },
    allTags: async (_: any, __: any, ___: any) => {
      return await Tag.findAll();
    },
  },

  Mutation: {
    createTag: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await Tag.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateTag: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await Tag.findByPk(id);
      if (!instance) {
        throw new Error('Tag not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteTag: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await Tag.findByPk(id);
      if (!instance) {
        throw new Error('Tag not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default tagResolvers;
