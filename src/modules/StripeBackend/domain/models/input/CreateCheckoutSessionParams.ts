import { Stripe } from "stripe";

export interface CheckoutLineItem {
  price?: string;
  quantity?: number;
}

export enum CheckoutModes {
  payment = "payment",
  subscription = "subscription",
}

export enum CheckoutUIModes {
  embedded = "embedded",
  hosted = "hosted",
}

export interface CreateCheckoutSessionParams {
  customerId: string;
  lineItems: CheckoutLineItem[];
  mode: CheckoutModes;
  uiMode: CheckoutUIModes;
  returnUrl?: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Stripe.Metadata[];
}
