import axios from "axios";
import express, { Request, Response } from "express";
import { Transaction } from "sequelize";
import Payment from "../models/payment.model";
import {
  sendDonationConfirmationEmail,
  sendPartnershipConfirmationEmail,
  sendVisitorConfirmationEmail,
} from "../services/sendEmail";
import { PaymentTypes } from "../services/services";
import sequelize from "../utils/db.connection";
import TeachingSubscription from "../models/subscription.model";
import { SubscriptionStatus } from "../enums";

const router = express.Router();

router.get("/verify/:reason/:tx_ref", async (req: Request, res: Response) => {
  console.log(req.params);

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
    const payment = await Payment.findOne({
      where: { tx_ref: req.params.tx_ref },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const { data } = await axios.get(VERIFY_URL, config);

    console.log("verification ", { ...data, tx_ref: req.params.tx_ref });

    await payment.update({
      status:
        data?.data?.status === "success" ? "COMPLETED" : data?.data?.status,
      payment_method: data?.data?.method,
    });

    await TeachingSubscription.update(
      { status: SubscriptionStatus.ACTIVE },
      {
        where: {
          payment_id: payment.id,
        },
      }
    );

    if (req.params.reason === PaymentTypes.Partnership) {
      await sendPartnershipConfirmationEmail(
        payment.email!,
        payment.first_name!,
        payment.last_name!
      );
    } else if (req.params.reason === PaymentTypes.Donation) {
      await sendDonationConfirmationEmail(
        payment.email!,
        payment.first_name!,
        payment.last_name!
      );
    } else if (req.params.reason === PaymentTypes.Visitor) {
      console.log("here");
      await sendVisitorConfirmationEmail(
        payment.email!,
        payment.first_name!,
        payment.last_name!
      );
    } else if (req.params.reason === PaymentTypes.BibleStudy) {
    } else {
      if (t) {
        t.rollback;
      }
      return res.status(404).json({
        success: false,
        message: "Payment not successful",
      });
    }

    t.commit();

    res.json({ success: true });
  } catch (error) {
    t.rollback();
    res.status(400).json({ error });
  }
});

export default router;
