import { StripeBackendRepository } from "../../domain/repositories/StripeBackendRepository";

export const getProduct = (
  repository: StripeBackendRepository,
  productId: string,
) => {
  return repository.getProduct({ productId });
};
