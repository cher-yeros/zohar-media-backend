import { MyContext } from "../index";
import { requireAuth } from "../utils/graphql-auth";
import MediaItem from "../models/media_item.model";
import MediaItemTag from "../models/media_item_tag.model";
import { MediaType } from "../enums";
import sequelize from "../utils/db.connection";

function toDbMediaType(type?: string): MediaType | undefined {
  if (!type) return undefined;
  const normalized = String(type).toLowerCase();
  if (normalized === "image") return MediaType.IMAGE;
  if (normalized === "video") return MediaType.VIDEO;
  throw new Error(`Invalid media type: ${type}`);
}

function toGraphqlMediaType(type: unknown): "IMAGE" | "VIDEO" {
  const normalized = String(type ?? "").toLowerCase();
  if (normalized === "image") return "IMAGE";
  if (normalized === "video") return "VIDEO";
  // Fallback: keep schema happy, but surface issue clearly
  throw new Error(`Invalid media type value in DB: ${String(type)}`);
}

const mediaResolvers = {
  MediaItem: {
    type: (parent: any) => toGraphqlMediaType(parent.type),
  },
  Query: {
    mediaItems: async (
      _: any,
      {
        type,
        limit = 10,
        offset = 0,
      }: {
        type?: MediaType | "IMAGE" | "VIDEO";
        limit?: number;
        offset?: number;
      },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const where: any = {};
        if (type) where.type = toDbMediaType(type);

        const mediaItems = await MediaItem.findAndCountAll({
          where,
          include: [{ model: MediaItemTag, as: "tags" }],
          limit,
          offset,
          order: [["upload_date", "DESC"]],
        });

        return {
          items: mediaItems.rows,
          total: mediaItems.count,
        };
      } catch (error) {
        throw new Error("Failed to fetch media items");
      }
    },
    mediaItem: async (_: any, { id }: { id: string }, context: MyContext) => {
      requireAuth(context);
      try {
        const mediaItem = await MediaItem.findByPk(id, {
          include: [{ model: MediaItemTag, as: "tags" }],
        });
        if (!mediaItem) {
          throw new Error("Media item not found");
        }
        return mediaItem;
      } catch (error) {
        throw new Error("Failed to fetch media item");
      }
    },
  },
  Mutation: {
    createMediaItem: async (
      _: any,
      {
        title,
        type,
        url,
        thumbnail_url,
        file_size,
        dimensions,
        duration,
        tags = [],
      }: {
        title: string;
        type: MediaType | "IMAGE" | "VIDEO";
        url: string;
        thumbnail_url?: string;
        file_size?: string;
        dimensions?: string;
        duration?: string;
        tags?: string[];
      },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const mediaItem = await MediaItem.create({
          title,
          type: toDbMediaType(type) as MediaType,
          url,
          thumbnail_url,
          file_size,
          dimensions,
          duration,
        });

        // Add tags
        if (tags.length > 0) {
          await Promise.all(
            tags.map((tag) =>
              MediaItemTag.create({
                media_item_id: mediaItem.id,
                tag_name: tag,
              }),
            ),
          );
        }

        const createdItem = await MediaItem.findByPk(mediaItem.id, {
          include: [{ model: MediaItemTag, as: "tags" }],
        });

        return {
          success: true,
          message: "Media item created successfully",
          mediaItem: createdItem,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to create media item",
        );
      }
    },
    updateMediaItem: async (
      _: any,
      {
        id,
        title,
        type,
        url,
        thumbnail_url,
        file_size,
        dimensions,
        duration,
        tags = [],
      }: {
        id: string;
        title?: string;
        type?: MediaType | "IMAGE" | "VIDEO";
        url?: string;
        thumbnail_url?: string;
        file_size?: string;
        dimensions?: string;
        duration?: string;
        tags?: string[];
      },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const mediaItem = await MediaItem.findByPk(id);
        if (!mediaItem) {
          throw new Error("Media item not found");
        }

        await mediaItem.update({
          title: title || mediaItem.title,
          type: (type ? toDbMediaType(type) : mediaItem.type) as MediaType,
          url: url || mediaItem.url,
          thumbnail_url:
            thumbnail_url !== undefined
              ? thumbnail_url
              : mediaItem.thumbnail_url,
          file_size: file_size !== undefined ? file_size : mediaItem.file_size,
          dimensions:
            dimensions !== undefined ? dimensions : mediaItem.dimensions,
          duration: duration !== undefined ? duration : mediaItem.duration,
        });

        // Update tags
        if (tags.length > 0) {
          await MediaItemTag.destroy({ where: { media_item_id: id } });
          await Promise.all(
            tags.map((tag) =>
              MediaItemTag.create({
                media_item_id: id,
                tag_name: tag,
              }),
            ),
          );
        }

        const updatedItem = await MediaItem.findByPk(id, {
          include: [{ model: MediaItemTag, as: "tags" }],
        });

        return {
          success: true,
          message: "Media item updated successfully",
          mediaItem: updatedItem,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to update media item",
        );
      }
    },
    deleteMediaItem: async (
      _: any,
      { id }: { id: string },
      context: MyContext,
    ) => {
      requireAuth(context);
      try {
        const mediaItem = await MediaItem.findByPk(id);
        if (!mediaItem) {
          throw new Error("Media item not found");
        }

        await sequelize.transaction(async (transaction) => {
          await MediaItemTag.destroy({
            where: { media_item_id: id },
            transaction,
          });
          await mediaItem.destroy({ transaction });
        });
        return {
          success: true,
          message: "Media item deleted successfully",
        };
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to delete media item",
        );
      }
    },
  },
};

export default mediaResolvers;
