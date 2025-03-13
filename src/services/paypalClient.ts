import axios from "axios";
import { configDotenv } from "dotenv";

configDotenv();

let clientId = process.env.PAYPAL_SANDBOX_CLIENT_ID!;
let clientSecret = process.env.PAYPAL_SANDBOX_CLIENT_SECRET!;
let paypalApi = process.env.PAYPAL_SANDBOX_PAYPAL_API!;

export const getAccessToken = async () => {
  const data = {
    grant_type: "client_credentials",
  };

  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
    auth: {
      username: clientId,
      password: clientSecret,
    },
    url: paypalApi + "/v1/oauth2/token",
  };

  return await axios(options).then((response) => {
    return response.data.access_token;
  });
};
