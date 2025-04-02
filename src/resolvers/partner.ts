import { Transaction } from "sequelize";
import { UserRole } from "../enums";
import Package from "../models/package.model";
import Partner from "../models/partner.model";
import Payment from "../models/payment.model";
import Subscription from "../models/subscription.model";
import User from "../models/user.model";
import { sendPartnershipConfirmationEmail } from "../services/sendEmail";
import createChapaPayment, { PaymentTypes } from "../services/services";
import {
  CreatePartnerInputType,
  UpdatePartnerInputType,
} from "../types/resolvers-types";
import sequelize from "../utils/db.connection";

const partnerResolvers = {
  Query: {
    getPartners: async (_: any, __: any) => {
      return await User.findAll({
        where: {
          role: UserRole.PARTNER,
        },
      });
    },
    getPartner: async (_: any, { id }: { id: number }) => {
      return await User.findByPk(id);
    },
  },
  Mutation: {
    createPartner: async (
      _: any,
      { input }: { input: CreatePartnerInputType }
    ) => {
      const transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        let user = await User.findOne({ where: { phone: input.phone } });

        if (!user) {
          user = await User.create(input, { transaction });

          if (!user) {
            throw new Error("User registration failed!");
          }
        }

        let partner = await Partner.findOne({ where: { phone: input.phone } });

        if (!partner) {
          partner = await Partner.create(
            { ...input, user_id: user.id },
            { transaction }
          );
        }

        const pkg = await Package.findByPk(input.package_id);
        if (!pkg) {
          throw new Error("Invalid package selection!");
        }

        const amount = input.currency === "ETB" ? pkg.price_etb : pkg.price_usd;
        const paymentInstance = await createChapaPayment({
          first_name: input.first_name,
          last_name: input.last_name,
          phone: input.phone,
          email: input.email,
          amount,
          currency: input.currency,
          reason: PaymentTypes.Partnership,
        });

        console.log(paymentInstance);

        const payment = await Payment.create(
          {
            first_name: input.first_name,
            last_name: input.last_name,
            email: input.email,
            phone: input.phone,
            amount,
            currency: input.currency,
            tx_ref: paymentInstance.tx_ref,
            user_id: user.id,
            reason: PaymentTypes.Partnership,
            payment_method: "chapa",
          },
          { transaction }
        );

        await Subscription.create(
          {
            partner_id: user.id,
            package_id: input.package_id,
            payment_id: payment.id,
          },
          { transaction }
        );

        await sendPartnershipConfirmationEmail(
          input.email,
          input.first_name,
          input.last_name
        );

        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        console.error("Error creating partner:", error);
        throw error;
      }
    },
    updatePartner: async (
      _: any,
      { id, input }: { id: number; input: UpdatePartnerInputType }
    ) => {
      const partner = await User.findByPk(id);
      if (!partner) throw new Error("Partner not found");
      return await partner.update(input);
    },
    deletePartner: async (_: any, { id }: { id: number }) => {
      const deleted = await Partner.destroy({ where: { id } });
      return deleted > 0;
    },
  },
};

export default partnerResolvers;
