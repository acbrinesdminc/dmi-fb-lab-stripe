import { Stripe } from "stripe";
import {
  Address,
  ShippingAddress,
} from "../../../domain/models/output/Address";

export const addressMapper = (
  address?: Stripe.Address | null,
): Address | null => {
  if (!address) {
    return null;
  }

  return {
    city: address.city || "",
    country: address.country || "",
    line1: address.line1 || "",
    line2: address.line2 || "",
    postalCode: address.postal_code || "",
    state: address.state || "",
  };
};

export const shippingAddressMapper = (
  shipping: Stripe.Customer.Shipping | null,
): ShippingAddress | null => {
  if (!shipping) {
    return null;
  }

  return {
    name: shipping.name || "",
    phone: shipping.phone || "",
    address: addressMapper(shipping.address),
  };
};
