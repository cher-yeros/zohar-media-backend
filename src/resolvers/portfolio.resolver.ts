import { MyContext } from "../index";
import { requireAuth } from "../utils/graphql-auth";
import PortfolioItem from "../models/portfolio_item.model";
import PortfolioCategory from "../models/portfolio_category.model";
import PortfolioItemImage from "../models/portfolio_item_image.model";
import PortfolioItemTag from "../models/portfolio_item_tag.model";
import PortfolioItemTechnology from "../models/portfolio_item_technology.model";
import PortfolioItemTeamMember from "../models/portfolio_item_team_member.model";
import { PortfolioItemStatus } from "../enums";

const GQL_TO_DB_STATUS: Record<string, PortfolioItemStatus> = {
  COMPLETED: PortfolioItemStatus.COMPLETED,
  IN_PROGRESS: PortfolioItemStatus.IN_PROGRESS,
  DRAFT: PortfolioItemStatus.DRAFT,
};

const DB_TO_GQL_STATUS: Record<string, "COMPLETED" | "IN_PROGRESS" | "DRAFT"> =
  {
    [PortfolioItemStatus.COMPLETED]: "COMPLETED",
    [PortfolioItemStatus.IN_PROGRESS]: "IN_PROGRESS",
    [PortfolioItemStatus.DRAFT]: "DRAFT",
  };

function toDbStatus(status?: unknown): PortfolioItemStatus | undefined {
  if (typeof status !== "string") return undefined;
  // Accept both GraphQL enum ("COMPLETED") and legacy DB values ("completed")
  return (
    GQL_TO_DB_STATUS[status] ||
    (Object.values(PortfolioItemStatus).includes(status as PortfolioItemStatus)
      ? (status as PortfolioItemStatus)
      : undefined)
  );
}

