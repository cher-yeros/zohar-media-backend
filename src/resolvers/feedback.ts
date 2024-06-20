import Feedback from "../models/feedback.model";
import User from "../models/user.model";
import {
  CreateAdminFeedbackInputType,
  CreateFeedbackInputType,
  UserType,
} from "../types/resolvers-types";

const feedbackResolvers = {
  Query: {
    myFeedbacks: async (_: any, __: any, { user }: { user: UserType }) => {
      const result = await Feedback.findAll({
        where: {
          to_id: user.id,
        },
        order: [["createdAt", "DESC"]],
        include: [
          { model: User, as: "from" },
          { model: User, as: "to" },
        ],
      });
      return result;
    },

    feedbacksByUserId: async (
      _: any,
      { id }: { id: number },
      { user }: { user: UserType }
    ) => {
      const result = await Feedback.findAll({
        where: {
          to_id: id,
        },
        order: [["createdAt", "DESC"]],
        include: [
          { model: User, as: "from" },
          { model: User, as: "to" },
        ],
      });
      return result;
    },
  },
  Mutation: {
    createFeedback: async (
      _: any,
      { input }: { input: CreateFeedbackInputType },
      { user, pubsub }: { pubsub: any; user: UserType }
    ) => {
      const result = await Feedback.create({
        ...input,
        from_id: user.id,
      });
      return result;
    },
  },
};
export default feedbackResolvers;
