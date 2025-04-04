import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { addResolversToSchema, mergeSchemas } from "@graphql-tools/schema";
import { merge } from "lodash";
import path from "path";

import { GraphQLScalarType, Kind } from "graphql";
import adminesolvers from "./admin";
import bibleStudyResolvers from "./bible_study";
import blogResolvers from "./blog";
import bookPurchaseResolvers from "./book_purchase";
import donationResolvers from "./donation";
import faqResolvers from "./faq";
import feedbackResolvers from "./feedback";
import galleryResolvels from "./gallery";
import lookupResolvers from "./lookup";
import messageResolvers from "./message";
import notificationResolvers from "./notification";
import partnershipResolvers from "./partnership";
import paymentResolvers from "./payment";
import prayerRequestResolvers from "./prayer_request";
import serviceResolvers from "./service";
import userResolvers from "./user";
import geustHouseResolvers from "./visitor";
import partnerResolvers from "./partner";
import packageResolvers from "./package";
import teachingResolvers from "./teaching";
import reviewResolvers from "./review";

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
const allSchemaPath = path.join(__dirname, "../generated/schema.graphql");

const allOperation = loadSchemaSync(allOperationPath, {
  loaders: [new GraphQLFileLoader()],
});

const allSchema = loadSchemaSync(allSchemaPath, {
  loaders: [new GraphQLFileLoader()],
});

export const mergedSchema = mergeSchemas({
  schemas: [allOperation, allSchema],
});

const gatewaySchema = addResolversToSchema({
  schema: mergedSchema,
  resolvers: merge(
    dateScalar,
    userResolvers,
    lookupResolvers,
    notificationResolvers,
    messageResolvers,
    feedbackResolvers,
    paymentResolvers,
    partnershipResolvers,
    blogResolvers,
    adminesolvers,
    bibleStudyResolvers,
    geustHouseResolvers,
    galleryResolvels,
    serviceResolvers,
    bookPurchaseResolvers,
    donationResolvers,
    prayerRequestResolvers,
    faqResolvers,
    packageResolvers,
    partnerResolvers,
    teachingResolvers,
    reviewResolvers
  ),
});

export default gatewaySchema;
