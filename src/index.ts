import { json } from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import http from "http";
import { Secret } from "jsonwebtoken";

import {} from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { configDotenv } from "dotenv";
import { Request, Response } from "express";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import { CustomJwtPayload } from "./middleware/auth";
import gatewaySchema from "./resolvers";
import sequelize from "./utils/db.connection";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";

import Payment from "./models/payment.model";
import { Transaction } from "sequelize";
import { checkPaymentStatus } from "./services/services";
import Token from "./models/token.model";
import User from "./models/user.model";
import { UserAccount } from "./types";
import axios from "axios";

// import crypto from "crypto";
// console.log(crypto.randomBytes(32).toString("hex"));
configDotenv();
const app = express();
const httpServer = http.createServer(app);

export interface MyContext {
  req: Request;
  res: Response;
  token?: string;
  user: UserAccount;
}

var corsOptions = {
  origin: true,
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
              req.body.operationName === "CreateAdminFeedback"
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

app.get("/api/verify-payment/:tx_ref", async (req, res) => {
  const config = {
    headers: {
      Authorization: "Bearer " + process.env.CHAPA_TEST_SECRET_KEY,
    },
  };

  const VERIFY_URL =
    "https://api.chapa.co/v1/transaction/verify/" + req.params.tx_ref;

  let t: Transaction = await sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
  });

  try {
    const { data } = await axios.get(VERIFY_URL, config);

    let payment = await Payment.update(
      { status: "VERIFIED" },
      {
        where: {
          tx_ref: req.params.tx_ref,
        },
        transaction: t,
      }
    );

    t.commit();
  } catch (error) {
    t.rollback();
    res.status(400).json({ error });
  }
});
