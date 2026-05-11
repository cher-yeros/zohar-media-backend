import { MyContext } from "../index";
import { requireAuth } from "../utils/graphql-auth";
import Testimonial from "../models/testimonial.model";
import PortfolioItem from "../models/portfolio_item.model";
import { TestimonialStatus } from "../enums";

const testimonialResolvers = {
  TestimonialStatus: {
    PENDING: TestimonialStatus.PENDING,
    APPROVED: TestimonialStatus.APPROVED,
    REJECTED: TestimonialStatus.REJECTED,
  },
  Query: {
    testimonials: async (
      _: any,
      {
        status,
        featured,
        portfolio_item_id,
        limit = 10,
        offset = 0,
      }: {
        status?: TestimonialStatus;
        featured?: boolean;
        portfolio_item_id?: string;
        limit?: number;
        offset?: number;
      },
      context: MyContext,
    ) => {
      try {
        const where: any = {};
        if (!context.user?.id) {
          where.status = TestimonialStatus.APPROVED;
        } else if (status) {
          where.status = status;
        }
        if (featured !== undefined) where.featured = featured;
        if (portfolio_item_id) where.portfolio_item_id = portfolio_item_id;

        const testimonials = await Testimonial.findAndCountAll({
          where,
          include: [{ model: PortfolioItem, as: "portfolio_item" }],
          limit,
          offset,
          order: [["createdAt", "DESC"]],
        });

        return {
          items: testimonials.rows,
          total: testimonials.count,
        };
      } catch (error) {
        throw new Error("Failed to fetch testimonials");
      }
    },
    testimonial: async (_: any, { id }: { id: string }, context: MyContext) => {
      try {
        const testimonial = await Testimonial.findByPk(id, {
          include: [{ model: PortfolioItem, as: "portfolio_item" }],
        });
        if (!testimonial) {
          throw new Error("Testimonial not found");
        }
        if (
          !context.user?.id &&
          testimonial.status !== TestimonialStatus.APPROVED
        ) {
          throw new Error("Testimonial not found");
        }
        return testimonial;
      } catch (error) {
        throw new Error("Failed to fetch testimonial");
      }
    },
  },
  Mutation: {
    createTestimonial: async (
      _: any,
      {
        name,
        company,
        message,
        rating,
        testimonial_date,
        portfolio_item_id,
        avatar_url,
      }: {
        name: string;
        company?: string;
        message: string;
        rating?: number;
        testimonial_date: string;
        portfolio_item_id?: string;
        avatar_url?: string;
      },
      context: MyContext,
    ) => {
      try {
        const testimonial = await Testimonial.create({
          name,
          company,
          message,
          rating,
          testimonial_date: new Date(testimonial_date),
          portfolio_item_id,
          avatar_url,
        });

        return {
          success: true,
          message: "Testimonial created successfully",
          testimonial,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to create testimonial",
        );
      }
    },
    updateTestimonial: async (
      _: any,
      {
        id,
        name,
        company,
        message,
        rating,
        testimonial_date,
        status,
        featured,
        portfolio_item_id,
        avatar_url,
      }: {
        id: string;
        name?: string;
        company?: string;
        message?: string;
        rating?: number;
        testimonial_date?: string;
        status?: TestimonialStatus;
        featured?: boolean;
        portfolio_item_id?: string;
        avatar_url?: string;
      },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const testimonial = await Testimonial.findByPk(id);
        if (!testimonial) {
          throw new Error("Testimonial not found");
        }

        await testimonial.update({
          name: name || testimonial.name,
          company: company !== undefined ? company : testimonial.company,
          message: message || testimonial.message,
          rating: rating !== undefined ? rating : testimonial.rating,
          testimonial_date: testimonial_date
            ? new Date(testimonial_date)
            : testimonial.testimonial_date,
          status: status || testimonial.status,
          featured: featured !== undefined ? featured : testimonial.featured,
          portfolio_item_id:
            portfolio_item_id !== undefined
              ? portfolio_item_id
              : testimonial.portfolio_item_id,
          avatar_url:
            avatar_url !== undefined ? avatar_url : testimonial.avatar_url,
        });

        const updatedTestimonial = await Testimonial.findByPk(id, {
          include: [{ model: PortfolioItem, as: "portfolio_item" }],
        });

        return {
          success: true,
          message: "Testimonial updated successfully",
          testimonial: updatedTestimonial,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to update testimonial",
        );
      }
    },
    deleteTestimonial: async (
      _: any,
      { id }: { id: string },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const testimonial = await Testimonial.findByPk(id);
        if (!testimonial) {
          throw new Error("Testimonial not found");
        }

        await testimonial.destroy();
        return {
          success: true,
          message: "Testimonial deleted successfully",
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to delete testimonial",
        );
      }
    },
  },
};

export default testimonialResolvers;