const portfolioResolvers = {
  Query: {
    portfolioCategories: async (_: any, __: any, context: MyContext) => {
      try {
        const categories = await PortfolioCategory.findAll();
        return categories;
      } catch (error) {
        throw new Error("Failed to fetch portfolio categories");
      }
    },
    portfolioCategory: async (
      _: any,
      { id }: { id: string },
      context: MyContext,
    ) => {
      try {
        const category = await PortfolioCategory.findByPk(id);
        if (!category) {
          throw new Error("Portfolio category not found");
        }
        return category;
      } catch (error) {
        throw new Error("Failed to fetch portfolio category");
      }
    },
    portfolioItems: async (
      _: any,
      {
        category_id,
        status,
        featured,
        limit = 10,
        offset = 0,
      }: {
        category_id?: string;
        status?: any;
        featured?: boolean;
        limit?: number;
        offset?: number;
      },
      context: MyContext,
    ) => {
      try {
        const where: any = {};
        if (category_id) where.category_id = category_id;
        const dbStatus = toDbStatus(status);
        const staff = context.user?.id;
        if (!staff) {
          where.status = PortfolioItemStatus.COMPLETED;
        } else if (dbStatus) {
          where.status = dbStatus;
        }
        if (featured !== undefined) where.featured = featured;

        const portfolioItems = await PortfolioItem.findAndCountAll({
          where,
          include: [
            { model: PortfolioCategory, as: "category" },
            { model: PortfolioItemImage, as: "images" },
            { model: PortfolioItemTag, as: "tags" },
            { model: PortfolioItemTechnology, as: "technologies" },
            { model: PortfolioItemTeamMember, as: "team_members" },
          ],
          limit,
          offset,
          order: [["createdAt", "DESC"]],
        });

        return {
          items: portfolioItems.rows,
          total: portfolioItems.count,
        };
      } catch (error) {
        throw new Error("Failed to fetch portfolio items");
      }
    },
    portfolioItem: async (
      _: any,
      { id }: { id: string },
      context: MyContext,
    ) => {
      try {
        const portfolioItem = await PortfolioItem.findByPk(id, {
          include: [
            { model: PortfolioCategory, as: "category" },
            { model: PortfolioItemImage, as: "images" },
            { model: PortfolioItemTag, as: "tags" },
            { model: PortfolioItemTechnology, as: "technologies" },
            { model: PortfolioItemTeamMember, as: "team_members" },
          ],
        });
        if (!portfolioItem) {
          throw new Error("Portfolio item not found");
        }
        if (
          !context.user?.id &&
          portfolioItem.status !== PortfolioItemStatus.COMPLETED
        ) {
          throw new Error("Portfolio item not found");
        }
        return portfolioItem;
      } catch (error) {
        throw new Error("Failed to fetch portfolio item");
      }
    },
  },
  Mutation: {
    createPortfolioCategory: async (
      _: any,
      {
        name,
        description,
        color,
      }: { name: string; description?: string; color: string },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const category = await PortfolioCategory.create({
          name,
          description,
          color,
        });

        return {
          success: true,
          message: "Portfolio category created successfully",
          category,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to create portfolio category",
        );
      }
    },
    updatePortfolioCategory: async (
      _: any,
      {
        id,
        name,
        description,
        color,
      }: { id: string; name?: string; description?: string; color?: string },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const category = await PortfolioCategory.findByPk(id);
        if (!category) {
          throw new Error("Portfolio category not found");
        }

        await category.update({
          name: name || category.name,
          description:
            description !== undefined ? description : category.description,
          color: color || category.color,
        });

        return {
          success: true,
          message: "Portfolio category updated successfully",
          category,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to update portfolio category",
        );
      }
    },
    deletePortfolioCategory: async (
      _: any,
      { id }: { id: string },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const category = await PortfolioCategory.findByPk(id);
        if (!category) {
          throw new Error("Portfolio category not found");
        }

        await category.destroy();
        return {
          success: true,
          message: "Portfolio category deleted successfully",
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to delete portfolio category",
        );
      }
    },
    createPortfolioItem: async (
      _: any,
      {
        title,
        description,
        category_id,
        thumbnail_url,
        client_name,
        project_date,
        status = PortfolioItemStatus.COMPLETED,
        featured = false,
        project_url,
        testimonial,
        images = [],
        tags = [],
        technologies = [],
        team_members = [],
      }: {
        title: string;
        description: string;
        category_id?: string;
        thumbnail_url?: string;
        client_name?: string;
        project_date: string;
        status?: any;
        featured?: boolean;
        project_url?: string;
        testimonial?: string;
        images?: {
          image_url: string;
          alt_text?: string;
          sort_order?: number;
        }[];
        tags?: string[];
        technologies?: string[];
        team_members?: { team_member_id: string; role?: string }[];
      },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const dbStatus = toDbStatus(status) ?? PortfolioItemStatus.COMPLETED;
        const portfolioItem = await PortfolioItem.create({
          title,
          description,
          category_id,
          thumbnail_url,
          client_name,
          project_date: new Date(project_date),
          status: dbStatus,
          featured,
          project_url,
          testimonial,
        });

        // Add images
        if (images.length > 0) {
          await Promise.all(
            images.map((image) =>
              PortfolioItemImage.create({
                portfolio_item_id: portfolioItem.id,
                image_url: image.image_url,
                alt_text: image.alt_text,
                sort_order: image.sort_order || 0,
              }),
            ),
          );
        }

        // Add tags
        if (tags.length > 0) {
          await Promise.all(
            tags.map((tag) =>
              PortfolioItemTag.create({
                portfolio_item_id: portfolioItem.id,
                tag_name: tag,
              }),
            ),
          );
        }

        // Add technologies
        if (technologies.length > 0) {
          await Promise.all(
            technologies.map((technology) =>
              PortfolioItemTechnology.create({
                portfolio_item_id: portfolioItem.id,
                technology_name: technology,
              }),
            ),
          );
        }

        // Add team members
        if (team_members.length > 0) {
          await Promise.all(
            team_members.map((member) =>
              PortfolioItemTeamMember.create({
                portfolio_item_id: portfolioItem.id,
                team_member_id: member.team_member_id,
                role: member.role,
              }),
            ),
          );
        }

        const createdItem = await PortfolioItem.findByPk(portfolioItem.id, {
          include: [
            { model: PortfolioCategory, as: "category" },
            { model: PortfolioItemImage, as: "images" },
            { model: PortfolioItemTag, as: "tags" },
            { model: PortfolioItemTechnology, as: "technologies" },
            { model: PortfolioItemTeamMember, as: "team_members" },
          ],
        });

        return {
          success: true,
          message: "Portfolio item created successfully",
          portfolioItem: createdItem,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to create portfolio item",
        );
      }
    },
    updatePortfolioItem: async (
      _: any,
      {
        id,
        title,
        description,
        category_id,
        thumbnail_url,
        client_name,
        project_date,
        status,
        featured,
        project_url,
        testimonial,
        images = [],
        tags = [],
        technologies = [],
        team_members = [],
      }: {
        id: string;
        title?: string;
        description?: string;
        category_id?: string;
        thumbnail_url?: string;
        client_name?: string;
        project_date?: string;
        status?: any;
        featured?: boolean;
        project_url?: string;
        testimonial?: string;
        images?: {
          image_url: string;
          alt_text?: string;
          sort_order?: number;
        }[];
        tags?: string[];
        technologies?: string[];
        team_members?: { team_member_id: string; role?: string }[];
      },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const portfolioItem = await PortfolioItem.findByPk(id);
        if (!portfolioItem) {
          throw new Error("Portfolio item not found");
        }

        const dbStatus = toDbStatus(status);
        await portfolioItem.update({
          title: title || portfolioItem.title,
          description: description || portfolioItem.description,
          category_id:
            category_id !== undefined ? category_id : portfolioItem.category_id,
          thumbnail_url:
            thumbnail_url !== undefined
              ? thumbnail_url
              : portfolioItem.thumbnail_url,
          client_name:
            client_name !== undefined ? client_name : portfolioItem.client_name,
          project_date: project_date
            ? new Date(project_date)
            : portfolioItem.project_date,
          status: dbStatus || portfolioItem.status,
          featured: featured !== undefined ? featured : portfolioItem.featured,
          project_url:
            project_url !== undefined ? project_url : portfolioItem.project_url,
          testimonial:
            testimonial !== undefined ? testimonial : portfolioItem.testimonial,
        });

        // Update images
        if (images.length > 0) {
          await PortfolioItemImage.destroy({
            where: { portfolio_item_id: id },
          });
          await Promise.all(
            images.map((image) =>
              PortfolioItemImage.create({
                portfolio_item_id: id,
                image_url: image.image_url,
                alt_text: image.alt_text,
                sort_order: image.sort_order || 0,
              }),
            ),
          );
        }

        // Update tags
        if (tags.length > 0) {
          await PortfolioItemTag.destroy({ where: { portfolio_item_id: id } });
          await Promise.all(
            tags.map((tag) =>
              PortfolioItemTag.create({
                portfolio_item_id: id,
                tag_name: tag,
              }),
            ),
          );
        }

        // Update technologies
        if (technologies.length > 0) {
          await PortfolioItemTechnology.destroy({
            where: { portfolio_item_id: id },
          });
          await Promise.all(
            technologies.map((technology) =>
              PortfolioItemTechnology.create({
                portfolio_item_id: id,
                technology_name: technology,
              }),
            ),
          );
        }

        // Update team members
        if (team_members.length > 0) {
          await PortfolioItemTeamMember.destroy({
            where: { portfolio_item_id: id },
          });
          await Promise.all(
            team_members.map((member) =>
              PortfolioItemTeamMember.create({
                portfolio_item_id: id,
                team_member_id: member.team_member_id,
                role: member.role,
              }),
            ),
          );
        }

        const updatedItem = await PortfolioItem.findByPk(id, {
          include: [
            { model: PortfolioCategory, as: "category" },
            { model: PortfolioItemImage, as: "images" },
            { model: PortfolioItemTag, as: "tags" },
            { model: PortfolioItemTechnology, as: "technologies" },
            { model: PortfolioItemTeamMember, as: "team_members" },
          ],
        });

        return {
          success: true,
          message: "Portfolio item updated successfully",
          portfolioItem: updatedItem,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to update portfolio item",
        );
      }
    },
    deletePortfolioItem: async (
      _: any,
      { id }: { id: string },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const portfolioItem = await PortfolioItem.findByPk(id);
        if (!portfolioItem) {
          throw new Error("Portfolio item not found");
        }

        await portfolioItem.destroy();
        return {
          success: true,
          message: "Portfolio item deleted successfully",
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to delete portfolio item",
        );
      }
    },
  },
  PortfolioItem: {
    status: (parent: any) => {
      const raw = parent?.status;
      if (typeof raw !== "string") return "COMPLETED";
      return DB_TO_GQL_STATUS[raw] ?? "COMPLETED";
    },
  },
  PortfolioCategory: {
    portfolio_items: async (parent: any) => {
      const loaded = parent?.portfolio_items;
      if (Array.isArray(loaded)) return loaded;

      const categoryId = parent?.id;
      if (!categoryId) return [];

      const items = await PortfolioItem.findAll({
        where: { category_id: categoryId },
        order: [["createdAt", "DESC"]],
      });
      return items ?? [];
    },
  },
};

export default portfolioResolvers;
