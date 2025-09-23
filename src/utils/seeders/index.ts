import User from "../../models/user.model";
import sequelize from "../db.connection";
import bcrypt from "bcryptjs";
import { UserRole } from "../../enums";

sequelize;

async function seed() {
  try {
    const admin = {
      first_name: "Biruk",
      last_name: "Nega",
      email: "biruk.nega@zoharmedia.com",
      password_hash: await bcrypt.hash("admin123", 12), // Default password
      role: UserRole.ADMIN, // This will now be "ADMIN"
      is_active: true,
    };

    // Check if admin user already exists
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
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}

seed();
