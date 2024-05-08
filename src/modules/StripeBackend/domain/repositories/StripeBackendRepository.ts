import { AuthRepository } from "./AuthRepository";
import { CancelCheckoutSessionParams } from "../models/input/CancelCheckoutSessionParams";
import { CreateCheckoutSessionParams } from "../models/input/CreateCheckoutSessionParams";
import { GetCheckoutSessionParams } from "../models/input/GetCheckoutSessionParams";
import { GetCustomerParams } from "../models/input/GetCustomerParams";
import { GetPaymentLinkParams } from "../models/input/GetPaymentLinkParams";
import { GetProductParams } from "../models/input/GetProductParams";
import { GetProductsListParams } from "../models/input/GetProductsListParams";
import { CheckoutSession } from "../models/output/CheckoutSession";
import { Customer } from "../models/output/Customer";
import { PaymentLink } from "../models/output/PaymentLink";
import { Product } from "../models/output/Product";
import { ProductList } from "../models/output/ProductList";

export interface StripeBackendRepository extends AuthRepository {
  searchProducts: (params: GetProductsListParams) => Promise<ProductList>;
  getProduct: (params: GetProductParams) => Promise<Product | null>;
  getCustomer: (params: GetCustomerParams) => Promise<Customer | null>;
  getPaymentLink: (params: GetPaymentLinkParams) => Promise<PaymentLink>;
  createCheckoutSession: (
    params: CreateCheckoutSessionParams,
  ) => Promise<CheckoutSession | null>;
  getCheckoutSession: (
    params: GetCheckoutSessionParams,
  ) => Promise<CheckoutSession | null>;
  cancelCheckoutSession: (
    params: CancelCheckoutSessionParams,
  ) => Promise<CheckoutSession | null>;
}
