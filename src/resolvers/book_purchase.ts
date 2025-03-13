import paypal from "@paypal/checkout-server-sdk";
import { configDotenv } from "dotenv";
// import { createChapaPaymentForBookOrder } from "../services/services";

configDotenv();

let clientId = process.env.PAYPAL_SANDBOX_CLIENT_ID!;
let clientSecret = process.env.PAYPAL_SANDBOX_CLIENT_SECRET!;
let paypalApi = process.env.PAYPAL_SANDBOX_PAYPAL_API!;

let environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

const bookPurchaseResolvers = {};

export default bookPurchaseResolvers;
