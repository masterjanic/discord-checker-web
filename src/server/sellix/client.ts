import axios from "axios";

import { env } from "~/env";

const SELLIX_ENDPOINT = "https://dev.sellix.io/v1";

interface ICreatePaymentOptions {
  title: string;
  gateways?: string[];
  value: number;
  quantity: number;
  email: string;
  currency: string;
  white_label: boolean;
  return_url?: string;
  custom_fields?: Record<string, string>;
}

interface ICreatePaymentResponse {
  data: {
    url: string;
  };
}

export const createPayment = async (body: ICreatePaymentOptions) => {
  return await axios.post<ICreatePaymentResponse>(
    `${SELLIX_ENDPOINT}/payments`,
    body,
    {
      headers: {
        Authorization: `Bearer ${env.SELLIX_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );
};
