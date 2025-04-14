import { omit } from "lodash";
import { Transaction } from "sequelize";
import { generateRandomString } from "../helpers/helpers";
import Payment from "../models/payment.model";
import Teaching from "../models/teaching.model";
import Order from "../models/teaching_order.model";
import TeachingXOrder from "../models/teaching_x_order.model";
import User from "../models/user.model";
import createChapaPayment, { PaymentTypes } from "../services/services";
import { CreateTeachingOrderInputType } from "../types/resolvers-types";
import sequelize from "../utils/db.connection";

const orderResolvers = {
  Query: {
    getTeachingOrders: async () =>
      await Order.findAll({ include: [Teaching, User, Payment] }),

    getTeachingOrder: async (_: any, { id }: { id: number }) =>
      await Order.findByPk(id, { include: [Teaching, User, Payment] }),
  },

  Mutation: {
    createTeachingOrder: async (
      _: any,
      { input }: { input: CreateTeachingOrderInputType }
    ) => {
      const transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        let user = await User.findByPk(input.user_id);

        if (!user) {
          throw new Error("User not registered !");
        }

        // create order

        const order = await Order.create(
          {
            ...omit(input, ["items"]),
            order_no: generateRandomString(8),
          },
          { transaction }
        );

        // initiate payment

        const paymentInstance = await createChapaPayment({
          first_name: input.first_name,
          last_name: input.last_name,
          phone: input.phone,
          email: input.email,
          amount: input.sub_total,
          currency: input.currency,
          reason: PaymentTypes.TeachingSales,
        });

        // console.log({ amount });

        console.log({ paymentInstance });

        const payment = await Payment.create(
          {
            first_name: input.first_name,
            last_name: input.last_name,
            email: input.email,
            phone: input.phone,
            amount: input.sub_total,
            currency: input.currency,
            tx_ref: paymentInstance.tx_ref,
            user_id: user.id,
            reason: PaymentTypes.TeachingSales,
            payment_method: "chapa",
          },
          { transaction }
        );

        // create orderXteaching

        await Promise.all(
          input.items?.map(async (item) => {
            await TeachingXOrder.create(
              {
                order_id: order.id,
                quantity: item.quantity,
                price: item.price,
                total: item.total,
              },
              {
                transaction,
              }
            );
          })
        );

        // email

        // const emailed = await sendPartnerRegistrationConfirmationEmail(
        //   input.email,
        //   input.first_name,
        //   input.last_name
        // );

        // console.log({ payment });

        await transaction.commit();

        return paymentInstance;
      } catch (error) {
        await transaction.rollback();
        console.error("Error creating partner:", error);
        throw error;
      }
    },

    deleteTeachingOrder: async (_: any, { id }: { id: number }) => {
      const order = await Order.findByPk(id);
      if (!order) return false;
      await order.destroy();
      return true;
    },
  },
};

export default orderResolvers;
