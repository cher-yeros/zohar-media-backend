import { MyContext } from "../index";
import { requireAuth } from "../utils/graphql-auth";
import Inquiry from "../models/inquiry.model";
import TeamMember from "../models/team_member.model";
import BusinessStatistics from "../models/business_statistics.model";
import { InquiryStatus, InquiryType } from "../enums";
import { getOrCreateAnalyticsForToday } from "../utils/analytics-day";
import {
  inquiryStatusFromGraphQL,
  inquiryStatusToGraphQL,
  inquiryTypeFromGraphQL,
  inquiryTypeToGraphQL,
} from "../utils/inquiry-enum-map";

const inquiryResolvers = {
  Inquiry: {
    status: (parent: { status?: string }) =>
      inquiryStatusToGraphQL(parent.status),
    type: (parent: { type?: string }) => inquiryTypeToGraphQL(parent.type),
  },
  Query: {
    inquiries: async (
      _: any,
      {
        status,
        type,
        assigned_to,
        limit = 10,
        offset = 0,
      }: {
        status?: string;
        type?: string;
        assigned_to?: string;
        limit?: number;
        offset?: number;
      },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const where: any = {};
        if (status) where.status = inquiryStatusFromGraphQL(status);
        if (type) where.type = inquiryTypeFromGraphQL(type);
        if (assigned_to) where.assigned_to = assigned_to;

        const inquiries = await Inquiry.findAndCountAll({
          where,
          include: [{ model: TeamMember, as: "assigned_team_member" }],
          limit,
          offset,
          order: [["inquiry_date", "DESC"]],
        });

        return {
          items: inquiries.rows,
          total: inquiries.count,
        };
      } catch (error) {
        throw new Error("Failed to fetch inquiries");
      }
    },
    inquiry: async (_: any, { id }: { id: string }, context: MyContext) => {
      requireAuth(context);
      try {
        const inquiry = await Inquiry.findByPk(id, {
          include: [{ model: TeamMember, as: "assigned_team_member" }],
        });
        if (!inquiry) {
          throw new Error("Inquiry not found");
        }
        return inquiry;
      } catch (error) {
        throw new Error("Failed to fetch inquiry");
      }
    },
  },
  Mutation: {
    createInquiry: async (
      _: any,
      {
        name,
        email,
        subject,
        message,
        type: typeArg,
      }: {
        name: string;
        email: string;
        subject: string;
        message: string;
        type?: string;
      },
      context: MyContext,
    ) => {
      try {
        const type =
          typeArg !== undefined && typeArg !== null
            ? inquiryTypeFromGraphQL(String(typeArg))
            : InquiryType.GENERAL;

        const inquiry = await Inquiry.create({
          name,
          email,
          subject,
          message,
          type,
        });

        try {
          const analyticsRow = await getOrCreateAnalyticsForToday();
          await analyticsRow.increment({
            inquiries_total: 1,
            inquiries_this_month: 1,
          });
        } catch (e) {
          console.error("createInquiry: analytics bump failed", e);
        }

        try {
          let stats = await BusinessStatistics.findOne();
          if (!stats) {
            stats = await BusinessStatistics.create({
              completed_projects: 0,
              happy_clients: 0,
              perspective_clients: 0,
              total_revenue: 0,
              average_project_value: 0,
              is_public: true,
              auto_update: true,
            });
          }
          if (stats.auto_update) {
            await stats.increment({ perspective_clients: 1 });
          }
        } catch (e) {
          console.error("createInquiry: business stats bump failed", e);
        }

        return {
          success: true,
          message: "Inquiry submitted successfully",
          inquiry,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to create inquiry",
        );
      }
    },
    updateInquiry: async (
      _: any,
      {
        id,
        status,
        assigned_to,
        response,
      }: {
        id: string;
        status?: string;
        assigned_to?: string;
        response?: string;
      },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const inquiry = await Inquiry.findByPk(id);
        if (!inquiry) {
          throw new Error("Inquiry not found");
        }

        const updateData: any = {};
        if (status !== undefined && status !== null && status !== "") {
          updateData.status = inquiryStatusFromGraphQL(String(status));
        }
        if (assigned_to) updateData.assigned_to = assigned_to;
        if (response) {
          updateData.response = response;
          updateData.response_date = new Date();
        }

        await inquiry.update(updateData);

        const updatedInquiry = await Inquiry.findByPk(id, {
          include: [{ model: TeamMember, as: "assigned_team_member" }],
        });

        return {
          success: true,
          message: "Inquiry updated successfully",
          inquiry: updatedInquiry,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to update inquiry",
        );
      }
    },
    deleteInquiry: async (
      _: any,
      { id }: { id: string },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const inquiry = await Inquiry.findByPk(id);
        if (!inquiry) {
          throw new Error("Inquiry not found");
        }

        await inquiry.destroy();
        return {
          success: true,
          message: "Inquiry deleted successfully",
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to delete inquiry",
        );
      }
    },
  },
};

export default inquiryResolvers;
