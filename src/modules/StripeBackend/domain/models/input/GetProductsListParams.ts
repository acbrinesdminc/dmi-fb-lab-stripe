import { MetaData } from "../output/MetaData";

export interface GetProductsListParams {
  active?: boolean;
  metadata?: MetaData[];
  name?: string;
  description?: string;
  shippable?: boolean;
}
