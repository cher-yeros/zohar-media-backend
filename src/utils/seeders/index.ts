import User from "../../models/user.model";
import sequelize from "../db.connection";
import bcrypt from "bcryptjs";
import { UserRole } from "../../enums";
import { seedGalleryPhotos } from "./gallery.seed";

sequelize;

async function seedAdmin(): Promise<void> {
  const admin = {
    first_name: "Biruk",
    last_name: "Nega",
    email: "biruk.nega@zoharmedia.net",
    password_hash: await bcrypt.hash("admin123", 12),
    role: UserRole.ADMIN,
    is_active: true,
  };

  const existingAdmin = await User.findOne({
    where: { email: admin.email },
  });

  if (existingAdmin) {
    console.log("Admin user already exists:", existingAdmin.email);
    return;
  }

  const createdAdmin = await User.create(admin);
  console.log("Admin user created successfully:", {
    id: createdAdmin.id,
    name: `${createdAdmin.first_name} ${createdAdmin.last_name}`,
    email: createdAdmin.email,
    role: createdAdmin.role,
  });
}

async function seed() {
  try {
    await seedAdmin();
    await seedGalleryPhotos();
  } catch (error) {
    console.error("Error running seeders:", error);
  }
}

seed();
