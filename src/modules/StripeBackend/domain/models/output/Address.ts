export type Address = {
  city: string;
  country: string; //ISO 3166-1 alpha-2
  line1: string;
  line2: string;
  postalCode: string;
  state: string;
};

export type ShippingAddress = {
  address: Address | null;
  name: string;
  phone: string;
};
