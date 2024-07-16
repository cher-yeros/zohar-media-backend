
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import Token from '../../models/token.model';

const tokenResolvers = {
  Query: {
    token: async (_: any, { id }: { id: number }, ___: any) => {
      return await Token.findByPk(id);
    },
    allTokens: async (_: any, __: any, ___: any) => {
      return await Token.findAll();
    },
  },

  Mutation: {
    createToken: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await Token.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateToken: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await Token.findByPk(id);
      if (!instance) {
        throw new Error('Token not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteToken: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await Token.findByPk(id);
      if (!instance) {
        throw new Error('Token not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default tokenResolvers;
