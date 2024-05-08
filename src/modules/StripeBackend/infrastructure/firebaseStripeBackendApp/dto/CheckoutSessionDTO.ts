import { Stripe } from "stripe";

export interface CheckoutSessionDTO extends Stripe.Checkout.Session {}
