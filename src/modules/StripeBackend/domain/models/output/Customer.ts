import { Address, ShippingAddress } from "./Address";
import { MetaData } from "./MetaData";

export type Customer = {
  id: string;
  address: Address | null; // billing
  currency: string | null;
  email: string;
  metadata: MetaData;
  name: string;
  phone: string;
  preferredLocale: string;
  shipping: ShippingAddress | null;
};
