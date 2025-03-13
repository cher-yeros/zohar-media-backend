
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import PostTag from '../../models/post_tag.model';

const posttagResolvers = {
  Query: {
    posttag: async (_: any, { id }: { id: number }, ___: any) => {
      return await PostTag.findByPk(id);
    },
    allPostTags: async (_: any, __: any, ___: any) => {
      return await PostTag.findAll();
    },
  },

  Mutation: {
    createPostTag: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await PostTag.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updatePostTag: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await PostTag.findByPk(id);
      if (!instance) {
        throw new Error('PostTag not found');
      }
      await instance.update(input);
      return instance;
    },

    deletePostTag: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await PostTag.findByPk(id);
      if (!instance) {
        throw new Error('PostTag not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default posttagResolvers;
