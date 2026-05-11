import { GraphQLError } from "graphql";
import jwt, { Secret } from "jsonwebtoken";
import { CustomJwtPayload } from "../middleware/auth";
import { UserRole } from "../enums";
import { UserAccount } from "../types";

type WithOptionalUser = { user?: UserAccount };

export function requireAuth(context: WithOptionalUser): UserAccount {
  const u = context.user;
  if (!u?.id) {
    throw new GraphQLError("Not authenticated", {
      extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
    });
  }
  return u;
}

export function requireAdmin(context: WithOptionalUser): UserAccount {
  const u = requireAuth(context);
  if (String(u.role).toUpperCase() !== UserRole.ADMIN) {
    throw new GraphQLError("Forbidden", {
      extensions: { code: "FORBIDDEN", http: { status: 403 } },
    });
  }
  return u;
}

/**
 * Bearer present → must be a valid JWT. No bearer → anonymous (public operations).
 */
export function resolveUserFromAuthorizationHeader(
  authorizationHeader?: string | null,
): UserAccount | undefined {
  const h =
    typeof authorizationHeader === "string" ? authorizationHeader.trim() : "";
  if (!h.startsWith("Bearer ")) return undefined;
  const token = h.slice("Bearer ".length).trim();
  if (!token) return undefined;
  return verifyJwtUser(token);
}

export function verifyJwtUser(token: string): UserAccount {
  const secret = process.env.JWT_SECRET as Secret | undefined;
  if (!secret) {
    throw new GraphQLError("Server misconfigured", {
      extensions: { code: "INTERNAL_SERVER_ERROR", http: { status: 500 } },
    });
  }

  try {
    const payload = jwt.verify(token, secret) as CustomJwtPayload;
    const u = payload.user;
    if (!u?.id) {
      throw new Error("invalid payload");
    }
    return u as UserAccount;
  } catch {
    throw new GraphQLError("Invalid Token or User is not authenticated", {
      extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
    });
  }
}
