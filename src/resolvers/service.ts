import Service from "../models/service.model";
import ServiceCategory from "../models/service_category.model";
import {
  CreateServiceCategoryInputType,
  CreateServiceInputType,
  UpdateServiceCategoryInputType,
  UpdateServiceInputType,
} from "../types/resolvers-types";

const serviceResolvers = {
  Query: {
    services: async () => {
      try {
        const services = await Service.findAll({
          include: [ServiceCategory],
          order: [["createdAt", "DESC"]],
        });
        return services;
      } catch (error) {
        throw new Error("Error fetching services");
      }
    },
    servicesForUsers: async () => {
      try {
        const services = await Service.findAll({
          order: [["createdAt", "DESC"]],
        });
        return services;
      } catch (error) {
        throw new Error("Error fetching services for users");
      }
    },
    serviceCategories: async () => {
      try {
        const serviceCategories = await ServiceCategory.findAll({
          include: [Service],
          // order: [["createdAt", "DESC"]],
        });
        return serviceCategories;
      } catch (error) {
        throw new Error("Error fetching service categories");
      }
    },
    serviceCategoryForUsers: async () => {
      try {
        const serviceCategories = await ServiceCategory.findAll({
          include: [Service],
          // order: [["createdAt", "DESC"]],
        });
        return serviceCategories;
      } catch (error) {
        throw new Error("Error fetching service categories for users");
      }
    },
  },
  Mutation: {
    createService: async (
      _: any,
      { input }: { input: CreateServiceInputType }
    ) => {
      try {
        const service = await Service.create({
          ...input,
          service_day: "-",
          service_date: new Date(),
        });
        return service;
      } catch (error) {
        console.log(error);
        throw new Error("Error creating service");
      }
    },
    updateService: async (
      _: any,
      { input }: { input: UpdateServiceInputType }
    ) => {
      try {
        const [updated] = await Service.update(
          {
            service_day: "-",
            service_date: new Date(),
            youtube_link: input.youtube_link,
            service_category_id: input.service_category_id,
          },
          {
            where: { id: input.id },
          }
        );
        return updated > 0; // Return true if at least one row was affected
      } catch (error) {
        throw new Error("Error updating service");
      }
    },
    deleteService: async (_: any, { id }: { id: number }) => {
      try {
        const result = await Service.destroy({
          where: { id },
        });
        return result > 0; // Return true if at least one row was affected
      } catch (error) {
        throw new Error("Error deleting service");
      }
    },
    createServiceCategory: async (
      _: any,
      { input }: { input: CreateServiceCategoryInputType }
    ) => {
      try {
        const serviceCategory = await ServiceCategory.create({
          title: input.title,
          playlist_link: input.playlist_link,
        });
        return serviceCategory;
      } catch (error) {
        throw new Error("Error creating service category");
      }
    },
    updateServiceCategory: async (
      _: any,
      { input }: { input: UpdateServiceCategoryInputType }
    ) => {
      try {
        const [updated] = await ServiceCategory.update(
          {
            title: input.title,
            playlist_link: input.playlist_link,
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
    deleteServiceCategory: async (_: any, { id }: { id: number }) => {
      try {
        const result = await ServiceCategory.destroy({
          where: { id },
        });
        return result > 0; // Return true if at least one row was affected
      } catch (error) {
        throw new Error("Error deleting service category");
      }
    },
  },
};

export default serviceResolvers;
