import { PubSub } from "graphql-subscriptions";
import { Transaction } from "sequelize";
import { PAYMENT_SUCCESSFUL, PAYMENT_VERIFIED } from "../helpers/constants";
import { BadRequestError } from "../helpers/error_handler";
import Partnership from "../models/partnership.model";
import createChapaPayment, { PaymentTypes } from "../services/services";
import { UserAccount } from "../types";
import { CreatePartnershipInputType } from "../types/resolvers-types";
import sequelize from "../utils/db.connection";

// import paypalClient from "./paypalClient";
import paypal from "@paypal/checkout-server-sdk";
import dayjs from "dayjs";
import { configDotenv } from "dotenv";
import Payment from "../models/payment.model";
// import { getAccessToken } from "../services/paypalClient";
import { sendPartnershipConfirmationEmail } from "../services/sendEmail";
configDotenv();
const pubsub = new PubSub();

let clientId = process.env.PAYPAL_SANDBOX_CLIENT_ID!;
let clientSecret = process.env.PAYPAL_SANDBOX_CLIENT_SECRET!;
let paypalApi = process.env.PAYPAL_SANDBOX_PAYPAL_API!;

let environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

const partnershipResolvers = {
  Query: {
    partners: async () => {
      const partners = await Partnership.findAll({
        order: [["createdAt", "DESC"]],
      });

      return partners;
    },
  },
  Mutation: {
    addNewPartner: async (
      _: any,
      { input }: { input: CreatePartnershipInputType },
      { user }: { user: UserAccount }
    ) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        let partnership = await Partnership.findOne({
          where: { email: input.email },
          transaction: t,
        });

        if (partnership) {
          return new BadRequestError(
            "Partner is registered with this email already !"
          );
        }

        const month = getPaymentFrequencyUnit(input.partnership_plan!);
        const due_date = dayjs(new Date()).add(month, "month");

        partnership = await Partnership.create(
          { ...input, due_date },
          {
            transaction: t,
          }
        );

        await sendPartnershipConfirmationEmail(
          partnership.email,
          partnership.first_name,
          partnership.last_name
        );

        t.commit();

        return partnership;
      } catch (error: any) {
        console.log(error);
        t.rollback();
        return new BadRequestError(error);
      }
    },
    createPartnership: async (
      _: any,
      { input }: { input: CreatePartnershipInputType },
      { user }: { user: UserAccount }
    ) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        let partnership = await Partnership.findOne({
          where: { email: input.email },
          transaction: t,
        });

        if (!partnership) {
          partnership = await Partnership.create(input, { transaction: t });
        }

        const paymentInstance = await createChapaPayment({
          ...input,
          currency: input.currency || "ETB",
          reason: PaymentTypes.Partnership,
        });

        await Payment.create(
          {
            first_name: input.first_name,
            last_name: input.last_name,
            email: input.email,
            phone: input.phone,
            amount: input.amount,
            currency: "ETB",
            tx_ref: paymentInstance.tx_ref,
            user_id: user?.id,
            reason: "For Partnership ",
            payment_method: input.payment_method,
          },
          {
            transaction: t,
          }
        );

        if (input.partnership_type === "Recurring") {
          const month = getPaymentFrequencyUnit(input.partnership_plan!);
          const due_date = dayjs(new Date()).add(month, "month");

          await Partnership.update(
            { due_date },
            { where: { id: partnership.id }, transaction: t }
          );
        }

        await sendPartnershipConfirmationEmail(
          partnership.email,
          partnership.first_name,
          partnership.last_name
        );

        t.commit();

        return paymentInstance;
      } catch (error: any) {
        console.log(error);
        t.rollback();
        return new BadRequestError(error);
      }
    },
    createOrder: async (
      _: any,
      { input }: { input: CreatePartnershipInputType },
      { user }: { user: UserAccount }
    ) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      let partnership = await Partnership.findOne({
        where: { email: input.email },
        transaction: t,
      });

      if (!partnership) {
        partnership = await Partnership.create(input, { transaction: t });
      }

      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");

      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: input.amount.toString(),
            },
          },
        ],
      });

      try {
        const order = await client.execute(request);

        const payment = await Payment.create(
          {
            first_name: input.first_name,
            last_name: input.last_name,
            email: input.email,
            phone: input.phone,
            amount: input.amount,
            currency: "USD",
            tx_ref: order?.result?.id,
            user_id: user?.id,
            reason: "For Partnership ",
            payment_method: input.payment_method,
          },
          { transaction: t }
        );

        if (input.partnership_type === "Recurring") {
          const month = getPaymentFrequencyUnit(input.partnership_plan!);
          const due_date = dayjs(new Date()).add(month, "month");

          await Partnership.update(
            { due_date },
            { where: { id: partnership.id }, transaction: t }
          );
        }

        await sendPartnershipConfirmationEmail(
          partnership.email,
          partnership.first_name,
          partnership.last_name
        );

        await t.commit();
        return order.result?.id;
      } catch (err: any) {
        // console.log(err);
        await t.rollback();
        return new BadRequestError(err.message);
      }
    },
    captureOrder: async (
      _: any,
      {
        input,
        orderID,
      }: { input: CreatePartnershipInputType; orderID: string },
      { user }: { user: UserAccount }
    ) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      const partnership = await Payment.findOne({
        where: {
          tx_ref: orderID,
        },
        transaction: t,
      });

      const request = new paypal.orders.OrdersCaptureRequest(orderID);
      // request.requestBody({});

      try {
        const capture = await client.execute(request);

        await Payment.update(
          {
            status: capture.result?.status,
          },
          {
            where: {
              tx_ref: orderID,
            },
            transaction: t,
          }
        );

        await t.commit();
        return capture;
      } catch (err: any) {
        await t.rollback();
        return new BadRequestError(err.message);
      }
    },
    // createSubscription: async (
    //   _: any,
    //   { input }: { input: CreatePartnershipInputType },
    //   { user }: { user: UserAccount }
    // ) => {
    //   let t: Transaction = await sequelize.transaction({
    //     isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    //   });

    //   const access_token = await getAccessToken();
    //   const requestId = new Date().getTime();

    //   const productData = {
    //     name: "JPS TV Partnership",
    //     description: "JPS TV Partnership",
    //     type: "SERVICE",
    //     category: "SOFTWARE",
    //     image_url: "https://example.com/streaming.jpg",
    //     home_url: "https://example.com/home",
    //   };

    //   const productConfig = {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${access_token}`,
    //       "PayPal-Request-Id": requestId,
    //     },
    //   };

    //   const productResponse = await axios.post(
    //     paypalApi + "/v1/catalogs/products",
    //     productData,
    //     productConfig
    //   );

    //   const productID = productResponse.data?.id;

    //   const planHeaders = {
    //     headers: {
    //       Accept: "application/json",
    //       Authorization: `Bearer ${access_token}`,
    //       "Content-Type": "application/json",
    //       "PayPal-Request-Id": requestId,
    //     },
    //   };

    //   const planProduct = {
    //     product_id: productID,
    //     name: input.partnership_plan,
    //     description: input.partnership_plan,
    //     billing_cycles: [
    //       {
    //         frequency: {
    //           interval_unit: "MONTH",
    //           interval_count: getPaymentFrequencyUnit(input.partnership_plan!),
    //         },
    //         tenure_type: "REGULAR",
    //         sequence: 1,
    //         total_cycles: 0,
    //         pricing_scheme: {
    //           fixed_price: {
    //             value: input.amount,
    //             currency_code: "USD",
    //           },
    //         },
    //       },
    //     ],
    //     payment_preferences: {
    //       auto_bill_outstanding: true,
    //       // setup_fee: {
    //       //   value: "10",
    //       //   currency_code: "USD",
    //       // },
    //       setup_fee_failure_action: "CONTINUE",
    //       payment_failure_threshold: 3,
    //     },
    //     // taxes: {
    //     //   percentage: "10",
    //     //   inclusive: false,
    //     // },
    //   };

    //   const planResponse = await axios.post(
    //     paypalApi + "/v1/billing/plans",
    //     planProduct,
    //     planHeaders
    //   );

    //   const planID = planResponse.data?.id;

    //   const subscriptionHeaders = {
    //     headers: {
    //       Accept: "application/json",
    //       Authorization: `Bearer ${access_token}`,
    //       "Content-Type": "application/json",
    //       "PayPal-Request-Id": requestId,
    //     },
    //   };

    //   const subscriptionData = {
    //     plan_id: planID,
    //     start_time: new Date(),
    //     shipping_amount: {
    //       currency_code: "USD",
    //       value: input.amount,
    //     },
    //     subscriber: {
    //       name: {
    //         given_name: input.first_name + " " + input.last_name,
    //         surname: input.first_name + " " + input.last_name,
    //       },
    //       email_address: input.email,
    //       shipping_address: {
    //         name: {
    //           full_name: input.first_name + " " + input.last_name,
    //         },
    //         address: {
    //           address_line_1: "JPS TV",
    //           address_line_2: "JPS TV",
    //           admin_area_2: "JPS TV",
    //           admin_area_1: "CA",
    //           postal_code: "95131",
    //           country_code: "US",
    //         },
    //       },
    //     },
    //     application_context: {
    //       brand_name: "JPS TV",
    //       locale: "en-US",
    //       shipping_preference: "SET_PROVIDED_ADDRESS",
    //       user_action: "SUBSCRIBE_NOW",
    //       payment_method: {
    //         payer_selected: "PAYPAL",
    //         payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
    //       },
    //       return_url: "https://example.com/return",
    //       cancel_url: "https://example.com/cancel",
    //     },
    //   };

    //   try {
    //     const subscriptinoResponse = await axios.post(
    //       paypalApi + "/v1/billing/subscriptions",
    //       subscriptionData,
    //       subscriptionHeaders
    //     );
    //   } catch (error) {
    //     console.log(error);
    //   }

    //   // console.log(subscriptinoResponse);

    //   // return subscriptinoResponse;

    //   // console.log(productResponse.data, planResponse.data);

    //   return planResponse.data?.id;

    //   const partnership = await Partnership.create(input, {
    //     transaction: t,
    //   });

    //   const request = new paypal.orders.OrdersCreateRequest();
    //   request.prefer("return=representation");

    //   request.requestBody({
    //     intent: "CAPTURE",
    //     purchase_units: [
    //       {
    //         amount: {
    //           currency_code: "USD",
    //           value: input.amount.toString(),
    //         },
    //       },
    //     ],
    //   });

    //   try {
    //     const order = await client.execute(request);

    //     await Partnership.update(
    //       {
    //         paypal_status: order.result?.status,
    //         paypal_order_id: order?.result?.id,
    //       },
    //       {
    //         where: {
    //           id: partnership.id,
    //         },
    //         transaction: t,
    //       }
    //     );

    //     await t.commit();
    //     return order.result?.id;
    //   } catch (err: any) {
    //     // console.log(err);
    //     await t.rollback();
    //     return new BadRequestError(err.message);
    //   }
    // },
    // captureSubscription: async (
    //   _: any,
    //   {
    //     input,
    //     orderID,
    //   }: { input: CreatePartnershipInputType; orderID: string },
    //   { user }: { user: UserAccount }
    // ) => {
    //   let t: Transaction = await sequelize.transaction({
    //     isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    //   });

    //   const partnership = await Partnership.findOne({
    //     where: {
    //       paypal_order_id: orderID,
    //     },
    //     transaction: t,
    //   });
    //   const request = new paypal.orders.OrdersCaptureRequest(orderID);
    //   // request.requestBody({});

    //   try {
    //     const capture = await client.execute(request);

    //     await Partnership.update(
    //       {
    //         paypal_status: capture.result?.status,
    //       },
    //       {
    //         where: {
    //           paypal_order_id: orderID,
    //         },
    //         transaction: t,
    //       }
    //     );

    //     await t.commit();
    //     return capture;
    //   } catch (err: any) {
    //     await t.rollback();
    //     return new BadRequestError(err.message);
    //   }
    // },
  },
  Subscription: {
    paymentSuccessful: {
      subscribe: (_: any, { tx_ref }: { tx_ref: string }) =>
        pubsub.asyncIterator([`${PAYMENT_SUCCESSFUL}.${tx_ref}`]),
    },
    paymentVerified: {
      subscribe: (_: any, { tx_ref }: { tx_ref: string }) =>
        pubsub.asyncIterator([`${PAYMENT_VERIFIED}.${tx_ref}`]),
    },
  },
};

export default partnershipResolvers;

const getPaymentFrequencyUnit = (plan: string) => {
  switch (plan) {
    case "Every Month":
      return 1;
    case "Every 3 Month":
      return 3;
    case "Every 6 Month":
      return 6;
    case "Every Year":
      return 12;

    default:
      return 12;
  }
};
