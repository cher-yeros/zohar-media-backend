import { json } from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import http from "http";
import { Secret } from "jsonwebtoken";

import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { configDotenv } from "dotenv";
import { Request, Response } from "express";
import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";
import { useServer } from "graphql-ws/lib/use/ws";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import { CustomJwtPayload } from "./middleware/auth";
import gatewaySchema from "./resolvers";
import sequelize from "./utils/db.connection";

import fileUpload from "express-fileupload";
import { accessSync, existsSync, mkdirSync, constants } from "fs";
import cron from "node-cron";
import path, { join } from "path";
import { v4 } from "uuid";
// Removed old model imports
// Payment router removed - no longer needed for Zohar Media backend
// Email service removed - no longer needed for Zohar Media backend
import { UserAccount } from "./types";
// import crypto from "crypto";
// console.log(crypto.randomBytes(32).toString("hex"));
configDotenv();
const app = express();
const httpServer = http.createServer(app);

const staticFilePath = join(__dirname, "../public");

app.use(express.static(staticFilePath));
app.use(fileUpload());

// expressfil

export interface MyContext {
  req: Request;
  res: Response;
  token?: string;
  user: UserAccount;
}

var corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://jpstvethiopia.com",
    "https://www.jpstvethiopia.com",
    "https://admin.jpstvethiopia.com",
  ],
  credentials: true,
};

const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const getDynamicContext = async (ctx: any) => {
  //   console.log(ctx.connectionParams);
  const token = ctx.connectionParams?.authorization?.split(" ")[1];
  const user = authentication(token);
  return user;
};

const pubsub = new PubSub();

const serverCleanup = useServer(
  {
    schema: gatewaySchema,
    context: async (ctx, msg, args) => {
      // console.log(ctx);
      const user = await getDynamicContext(ctx);
      return { ctx, msg, args, pubsub, user };
    },
  },
  wsServer,
);

(async () => {
  const server = new ApolloServer<MyContext>({
    schema: gatewaySchema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ footer: false }),
      // ApolloServerPluginLandingPageDisabled()
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
    introspection: true,
    // introspection: process.env.NODE_ENV === "development" ? true : false,
  });

  server.start().then(() => {
    app.use(
      "/graphql",
      [
        cors<cors.CorsRequest>(corsOptions),
        cookieParser(),
        json({ limit: "50mb" }),
      ],
      expressMiddleware(server, {
        context: async ({ req, res }: { req: Request; res: Response }) => {
          const token = req.headers.authorization?.split(" ")[1];
          let user;
          if (
            !(
              req.body.operationName === "IntrospectionQuery" ||
              req.body.operationName === "CreateUser" ||
              req.body.operationName === "LoginUser" ||
              req.body.operationName === "CreateInquiry" ||
              req.body.operationName === "PublicGalleryPhotos" ||
              req.body.operationName === "GetPublicGalleryPhotos"
            )
          ) {
            user = authentication(token);
          }

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

function authentication(token: any) {
  const secret = process.env.JWT_SECRET as Secret;

  if (!token) {
    throw new GraphQLError("Token not found!", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }

  let decoded: any = {};
  let user: any = {};

  if (!token) {
    return user;
  }
  try {
    decoded = jwt.verify(token, secret) as CustomJwtPayload;
    user = (jwt.verify(token, secret) as CustomJwtPayload).user;
  } catch (error) {
    throw new GraphQLError("Invalid Token or User is not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }

  if (!user) {
    throw new GraphQLError("Invalid Token or User is not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }
  return user;
}
app.use(cors(corsOptions));

// Routes - Payment routes removed for Zohar Media backend

app.post("/api/upload-file/:folder", async (req: any, res: Response) => {
  try {
    if (!req?.files?.picture) {
      return res.status(400).json({ message: "Please Upload Picture" });
    }

    const folderPath = join("public", req.params.folder);

    // Ensure the folder exists
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true });
    }

    let fileName = v4() + "." + req.files?.picture.mimetype.split("/")[1];

    req.files?.picture.mv(path.join(folderPath, fileName), function (err: any) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Unable to upload the Picture",
        });
      }

      const address =
        process.env.NODE_ENV === "production"
          ? `${process.env.API_URL || "https://api.zoharmedia.net"}/static/${
              req.params.folder
            }/${fileName}`
          : `http://localhost:${process.env.PORT || 4000}/static/${
              req.params.folder
            }/${fileName}`;

      return res.json({ fileName: address });
    });
  } catch (error) {
    return res.status(400).json({ message: "Unable to Upload Content" });
  }
});

app.get("/static/:folder/:fileName", (req: Request, res: Response) => {
  const { fileName, folder } = req.params;

  const filePath = join(staticFilePath, folder, fileName);

  try {
    // Check if file exists
    accessSync(filePath, constants.F_OK);

    // Send the file
    res.sendFile(filePath, (err) => {
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

// Cron job removed - no longer needed for Zohar Media backend
