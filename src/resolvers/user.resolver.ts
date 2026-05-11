import { GraphQLError } from "graphql";
import { MyContext } from "../index";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRole } from "../enums";
import { requireAdmin, requireAuth } from "../utils/graphql-auth";

const MIN_PASSWORD_LEN = 8;

function isAdminRole(role: unknown): boolean {
  return String(role ?? "").toUpperCase() === UserRole.ADMIN;
}

const userResolvers = {
  Query: {
    users: async (_: any, __: any, context: MyContext) => {
      requireAdmin(context);
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
        const auth = requireAuth(context);
        const user = await User.findByPk(id, {
          attributes: { exclude: ["password_hash"] },
        });
        if (!user) {
          throw new Error("User not found");
        }
        if (auth.id !== id && !isAdminRole(auth.role)) {
          throw new Error("Forbidden: cannot fetch this user profile");
        }
        return user;
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to fetch user",
        );
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
        role = UserRole.EDITOR,
        avatar_url,
      }: {
        email: string;
        password: string;
        first_name: string;
        last_name: string;
        role?: UserRole;
        avatar_url?: string;
      },
      context: MyContext,
    ) => {
      requireAdmin(context);
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
            createdAt: user.createdAt,
          },
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to create user",
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
      context: MyContext,
    ) => {
      try {
        const auth = requireAuth(context);
        const user = await User.findByPk(id, {
          attributes: { exclude: ["password_hash"] },
        });
        if (!user) {
          throw new Error("User not found");
        }

        const self = auth.id === id;
        const callerIsAdmin = isAdminRole(auth.role);

        if (!self && !callerIsAdmin) {
          throw new Error("Forbidden: cannot modify another user's account");
        }

        const payload: Record<string, unknown> = {};

        if (first_name !== undefined) payload.first_name = first_name;
        if (last_name !== undefined) payload.last_name = last_name;

        if (email !== undefined) {
          const nextEmail = email.trim();
          if (nextEmail.length > 0) {
            const taken = await User.findOne({
              where: { email: nextEmail },
            });
            if (taken && taken.id !== id) {
              throw new Error("That email address is already in use");
            }
            payload.email = nextEmail;
          }
        }

        if (avatar_url !== undefined) {
          const trimmed =
            avatar_url === null || avatar_url === ""
              ? null
              : avatar_url.trim() || null;
          payload.avatar_url = trimmed;
        }

        if (self) {
          if (role !== undefined || is_active !== undefined) {
            throw new Error(
              "Role and status can only be changed by an administrator",
            );
          }
        } else {
          if (role !== undefined) payload.role = role;
          if (is_active !== undefined) payload.is_active = is_active;
        }

        await user.update(payload);

        const fresh = await User.findByPk(id, {
          attributes: { exclude: ["password_hash"] },
        });
        if (!fresh) {
          throw new Error("User not found after update");
        }

        return {
          success: true,
          message: "User updated successfully",
          user: {
            id: fresh.id,
            email: fresh.email,
            first_name: fresh.first_name,
            last_name: fresh.last_name,
            role: fresh.role,
            avatar_url: fresh.avatar_url,
            is_active: fresh.is_active,
            last_login_at: fresh.last_login_at,
            createdAt: fresh.createdAt,
            updatedAt: fresh.updatedAt,
          },
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to update user",
        );
      }
    },
    changePassword: async (
      _: any,
      {
        currentPassword,
        newPassword,
      }: { currentPassword: string; newPassword: string },
      context: MyContext,
    ) => {
      try {
        const auth = requireAuth(context);

        if (newPassword.length < MIN_PASSWORD_LEN) {
          throw new Error(
            `New password must be at least ${MIN_PASSWORD_LEN} characters`,
          );
        }

        const user = await User.findByPk(auth.id);
        if (!user) {
          throw new Error("User not found");
        }

        const ok = await bcrypt.compare(currentPassword, user.password_hash);
        if (!ok) {
          throw new Error("Current password is incorrect");
        }

        const password_hash = await bcrypt.hash(newPassword, 12);
        await user.update({ password_hash });

        return {
          success: true,
          message: "Password updated successfully",
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to change password",
        );
      }
    },
    deleteUser: async (_: any, { id }: { id: string }, context: MyContext) => {
      requireAdmin(context);
      try {
        const auth = context.user!;
        const user = await User.findByPk(id);
        if (!user) {
          throw new Error("User not found");
        }

        if (user.id === auth.id) {
          throw new Error("Administrators cannot delete their own account");
        }

        await user.destroy();
        return {
          success: true,
          message: "User deleted successfully",
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to delete user",
        );
      }
    },
    loginUser: async (
      _: any,
      { email, password }: { email: string; password: string },
      _context: MyContext,
    ) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          user.password_hash,
        );
        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        if (!user.is_active) {
          throw new Error("Account is deactivated");
        }

        await user.update({ last_login_at: new Date() });

        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new GraphQLError("Server misconfigured");
        }

        const token = jwt.sign(
          { user: { id: user.id, email: user.email, role: user.role } },
          secret,
          { expiresIn: "7d" },
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
          error instanceof Error ? error.message : "Login failed",
        );
      }
    },
  },
};

export default userResolvers;
