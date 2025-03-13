import User from "../../models/user.model";
import sequelize from "../db.connection";
sequelize;

const admin = {
  avatar: null,
  first_name: "Admin",
  last_name: "Melaku",
  gender: "Male",
  password: "$2a$10$JMqUNw44zfJwwkKI/xVogOeaj1VZGmOWr9KPhaCn1ZJ/JR3IoGndW",
  phone: "0911223344",
  email: "admin@gmail.com",
  address: "Addis Ababa",
  dob: "2024-12-11 21:00:00",
  is_verified: 1,
  role: "admin",
};

async function seed() {
  await User.create(admin);
}

seed();
