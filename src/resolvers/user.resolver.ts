import { MyContext } from "../index";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRole } from "../enums";

const userResolvers = {
  Query: {
    users: async (_: any, __: any, context: MyContext) => {
      try {
        const users = await User.findAll({
          attributes: { exclude: ["password_hash"] },
        });
        return users;
      } catch (error) {
        throw new Error("Failed to fetch users");
      }
    },
    user: async (_: any, { id }: { id: string }, context: MyContext) => {
      try {
        const user = await User.findByPk(id, {
          attributes: { exclude: ["password_hash"] },
        });
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } catch (error) {
        throw new Error("Failed to fetch user");
      }
    },
  },
  Mutation: {
    createUser: async (
      _: any,
      {
        email,
        password,
        first_name,
        last_name,
        role = UserRole.ADMIN,
        avatar_url,
      }: {
        email: string;
        password: string;
        first_name: string;
        last_name: string;
        role?: UserRole;
        avatar_url?: string;
      },
      context: MyContext
    ) => {
      try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          throw new Error("User with this email already exists");
        }

        const password_hash = await bcrypt.hash(password, 12);
        const user = await User.create({
          email,
          password_hash,
          first_name,
          last_name,
          role,
          avatar_url,
        });

        return {
          success: true,
          message: "User created successfully",
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            avatar_url: user.avatar_url,
            is_active: user.is_active,
            created_at: user.createdAt,
          },
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to create user"
        );
      }
    },
    updateUser: async (
      _: any,
      {
        id,
        email,
        first_name,
        last_name,
        role,
        avatar_url,
        is_active,
      }: {
        id: string;
        email?: string;
        first_name?: string;
        last_name?: string;
        role?: UserRole;
        avatar_url?: string;
        is_active?: boolean;
      },
      context: MyContext
    ) => {
      try {
        const user = await User.findByPk(id);
        if (!user) {
          throw new Error("User not found");
        }

        await user.update({
          email: email || user.email,
          first_name: first_name || user.first_name,
          last_name: last_name || user.last_name,
          role: role || user.role,
          avatar_url: avatar_url !== undefined ? avatar_url : user.avatar_url,
          is_active: is_active !== undefined ? is_active : user.is_active,
        });

        return {
          success: true,
          message: "User updated successfully",
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            avatar_url: user.avatar_url,
            is_active: user.is_active,
            updated_at: user.updatedAt,
          },
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to update user"
        );
      }
    },
    deleteUser: async (_: any, { id }: { id: string }, context: MyContext) => {
      try {
        const user = await User.findByPk(id);
        if (!user) {
          throw new Error("User not found");
        }

        await user.destroy();
        return {
          success: true,
          message: "User deleted successfully",
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to delete user"
        );
      }
    },
    loginUser: async (
      _: any,
      { email, password }: { email: string; password: string },
      context: MyContext
    ) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          user.password_hash
        );
        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        if (!user.is_active) {
          throw new Error("Account is deactivated");
        }

        // Update last login
        await user.update({ last_login_at: new Date() });

        const token = jwt.sign(
          { user: { id: user.id, email: user.email, role: user.role } },
          process.env.JWT_SECRET!,
          { expiresIn: "7d" }
        );

        return {
          success: true,
          message: "Login successful",
          token,
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            avatar_url: user.avatar_url,
            is_active: user.is_active,
            last_login_at: user.last_login_at,
          },
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Login failed"
        );
      }
    },
  },
};

export default userResolvers;
