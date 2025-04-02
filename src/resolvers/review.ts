import TeachingReview from "../models/review.model";
import Teaching from "../models/teaching.model";
import User from "../models/user.model";

const reviewResolvers = {
  Query: {
    async getTeachingReviews(_: any, { teaching_id }: { teaching_id: string }) {
      return await TeachingReview.findAll({
        where: { teaching_id, is_visible: true },
        include: [Teaching, User],
      });
    },
  },

  Mutation: {
    async createTeachingReview(_: any, { input }: { input: any }) {
      return await TeachingReview.create(input);
    },

    async updateTeachingReview(_: any, { input }: { input: any }) {
      const review = await TeachingReview.findByPk(input.id);
      if (!review) throw new Error("Review not found");
      return await review.update(input);
    },

    async deleteTeachingReview(_: any, { id }: { id: string }) {
      const review = await TeachingReview.findByPk(id);
      if (!review) throw new Error("Review not found");
      await review.destroy();
      return true;
    },
  },
};

export default reviewResolvers;
