import Package from "../models/package.model";
import {
  CreatePackageInputType,
  UpdatePackageInputType,
} from "../types/resolvers-types";

const packageResolvers = {
  Query: {
    getPackages: async (_: any, __: any) => {
      return await Package.findAll();
    },
    getPackage: async (_: any, { id }: { id: number }) => {
      return await Package.findByPk(id);
    },
  },
  Mutation: {
    createPackage: async (
      _: any,
      { input }: { input: CreatePackageInputType }
    ) => {
      return await Package.create(input);
    },
    updatePackage: async (
      _: any,
      { id, input }: { id: number; input: UpdatePackageInputType }
    ) => {
      const pkg = await Package.findByPk(id);

      if (!pkg) throw new Error("Package not found");
      return await pkg.update(input);
    },
    deletePackage: async (_: any, { id }: { id: number }) => {
      const deleted = await Package.destroy({ where: { id } });
      return deleted > 0;
    },
  },
};
export default packageResolvers;
