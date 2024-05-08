import { Stripe } from "stripe";

export interface ProductDTO extends Stripe.Product {
  marketing_features: { name: string }[];
  prices: Stripe.Price[];
}
