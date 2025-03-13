import Blog from "../models/blog.model";
import Category from "../models/category.model";
import Tag from "../models/tag.model";
import User from "../models/user.model";
import {
  CreateBlogInputType,
  CreateCategoryInputType,
  CreateTagInputType,
  UpdateBlogInputType,
  UpdateCategoryInputType,
  UpdateTagInputType,
  UserType,
} from "../types/resolvers-types";

const blogResolvers = {
  Query: {
    blogs: async (_: any, __: any, { user }: { user: UserType }) => {
      const result = await Blog.findAll({
        include: [User, Category],
        order: [["createdAt", "Desc"]],
      });
      return result;
    },
    categories: async (_: any, __: any, { user }: { user: UserType }) => {
      const result = await Category.findAll({
        include: [Blog],
        order: [["createdAt", "Desc"]],
      });
      return result;
    },
    tags: async (_: any, __: any, { user }: { user: UserType }) => {
      const result = await Tag.findAll({
        include: [Blog],
        order: [["createdAt", "Desc"]],
      });
      return result;
    },
  },
  Mutation: {
    createBlog: async (
      _: any,
      { input }: { input: CreateBlogInputType },
      { user, pubsub }: { pubsub: any; user: UserType }
    ) => {
      const result = await Blog.create({
        ...input,
        slug: input.title.toLowerCase().replaceAll(" ", "-"),
        userId: user.id,
      });
      return result;
    },
    createCategory: async (
      _: any,
      { input }: { input: CreateCategoryInputType },
      { user, pubsub }: { pubsub: any; user: UserType }
    ) => {
      const result = await Category.create({
        ...input,
      });

      console.log(result);
      return result;
    },
    createTag: async (
      _: any,
      { input }: { input: CreateTagInputType },
      { user, pubsub }: { pubsub: any; user: UserType }
    ) => {
      const result = await Tag.create({
        ...input,
      });
      return result;
    },

    editBlog: async (
      _: any,
      { input }: { input: UpdateBlogInputType },
      { user }: { user: UserType }
    ) => {
      const result = await Blog.update(input, {
        where: { id: input.id },
      });
      return result[0] > 0; // Returns true if at least one row was affected
    },
    editCategory: async (
      _: any,
      { input }: { input: UpdateCategoryInputType }
    ) => {
      const result = await Category.update(input, {
        where: { id: input.id },
      });
      return result[0] > 0;
    },
    editTag: async (_: any, { input }: { input: UpdateTagInputType }) => {
      const result = await Tag.update(input, {
        where: { id: input.id },
      });
      return result[0] > 0;
    },
    deleteBlog: async (
      _: any,
      { id }: { id: number },
      { user }: { user: UserType }
    ) => {
      const result = await Blog.destroy({
        where: { id, userId: user.id },
      });
      return result > 0;
    },
    deleteCategory: async (_: any, { id }: { id: number }) => {
      const result = await Category.destroy({
        where: { id },
      });
      return result > 0;
    },
    deleteTag: async (_: any, { id }: { id: number }) => {
      const result = await Tag.destroy({
        where: { id },
      });
      return result > 0;
    },
  },
};
export default blogResolvers;
