import { MetaData } from "./MetaData";
import { Price } from "./Price";

export type Product = {
  id: string;
  active: boolean;
  defaultPrice: Price;
  description: string;
  images: string[];
  marketingFeatures: string[];
  metadata: MetaData;
  name: string;
  taxCode: string | null;
  url: string | null;
  prices: Price[];
};
