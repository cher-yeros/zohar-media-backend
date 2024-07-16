
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import Gallery from '../../models/gallery.model';

const galleryResolvers = {
  Query: {
    gallery: async (_: any, { id }: { id: number }, ___: any) => {
      return await Gallery.findByPk(id);
    },
    allGallerys: async (_: any, __: any, ___: any) => {
      return await Gallery.findAll();
    },
  },

  Mutation: {
    createGallery: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await Gallery.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(`${error}`);
      }
    },

    updateGallery: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await Gallery.findByPk(id);
      if (!instance) {
        throw new Error('Gallery not found');
      }
      await instance.update(input);
      return instance;
    },

    deleteGallery: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await Gallery.findByPk(id);
      if (!instance) {
        throw new Error('Gallery not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default galleryResolvers;
