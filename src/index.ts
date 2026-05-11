import { json } from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import cors from "cors";
import http from "http";

import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { configDotenv } from "dotenv";
import { Request, Response } from "express";
import { PubSub } from "graphql-subscriptions";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import gatewaySchema from "./resolvers";
import sequelize from "./utils/db.connection";
import {
  resolveUserFromAuthorizationHeader,
  verifyJwtUser,
} from "./utils/graphql-auth";

import config from "config";
import fileUpload from "express-fileupload";
import { accessSync, constants, existsSync, mkdirSync } from "fs";
import path, { join } from "path";
import { v4 } from "uuid";
import { UserAccount } from "./types";

configDotenv();

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const GRAPHQL_BODY_LIMIT = IS_PRODUCTION ? "2mb" : "10mb";

const app = express();
const httpServer = http.createServer(app);

const staticFilePath = join(__dirname, "../public");

app.use(express.static(staticFilePath));
app.use(fileUpload());

export interface MyContext {
  req: Request;
  res: Response;
  token?: string;
  user?: UserAccount;
}

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://zoharmedia.net",
    "https://www.zoharmedia.net",
    "https://admin.zoharmedia.net",
  ],
  credentials: true,
};

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const getSubscriptionUser = async (
  rawAuth: unknown,
): Promise<UserAccount | undefined> => {
  if (typeof rawAuth !== "string" || rawAuth.trim().length === 0) {
    return undefined;
  }
  return resolveUserFromAuthorizationHeader(rawAuth);
};

const pubsub = new PubSub();

const serverCleanup = useServer(
  {
    schema: gatewaySchema,
    context: async (ctx, msg, args) => {
      const authorizationHeader = ctx.connectionParams?.authorization;
      const user = await getSubscriptionUser(authorizationHeader);
      return { ctx, msg, args, pubsub, user };
    },
  },
  wsServer,
);

(async () => {
  const landingPlugin = IS_PRODUCTION
    ? ApolloServerPluginLandingPageDisabled()
    : ApolloServerPluginLandingPageLocalDefault({ footer: false });

  const server = new ApolloServer<MyContext>({
    schema: gatewaySchema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      landingPlugin,
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
    introspection: !IS_PRODUCTION,
  });

  server.start().then(() => {
    app.use(
      "/graphql",
      [
        cors<cors.CorsRequest>(corsOptions),
        cookieParser(),
        json({ limit: GRAPHQL_BODY_LIMIT }),
      ],
      expressMiddleware(server, {
        context: async ({ req, res }: { req: Request; res: Response }) => {
          const user = resolveUserFromAuthorizationHeader(
            req.headers.authorization,
          );

          return { req, res, user, pubsub };
        },
      }),
    );

    new Promise<void>((resolve) =>
      httpServer.listen({ port: process.env.PORT }, resolve),
    ).then(async () => {
      console.log(
        `\n🚀  Server ready at http://localhost:${
          process.env.PORT || 4000
        }/graphql`,
      );
      sequelize;
    });
  });
})();

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
  });
});

app.use(cors(corsOptions));

const PUBLIC_ROOT = path.resolve(process.cwd(), "public");

const UPLOAD_EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/pjpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};
const UPLOAD_MAX_BYTES = 50 * 1024 * 1024;

function assertSafePathSegment(segment: string, label: string) {
  if (!segment || segment.includes("..") || /[/\\]/.test(segment)) {
    throw new Error(`Invalid ${label}`);
  }
}

function uploadAuth(req: Request, res: Response, next: () => void) {
  const header = req.headers.authorization;
  try {
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = header.slice("Bearer ".length).trim();
    verifyJwtUser(token);
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

function publicFileUrl(req: Request, folder: string, fileName: string): string {
  let configured: string | undefined;
  try {
    configured = config.get("uploads.publicBaseUrl") as string;
  } catch {
    configured = undefined;
  }

  const base = (configured ?? "").trim().replace(/\/$/, "");
  if (base.length > 0) {
    return `${base}/static/${folder}/${fileName}`;
  }

  const proto = req.protocol;
  const host = req.get("host") ?? `localhost:${process.env.PORT || 4000}`;
  return `${proto}://${host}/static/${folder}/${fileName}`;
}

app.post("/api/upload-file/:folder", uploadAuth, (req: any, res: Response) => {
  try {
    const folderParam = req.params.folder;
    assertSafePathSegment(folderParam, "folder");

    if (!req.files || !("picture" in req.files) || !req.files.picture) {
      return res.status(400).json({ message: "Please Upload Picture" });
    }

    const picture = req.files
      .picture as import("express-fileupload").UploadedFile;

    const extFromMime = UPLOAD_EXT_BY_MIME[picture.mimetype];
    if (!extFromMime) {
      return res.status(400).json({
        message:
          "Unsupported media type. Allowed types: JPG, PNG, GIF, WEBP, MP4, WEBM, MOV (QuickTime).",
      });
    }

    if (picture.size > UPLOAD_MAX_BYTES) {
      return res.status(400).json({
        message: `File too large (${Math.round(
          UPLOAD_MAX_BYTES / (1024 * 1024),
        )}MB max)`,
      });
    }

    const folderPath = path.join(PUBLIC_ROOT, folderParam);

    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true });
    }

    const fileName = `${v4()}.${extFromMime}`;

    picture.mv(path.join(folderPath, fileName), function (err: any) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Unable to upload the Picture",
        });
      }

      const address = publicFileUrl(req, folderParam, fileName);

      return res.json({ fileName: address });
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to Upload Content";
    return res.status(400).json({ message });
  }
});

app.get("/static/:folder/:fileName", (req: Request, res: Response) => {
  const { fileName, folder } = req.params;

  try {
    assertSafePathSegment(folder, "folder");
    assertSafePathSegment(fileName, "fileName");
  } catch {
    return res.status(400).send("Bad request");
  }

  const filePath = path.join(PUBLIC_ROOT, folder, fileName);

  try {
    accessSync(filePath, constants.F_OK);

    res.status(200).sendFile(path.resolve(filePath), (err) => {
      if (err) {
        console.error("Error sending file:", err);
        if (!res.headersSent) {
          res.status(404).json({
            success: false,
            message: "File not found",
          });
        }
      }
    });
  } catch (error) {
    console.error("File access error:", error);
    res.status(404).json({
      success: false,
      message: "File not found",
    });
  }
});
