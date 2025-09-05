import { MyContext } from "../index";
import Inquiry from "../models/inquiry.model";
import TeamMember from "../models/team_member.model";
import { InquiryStatus, InquiryType } from "../enums";

const inquiryResolvers = {
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
        status?: InquiryStatus;
        type?: InquiryType;
        assigned_to?: string;
        limit?: number;
        offset?: number;
      },
      context: MyContext
    ) => {
      try {
        const where: any = {};
        if (status) where.status = status;
        if (type) where.type = type;
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
        type = InquiryType.GENERAL,
      }: {
        name: string;
        email: string;
        subject: string;
        message: string;
        type?: InquiryType;
      },
      context: MyContext
    ) => {
      try {
        const inquiry = await Inquiry.create({
          name,
          email,
          subject,
          message,
          type,
        });

        return {
          success: true,
          message: "Inquiry submitted successfully",
          inquiry,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to create inquiry"
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
        status?: InquiryStatus;
        assigned_to?: string;
        response?: string;
      },
      context: MyContext
    ) => {
      try {
        const inquiry = await Inquiry.findByPk(id);
        if (!inquiry) {
          throw new Error("Inquiry not found");
        }

        const updateData: any = {};
        if (status) updateData.status = status;
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
          error instanceof Error ? error.message : "Failed to update inquiry"
        );
      }
    },
    deleteInquiry: async (
      _: any,
      { id }: { id: string },
      context: MyContext
    ) => {
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
          error instanceof Error ? error.message : "Failed to delete inquiry"
        );
      }
    },
  },
};

export default inquiryResolvers;
