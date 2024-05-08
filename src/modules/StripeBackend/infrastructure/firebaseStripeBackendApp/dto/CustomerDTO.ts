import { Stripe } from "stripe";

export interface CustomerDTO extends Stripe.Customer {
  metadata: Stripe.Metadata & {
    firebaseUID: string;
  };
}
