
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import Blog from '../../models/blog.model';

const blogResolvers = {
  Query: {
    blog: async (_: any, { id }: { id: number }, ___: any) => {
      return await Blog.findByPk(id);
    },
    allBlogs: async (_: any, __: any, ___: any) => {
      return await Blog.findAll();
    },
  },

  Mutation: {
    createBlog: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await Blog.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateBlog: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await Blog.findByPk(id);
      if (!instance) {
        throw new Error('Blog not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteBlog: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await Blog.findByPk(id);
      if (!instance) {
        throw new Error('Blog not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default blogResolvers;
