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
import { accessSync } from "fs";
import { constants } from "fs/promises";
import cron from "node-cron";
import { join } from "path";
import { v4 } from "uuid";
import Partnership from "./models/partnership.model";
import paymentRouter from "./routes/payment";
import { sendReminderEmail } from "./services/sendEmail";
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
  origin: ["http://localhost:3000", "https://jpstvethiopia.com"],
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
  wsServer
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
              req.body.operationName === "VerifyEmail" ||
              req.body.operationName === "RequestResetPassword" ||
              req.body.operationName === "ResetPassword" ||
              req.body.operationName === "CreatePartnership" ||
              req.body.operationName === "CreateOrder" ||
              req.body.operationName === "CaptureOrder" ||
              req.body.operationName === "CreateSubscription" ||
              req.body.operationName === "CaptureSubscription" ||
              req.body.operationName === "BibleStudySessionsForUsers" ||
              req.body.operationName === "VisitorScheulesForUsers" ||
              req.body.operationName === "Blogs" ||
              req.body.operationName === "ServiceCategoryForUsers" ||
              req.body.operationName === "GalleriesForUsers" ||
              req.body.operationName === "GalleryCategoryForUsers" ||
              req.body.operationName === "CreateDonation" ||
              req.body.operationName === "CreateVisitor" ||
              req.body.operationName === "CreateVisitorOrder" ||
              req.body.operationName === "CaptureVisitorOrder" ||
              req.body.operationName === "CreatePrayerRequest" ||
              req.body.operationName === "AllFAQsForUsers" ||
              req.body.operationName === "CreateFeedback"
            )
          ) {
            user = authentication(token);
          }

          return { req, res, user, pubsub };
        },
      })
    );

    new Promise<void>((resolve) =>
      httpServer.listen({ port: process.env.PORT }, resolve)
    ).then(async () => {
      console.log(
        `\n🚀  Server ready at http://localhost:${process.env.PORT}/graphql`
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

// Routes
app.use("/api/payment", paymentRouter);

app.post("/api/upload-file", async (req: any, res: Response) => {
  try {
    if (!req?.files?.picture) {
      return res.status(400).json({ message: "Please Upload Picture" });
    }

    let fileName =
      Date.now() + v4() + "." + req.files?.picture.mimetype.split("/")[1];

    req.files?.picture.mv("public/" + fileName, function (err: any) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Unable to upload the Picture",
        });
      }

      const address =
        process.env.NODE_ENV === "production"
          ? "https://api.jpstvethiopia.com/static/" + fileName
          : "http://localhost:4000/static/" + fileName;

      return res.json({ fileName: address });
    });
  } catch (error) {
    return res.status(400).json({ message: "Unable to Upload Content" });
  }
});

app.get("/static/:fileName", (req: Request, res: Response) => {
  const { fileName } = req.params;

  const filePath = join(staticFilePath, fileName);

  try {
    accessSync(filePath, constants.F_OK);
  } catch (error) {
    console.log(error);
  }

  // Send the file
  res.status(200).sendFile(filePath, (err) => {
    if (err) {
      console.log("server error");
      console.log(err);
      // Handle errors (e.g., file not found)
      // res.status(500).send(err.message);
    }
  });
});

const task = cron.schedule("0 0 * * *", async () => {
  console.log("Running a task day minute");

  // Check for expired subscriptions
  const partners = await Partnership.findAll({
    where: {
      due_date: new Date(),
    },
  });

  try {
    await Promise.all(
      partners.map(async (partner) => {
        await sendReminderEmail(
          partner?.email!,
          partner?.id.toString()!,
          partner?.first_name!,
          partner?.last_name!
        );
      })
    );
  } catch (error) {
    console.log(error);
  }
});

// Start the cron job
task.start();

// // Optionally, handle the shutdown process
process.on("SIGINT", () => {
  task.stop();
  console.log("Cron job stopped.");
  process.exit();
});
