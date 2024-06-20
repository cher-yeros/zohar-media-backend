import axios from "axios";
import crypto from "crypto";
import { Secret } from "jsonwebtoken";
import { alphanumeric } from "nanoid-dictionary";
// import { nanoid, customAlphabet } from "nanoid";

const createChapaPayment = async ({
  first_name,
  last_name,
  phone,
  email,
  amount,
  currency,
}: {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  amount: number;
  currency: string;
}) => {
  const tx_ref = "tx_" + new Date().getTime();

  const CHAPA_TEST_SECRET_KEY = process.env.CHAPA_TEST_SECRET_KEY as Secret;

  const CHAPA_URL = "https://api.chapa.co/v1/transaction/initialize";

  const CALLBACK_URL = `http://localhost:4000/api/verify-payment/${tx_ref}`;
  const RETURN_URL = `http://localhost:3000/payment-success/${tx_ref}`;

  try {
    const config = {
      headers: {
        Authorization: "Bearer " + CHAPA_TEST_SECRET_KEY,
      },
    };

    const data = {
      amount: amount,
      currency: currency,
      email: email,
      phone: phone,
      first_name: first_name,
      last_name: last_name,
      tx_ref: tx_ref,
      return_url: RETURN_URL,
      callback_url: CALLBACK_URL,
    };

    const response = await axios.post(CHAPA_URL, data, config);

    return { ...response.data, tx_ref };
  } catch (error) {
    throw error;
  }
};

export const checkPaymentStatus = async (tx_id: string) => {
  const CHAPA_BASE_URL = process.env.CHAPA_BASE_URL as Secret;
  const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY as Secret;
  const response = await axios.get(
    `${CHAPA_BASE_URL}/transaction/verify/${tx_id}`,
    {
      headers: {
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
      },
    }
  );
  // console.log(response.data);
  return response;
};

export default createChapaPayment;
export function generateTxRef(userId: number): string {
  // Get the current timestamp
  const timestamp = new Date().toISOString();

  // Generate a random string
  const randomString = crypto.randomBytes(4).toString("hex");

  // Combine user ID, timestamp, and random string to create a unique tx_ref
  const txRef = `chapa_${userId}_${timestamp}_${randomString}`;

  return txRef.replace(/[:.-]/g, ""); // Remove special characters to make it URL safe
}
