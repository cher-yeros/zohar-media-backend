import BibleStudySession from "../models/bible_study_session.model";
import Blog from "../models/blog.model";
import Visitor from "../models/visitor.model";
import Partnership from "../models/partnership.model";
import Payment from "../models/payment.model";
import User from "../models/user.model";
import { UserType } from "../types/resolvers-types";
import { UserRole } from "../enums";

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
        where: { payment_method: "Paypal", status: "COMPLETED" },
      });
      const local_txn = await Payment.sum("amount", {
        where: { payment_method: "Local Currency", status: "COMPLETED" },
      });

      const recentTransactions = await Payment.findAll({
        where: {
          status: "COMPLETED",
        },
        order: [["createdAt", "Desc"]],
        limit: 10,
      });

      return {
        partners,
        members,
        foreign_txn,
        local_txn,
        blogs,
        propheticSchoolSessions,
        visitors,
        recentTransactions,
      };
    },
  },
};

export default adminesolvers;
