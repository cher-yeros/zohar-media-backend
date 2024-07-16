
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import User from '../../models/user.model';

const userResolvers = {
  Query: {
    user: async (_: any, { id }: { id: number }, ___: any) => {
      return await User.findByPk(id);
    },
    allUsers: async (_: any, __: any, ___: any) => {
      return await User.findAll();
    },
  },

  Mutation: {
    createUser: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await User.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateUser: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await User.findByPk(id);
      if (!instance) {
        throw new Error('User not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteUser: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await User.findByPk(id);
      if (!instance) {
        throw new Error('User not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default userResolvers;
