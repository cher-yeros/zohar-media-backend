
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import GalleryCategory from '../../models/gallery_category.model';

const gallerycategoryResolvers = {
  Query: {
    gallerycategory: async (_: any, { id }: { id: number }, ___: any) => {
      return await GalleryCategory.findByPk(id);
    },
    allGalleryCategorys: async (_: any, __: any, ___: any) => {
      return await GalleryCategory.findAll();
    },
  },

  Mutation: {
    createGalleryCategory: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await GalleryCategory.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateGalleryCategory: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await GalleryCategory.findByPk(id);
      if (!instance) {
        throw new Error('GalleryCategory not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteGalleryCategory: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await GalleryCategory.findByPk(id);
      if (!instance) {
        throw new Error('GalleryCategory not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default gallerycategoryResolvers;
