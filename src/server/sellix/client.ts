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

/**
 * Creates a payment and invoice on Sellix.
 * When using white_label, the return_url is required.
 * The payment will be handled by Sellix, and the user will be redirected to the return_url.
 *
 * @see https://developers.sellix.io/#sellix_checkout
 *
 * @param body The options for the payment.
 */
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
