import { Stripe } from "stripe";

export interface CheckoutSession extends Stripe.Checkout.Session {}
