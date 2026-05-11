import PortfolioCategory from "../../models/portfolio_category.model";
import PortfolioItem from "../../models/portfolio_item.model";
import PortfolioItemTag from "../../models/portfolio_item_tag.model";
import { PortfolioItemStatus } from "../../enums";

type SeedCategory = { name: string; description?: string; color: string };
type SeedItem = {
  title: string;
  categoryName: string;
  tags: string[];
  projectUrl: string;
  thumbnailUrl: string;
  featured?: boolean;
};

function youtubeThumbnail(url: string): string | null {
  let videoId = "";

  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0] ?? "";
  } else if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("v=")[1]?.split("&")[0] ?? "";
  } else if (url.includes("youtube.com/shorts/")) {
    videoId = url.split("shorts/")[1]?.split("?")[0] ?? "";
  }

  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

const DEFAULT_PORTFOLIO_CATEGORIES: SeedCategory[] = [
  {
    name: "Video & Media Production",
    description: "Video production and media coverage",
    color: "#00bfe7",
  },
  {
    name: "Social Media Management",
    description: "Social media content and management",
    color: "#4ECDC4",
  },
  {
    name: "Event Planning & Production",
    description: "Event planning, production, and recaps",
    color: "#FF6B6B",
  },
  {
    name: "Professional Editing",
    description: "Professional video editing and post-production",
    color: "#FFEAA7",
  },
];

/**
 * Default portfolio items seeded from the current zohar-media-portfolio site
 * (`src/components/PortfolioPage.tsx`) so the admin can manage them afterwards.
 */
const DEFAULT_PORTFOLIO_ITEMS: SeedItem[] = [
  {
    title: "Rise Of Fearless Game Launching Event",
    categoryName: "Video & Media Production",
    tags: ["Event Coverage", "Game Launch"],
    projectUrl: "https://youtu.be/2S3yWP1PKg8?si=kq9hSb-10YcoGJhX",
    thumbnailUrl:
      youtubeThumbnail("https://youtu.be/2S3yWP1PKg8?si=kq9hSb-10YcoGJhX") ??
      "",
    featured: true,
  },
  {
    title: "Adwa Game Launching Event",
    categoryName: "Video & Media Production",
    tags: ["Event Coverage", "Game Launch"],
    projectUrl: "https://www.youtube.com/watch?v=2S3yWP1PKg8",
    thumbnailUrl:
      youtubeThumbnail("https://www.youtube.com/watch?v=2S3yWP1PKg8") ?? "",
    featured: true,
  },
  {
    title: "Business in Africa Reality Show",
    categoryName: "Video & Media Production",
    tags: ["Reality Show", "Business"],
    projectUrl: "https://youtu.be/eLHHWSR-eLs?si=shUCVEowoL28C0MC",
    thumbnailUrl:
      youtubeThumbnail("https://youtu.be/eLHHWSR-eLs?si=shUCVEowoL28C0MC") ??
      "",
    featured: true,
  },
  {
    title: "Inside Adwa Museum Tour",
    categoryName: "Video & Media Production",
    tags: ["Documentary", "Museum Tour"],
    projectUrl: "https://youtu.be/npRPBxRrH-U",
    thumbnailUrl: youtubeThumbnail("https://youtu.be/npRPBxRrH-U") ?? "",
    featured: true,
  },
  {
    title: "Home Tour For Maya Residence",
    categoryName: "Video & Media Production",
    tags: ["Real Estate", "Property Tour"],
    projectUrl: "https://youtu.be/BY3rWSVROiA",
    thumbnailUrl: youtubeThumbnail("https://youtu.be/BY3rWSVROiA") ?? "",
    featured: true,
  },
  {
    title: "Maya Residence - Additional Tour",
    categoryName: "Video & Media Production",
    tags: ["Real Estate", "Property Tour"],
    projectUrl: "https://youtu.be/N7zMOdbVKKY?si=iUd6Q_b714yGR12k",
    thumbnailUrl:
      youtubeThumbnail("https://youtu.be/N7zMOdbVKKY?si=iUd6Q_b714yGR12k") ??
      "",
  },
  {
    title: "Fitness Videos For Reuben Geimah",
    categoryName: "Video & Media Production",
    tags: ["Fitness", "Personal Training"],
    projectUrl: "https://youtu.be/W9WYOi9cz-I?si=xKNuwUD8DWcCGtGe",
    thumbnailUrl:
      youtubeThumbnail("https://youtu.be/W9WYOi9cz-I?si=xKNuwUD8DWcCGtGe") ??
      "",
  },
  {
    title: "Fitness Videos For Reuben Geimah - Part 2",
    categoryName: "Video & Media Production",
    tags: ["Fitness", "Personal Training"],
    projectUrl: "https://youtu.be/Qi3-BnQAUs8?si=LakYpdsuZ0VElSzw",
    thumbnailUrl:
      youtubeThumbnail("https://youtu.be/Qi3-BnQAUs8?si=LakYpdsuZ0VElSzw") ??
      "",
  },
  {
    title: "Puagmae Fest Event Recap",
    categoryName: "Event Planning & Production",
    tags: ["Event Recap", "Festival"],
    projectUrl: "https://youtu.be/jMpOk3DaQqY",
    thumbnailUrl: youtubeThumbnail("https://youtu.be/jMpOk3DaQqY") ?? "",
  },
  {
    title: "Menkem Transport Event Recap",
    categoryName: "Event Planning & Production",
    tags: ["Event Recap", "Transport"],
    projectUrl: "https://youtu.be/sDDGmJ3XAqo",
    thumbnailUrl: youtubeThumbnail("https://youtu.be/sDDGmJ3XAqo") ?? "",
  },
  {
    title: "Gadzhi Style Editing for Act Da Verse",
    categoryName: "Professional Editing",
    tags: ["Music Video", "Creative Editing"],
    projectUrl: "https://youtube.com/shorts/3xjub12INiQ?si=d1BAmU9UsIlY-XRh",
    thumbnailUrl:
      youtubeThumbnail(
        "https://youtube.com/shorts/3xjub12INiQ?si=d1BAmU9UsIlY-XRh",
      ) ?? "",
  },
  {
    title: "Gadzhi Style Editing - Short 2",
    categoryName: "Professional Editing",
    tags: ["Music Video", "Creative Editing"],
    projectUrl: "https://youtube.com/shorts/yTps291c3xg?si=WC-hTWfv7KvigtQ-",
    thumbnailUrl:
      youtubeThumbnail(
        "https://youtube.com/shorts/yTps291c3xg?si=WC-hTWfv7KvigtQ-",
      ) ?? "",
  },
  {
    title: "Gadzhi Style Editing - Short 3",
    categoryName: "Professional Editing",
    tags: ["Music Video", "Creative Editing"],
    projectUrl: "https://youtube.com/shorts/WeU3h0k-Od8?si=c3ln7BCXvBjfd-Qx",
    thumbnailUrl:
      youtubeThumbnail(
        "https://youtube.com/shorts/WeU3h0k-Od8?si=c3ln7BCXvBjfd-Qx",
      ) ?? "",
  },
  {
    title: "Faceless Video Edit - Collection 1",
    categoryName: "Professional Editing",
    tags: ["Creative Editing", "Faceless Content"],
    projectUrl: "https://youtu.be/11Ti4rJ9AE8",
    thumbnailUrl: youtubeThumbnail("https://youtu.be/11Ti4rJ9AE8") ?? "",
  },
  {
    title: "Faceless Video Edit - Collection 2",
    categoryName: "Professional Editing",
    tags: ["Creative Editing", "Faceless Content"],
    projectUrl: "https://youtu.be/1LMGU1gIo-0",
    thumbnailUrl: youtubeThumbnail("https://youtu.be/1LMGU1gIo-0") ?? "",
  },
  {
    title: "Faceless Video Edit - Collection 3",
    categoryName: "Professional Editing",
    tags: ["Creative Editing", "Faceless Content"],
    projectUrl: "https://youtu.be/l2MyOX_qkdY",
    thumbnailUrl: youtubeThumbnail("https://youtu.be/l2MyOX_qkdY") ?? "",
  },
  {
    title: "Faceless Video Edit - Collection 4",
    categoryName: "Professional Editing",
    tags: ["Creative Editing", "Faceless Content"],
    projectUrl: "https://youtu.be/z0j7T87VYwU",
    thumbnailUrl: youtubeThumbnail("https://youtu.be/z0j7T87VYwU") ?? "",
  },
  {
    title: "Faceless Video Edit - Collection 5",
    categoryName: "Professional Editing",
    tags: ["Creative Editing", "Faceless Content"],
    projectUrl: "https://youtu.be/43i8FQKJVp0",
    thumbnailUrl: youtubeThumbnail("https://youtu.be/43i8FQKJVp0") ?? "",
  },
];

