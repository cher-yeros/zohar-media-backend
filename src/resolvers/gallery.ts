import Gallery from "../models/gallery.model";
import GalleryCategory from "../models/gallery_category.model";
import ServiceCategory from "../models/service_category.model";
import {
  CreateGalleryCategoryInputType,
  CreateGalleryInputType,
  UpdateGalleryCategoryInputType,
  UpdateGalleryInputType,
} from "../types/resolvers-types";

const galleryResolvels = {
  Query: {
    galleries: async () => {
      try {
        const galleries = await Gallery.findAll({
          include: [GalleryCategory],
          order: [["createdAt", "DESC"]],
        });
        return galleries;
      } catch (error) {
        throw new Error("Error fetching galleries");
      }
    },
    galleriesForUsers: async () => {
      try {
        const galleries = await Gallery.findAll({
          order: [["createdAt", "DESC"]],
          include: [ServiceCategory],
        });
        return galleries;
      } catch (error) {
        console.log(error);
        throw new Error("Error fetching galleries for users");
      }
    },
    galleryCategories: async () => {
      try {
        const galleryCategories = await GalleryCategory.findAll({
          include: [Gallery],
          // order: [["createdAt", "DESC"]],
        });
        return galleryCategories;
      } catch (error) {
        throw new Error("Error fetching gallery categories");
      }
    },
    galleryCategoryForUsers: async () => {
      try {
        const galleryCategories = await GalleryCategory.findAll({
          include: [Gallery],
          // order: [["createdAt", "DESC"]],
        });
        return galleryCategories;
      } catch (error) {
        throw new Error("Error fetching gallery categories for users");
      }
    },
  },
  Mutation: {
    createGallery: async (
      _: any,
      { input }: { input: CreateGalleryInputType }
    ) => {
      try {
        const gallery = await Gallery.create({
          title: input.title,
          images: input.images,
          city: input.city,
          gallery_category_id: input.gallery_category_id,
        });
        return gallery;
      } catch (error) {
        throw new Error("Error creating gallery");
      }
    },
    updateGallery: async (
      _: any,
      { input }: { input: UpdateGalleryInputType }
    ) => {
      try {
        const [updated] = await Gallery.update(
          {
            title: input.title,
            image: input.image,
            gallery_category_id: input.gallery_category_id,
          },
          {
            where: { id: input.id },
          }
        );
        return updated > 0; // Return true if at least one row was affected
      } catch (error) {
        throw new Error("Error updating gallery");
      }
    },
    deleteGallery: async (_: any, { id }: { id: number }) => {
      try {
        const result = await Gallery.destroy({
          where: { id },
        });
        return result > 0; // Return true if at least one row was affected
      } catch (error) {
        throw new Error("Error deleting gallery");
      }
    },
    createGalleryCategory: async (
      _: any,
      { input }: { input: CreateGalleryCategoryInputType }
    ) => {
      try {
        const serviceCategory = await GalleryCategory.create({
          title: input.title,
        });
        return serviceCategory;
      } catch (error) {
        throw new Error("Error creating service category");
      }
    },
    updateGalleryCategory: async (
      _: any,
      { input }: { input: UpdateGalleryCategoryInputType }
    ) => {
      try {
        const [updated] = await GalleryCategory.update(
          {
            title: input.title,
          },
          {
            where: { id: input.id },
          }
        );
        return updated > 0; // Return true if at least one row was affected
      } catch (error) {
        throw new Error("Error updating service category");
      }
    },
    deleteGalleryCategory: async (_: any, { id }: { id: number }) => {
      try {
        const result = await GalleryCategory.destroy({
          where: { id },
        });
        return result > 0; // Return true if at least one row was affected
      } catch (error) {
        throw new Error("Error deleting service category");
      }
    },
  },
};

export default galleryResolvels;
