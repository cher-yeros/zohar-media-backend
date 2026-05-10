import GalleryPhoto from "../../models/gallery_photo.model";

/** Default homepage gallery paths (same as legacy zohar-media-portfolio Portfolio.tsx). */
const DEFAULT_GALLERY_IMAGES = [
  {
    image_url: "/img/gallery/g1.jpg",
    alt_text: "Gallery image 1",
    sort_order: 0,
  },
  {
    image_url: "/img/gallery/g2.jpg",
    alt_text: "Gallery image 2",
    sort_order: 1,
  },
  {
    image_url: "/img/gallery/g3.jpg",
    alt_text: "Gallery image 3",
    sort_order: 2,
  },
  {
    image_url: "/img/gallery/g4.jpg",
    alt_text: "Gallery image 4",
    sort_order: 3,
  },
  {
    image_url: "/img/gallery/g5.jpg",
    alt_text: "Gallery image 5",
    sort_order: 4,
  },
];

export async function seedGalleryPhotos(): Promise<void> {
  const count = await GalleryPhoto.count();
  if (count > 0) {
    console.log("Gallery photos already seeded; skipping.");
    return;
  }

  await GalleryPhoto.bulkCreate(
    DEFAULT_GALLERY_IMAGES.map((row) => ({
      ...row,
      is_published: true,
    })),
  );
  console.log(`Seeded ${DEFAULT_GALLERY_IMAGES.length} gallery photos.`);
}
