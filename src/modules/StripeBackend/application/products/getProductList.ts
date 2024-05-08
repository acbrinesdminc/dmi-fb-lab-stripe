import { GetProductsListParams } from "../../domain/models/input/GetProductsListParams";
import { StripeBackendRepository } from "../../domain/repositories/StripeBackendRepository";

export const getProductList = (
  repository: StripeBackendRepository,
  params: GetProductsListParams,
) => {
  return repository.searchProducts(params);
};
