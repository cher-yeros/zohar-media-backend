import Teaching from "../models/teaching.model";
import TeachingCategory from "../models/teaching_category.model";

const teachingResolvers = {
  Query: {
    async getTeaching(_: any, { id }: { id: string }) {
      return await Teaching.findByPk(id, { include: [TeachingCategory] });
    },
    async getAllTeachings() {
      return await Teaching.findAll({
        include: [TeachingCategory],
      });
    },
    async getTeachings() {
      return await Teaching.findAll({
        where: { active: true },
        include: [TeachingCategory],
      });
    },
    async getTeachingCategories() {
      return await TeachingCategory.findAll({
        where: { active: true },
      });
    },
  },

  Mutation: {
    async createTeaching(_: any, { input }: { input: any }) {
      return await Teaching.create(input);
    },

    async updateTeaching(_: any, { input }: { input: any }) {
      const teaching = await Teaching.findByPk(input.id);
      if (!teaching) throw new Error("Teaching not found");
      return await teaching.update(input);
    },

    async deleteTeaching(_: any, { id }: { id: string }) {
      const teaching = await Teaching.findByPk(id);
      if (!teaching) throw new Error("Teaching not found");
      await teaching.destroy();
      return true;
    },
  },
  async createTeachingCategory(_: any, { input }: { input: any }) {
    return await TeachingCategory.create(input);
  },

  async updateTeachingCategory(_: any, { input }: { input: any }) {
    const teachingCategory = await TeachingCategory.findByPk(input.id);
    if (!teachingCategory) throw new Error("Teaching Category not found");
    return await teachingCategory.update(input);
  },

  async deleteTeachingCategory(_: any, { id }: { id: string }) {
    const teachingCategory = await TeachingCategory.findByPk(id);
    if (!teachingCategory) throw new Error("Teaching Category not found");
    await teachingCategory.destroy();
    return true;
  },
};

export default teachingResolvers;
