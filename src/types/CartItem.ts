import { Price } from "../modules/StripeBackend/domain/models/output/Price";
import { Product } from "../modules/StripeBackend/domain/models/output/Product";

export type CartItem = Omit<Product, "defaultPrice" | "prices"> & {
  count: number;
  price: Price;
};
