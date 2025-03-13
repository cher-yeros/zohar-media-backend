import { Transaction } from "sequelize";
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from "../../utils/db.connection";
import Visitor from "../../models/visitor.model";

const VisitorResolvers = {
  Query: {
    Visitor: async (_: any, { id }: { id: number }, ___: any) => {
      return await Visitor.findByPk(id);
    },
    allVisitors: async (_: any, __: any, ___: any) => {
      return await Visitor.findAll();
    },
  },

  Mutation: {
    createVisitor: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await Visitor.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateVisitor: async (
      _: any,
      { id, input }: { id: number; input: any },
      ___: any
    ) => {
      const instance = await Visitor.findByPk(id);
      if (!instance) {
        throw new Error("Visitor not found");
      }
      await instance.update(input);
      return instance;
    },

    deleteVisitor: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await Visitor.findByPk(id);
      if (!instance) {
        throw new Error("Visitor not found");
      }
      await instance.destroy();
      return "Deleted";
    },
  },
};

export default VisitorResolvers;
