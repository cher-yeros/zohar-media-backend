import { MyContext } from "../index";
import GalleryPhoto from "../models/gallery_photo.model";

const galleryResolvers = {
  GalleryPhoto: {
    updated_at: (parent: GalleryPhoto) => parent.updatedAt,
  },
  Query: {
    publicGalleryPhotos: async () => {
      const rows = await GalleryPhoto.findAll({
        where: { is_published: true },
        order: [
          ["sort_order", "ASC"],
          ["createdAt", "ASC"],
        ],
      });
      return rows;
    },
    galleryPhotosAdmin: async (
      _: unknown,
      __: unknown,
      _context: MyContext,
    ) => {
      const rows = await GalleryPhoto.findAll({
        order: [
          ["sort_order", "ASC"],
          ["createdAt", "ASC"],
        ],
      });
      return rows;
    },
  },
  Mutation: {
    createGalleryPhoto: async (
      _: unknown,
      {
        image_url,
        alt_text,
        sort_order,
        is_published,
      }: {
        image_url: string;
        alt_text?: string;
        sort_order?: number;
        is_published?: boolean;
      },
      _context: MyContext,
    ) => {
      try {
        const photo = await GalleryPhoto.create({
          image_url,
          alt_text,
          sort_order: sort_order ?? 0,
          is_published: is_published ?? true,
        });
        return {
          success: true,
          message: "Gallery photo created",
          galleryPhoto: photo,
        };
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create gallery photo";
        return { success: false, message, galleryPhoto: null };
      }
    },
    updateGalleryPhoto: async (
      _: unknown,
      {
        id,
        image_url,
        alt_text,
        sort_order,
        is_published,
      }: {
        id: string;
        image_url?: string;
        alt_text?: string | null;
        sort_order?: number | null;
        is_published?: boolean;
      },
      _context: MyContext,
    ) => {
      try {
        const photo = await GalleryPhoto.findByPk(id);
        if (!photo) {
          return {
            success: false,
            message: "Gallery photo not found",
            galleryPhoto: null,
          };
        }
        await photo.update({
          ...(image_url !== undefined && { image_url }),
          ...(alt_text !== undefined && { alt_text }),
          ...(sort_order !== undefined &&
            sort_order !== null && { sort_order }),
          ...(is_published !== undefined && { is_published }),
        });
        return {
          success: true,
          message: "Gallery photo updated",
          galleryPhoto: photo,
        };
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update gallery photo";
        return { success: false, message, galleryPhoto: null };
      }
    },
    deleteGalleryPhoto: async (
      _: unknown,
      { id }: { id: string },
      _context: MyContext,
    ) => {
      try {
        const photo = await GalleryPhoto.findByPk(id);
        if (!photo) {
          return {
            success: false,
            message: "Gallery photo not found",
            galleryPhoto: null,
          };
        }
        await photo.destroy();
        return {
          success: true,
          message: "Gallery photo deleted",
          galleryPhoto: null,
        };
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to delete gallery photo";
        return { success: false, message, galleryPhoto: null };
      }
    },
  },
};

export default galleryResolvers;