export async function seedPortfolioDefaults(): Promise<void> {
  const itemCount = await PortfolioItem.count();
  if (itemCount > 0) {
    console.log("Portfolio items already exist; skipping portfolio seed.");
    return;
  }

  // Create categories (idempotent-ish by name)
  const categoryByName = new Map<string, PortfolioCategory>();
  for (const c of DEFAULT_PORTFOLIO_CATEGORIES) {
    const [category] = await PortfolioCategory.findOrCreate({
      where: { name: c.name },
      defaults: c,
    });
    categoryByName.set(c.name, category);
  }

  // Create items
  for (const item of DEFAULT_PORTFOLIO_ITEMS) {
    const category = categoryByName.get(item.categoryName);
    if (!category) continue;

    const created = await PortfolioItem.create({
      title: item.title,
      description: item.tags.join(", "),
      category_id: category.id,
      thumbnail_url: item.thumbnailUrl || null,
      client_name: null,
      project_date: new Date(),
      status: PortfolioItemStatus.COMPLETED,
      featured: Boolean(item.featured),
      project_url: item.projectUrl,
      testimonial: null,
    });

    if (item.tags.length) {
      await PortfolioItemTag.bulkCreate(
        item.tags.map((tag) => ({
          portfolio_item_id: created.id,
          tag_name: tag,
        })),
      );
    }
  }

  console.log(
    `Seeded ${DEFAULT_PORTFOLIO_CATEGORIES.length} portfolio categories and ${DEFAULT_PORTFOLIO_ITEMS.length} portfolio items.`,
  );
}

