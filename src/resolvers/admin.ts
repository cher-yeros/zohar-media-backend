import BibleStudySession from "../models/bible_study_session.model";
import Blog from "../models/blog.model";
import Visitor from "../models/visitor.model";
import Partnership from "../models/partnership.model";
import Payment from "../models/payment.model";
import User from "../models/user.model";
import { UserType } from "../types/resolvers-types";
import { SubscriptionStatus, UserRole } from "../enums";
import TeachingSubscription from "../models/subscription.model";
import Package from "../models/package.model";

const adminesolvers = {
  Query: {
    stats: async (_: any, __: any, { user }: { user: UserType }) => {
      if (user.role !== UserRole.ADMIN) return {};

      const partners = await Partnership.count();
      const members = await User.count();
      const blogs = await Blog.count();

      const propheticSchoolSessions = await BibleStudySession.count();
      const visitors = await Visitor.count();

      const foreign_txn = await Payment.sum("amount", {
        where: { currency: "USD", status: "COMPLETED" },
      });
      const local_txn = await Payment.sum("amount", {
        where: { currency: "ETB", status: "COMPLETED" },
      });

      const recentTransactions = await Payment.findAll({
        where: {
          status: "COMPLETED",
        },
        order: [["createdAt", "Desc"]],
        limit: 10,
      });

      const subscriptions = await TeachingSubscription.findAll({
        where: {
          status: SubscriptionStatus.ACTIVE,
        },
        include: [User, Payment, Package],
        order: [["createdAt", "Desc"]],
        limit: 10,
      });

      console.log(subscriptions);

      console.log(
        subscriptions?.map((sub) => ({
          ...sub.dataValues,
          user: sub.user.dataValues,
          package: sub.package.dataValues,
          payment: sub.payment.dataValues,
        }))
      );

      return {
        partners,
        members,
        foreign_txn,
        local_txn,
        blogs,
        propheticSchoolSessions,
        visitors,
        recentTransactions,
        subscriptions: subscriptions?.map((sub) => ({
          ...sub.dataValues,
          user: sub.user.dataValues,
          package: sub.package.dataValues,
          payment: sub.payment.dataValues,
        })),
      };
    },
  },
};

export default adminesolvers;
