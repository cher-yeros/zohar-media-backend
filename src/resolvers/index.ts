import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { addResolversToSchema, mergeSchemas } from "@graphql-tools/schema";
import { merge } from "lodash";
import path from "path";

import { GraphQLScalarType, Kind } from "graphql";
import userResolvers from "./user.resolver";
import teamResolvers from "./team.resolver";
import portfolioResolvers from "./portfolio.resolver";
import inquiryResolvers from "./inquiry.resolver";
import testimonialResolvers from "./testimonial.resolver";
import mediaResolvers from "./media.resolver";
import analyticsResolvers from "./analytics.resolver";
import systemResolvers from "./system.resolver";

const dateScalar = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    serialize(value: any) {
      const dateValue = new Date(value);

      if (dateValue instanceof Date) {
        return dateValue.toISOString();
      }
      throw Error("GraphQL Date Scalar serializer expected a `Date` object");
    },
    parseValue(value) {
      if (typeof value === "string") {
        return new Date(value);
      }
      throw new Error("GraphQL Date Scalar parser expected a `number`");
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(parseInt(ast.value, 10));
      }
      return null;
    },
  }),
};

const allOperationPath = path.join(__dirname, "../schema/**/*.graphql");

const allOperation = loadSchemaSync(allOperationPath, {
  loaders: [new GraphQLFileLoader()],
});

export const mergedSchema = allOperation;

const gatewaySchema = addResolversToSchema({
  schema: mergedSchema,
  resolvers: merge(
    dateScalar,
    userResolvers,
    teamResolvers,
    portfolioResolvers,
    inquiryResolvers,
    testimonialResolvers,
    mediaResolvers,
    analyticsResolvers,
    systemResolvers
  ),
});

export default gatewaySchema;
