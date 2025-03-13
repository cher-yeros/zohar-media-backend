import Feedback from "../models/feedback.model";
import User from "../models/user.model";
import { CreateFeedbackInputType, UserType } from "../types/resolvers-types";

const feedbackResolvers = {
  Query: {
    feedbacks: async (_: any, __: any, { user }: { user: UserType }) => {
      const result = await Feedback.findAll({
        order: [["createdAt", "DESC"]],
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
      });
      return result;
    },
  },
};
export default feedbackResolvers;
