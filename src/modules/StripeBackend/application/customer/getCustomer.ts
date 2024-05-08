import { StripeBackendRepository } from "../../domain/repositories/StripeBackendRepository";

export const getCustomer = (
  repository: StripeBackendRepository,
  customerId: string,
) => {
  return repository.getCustomer({ uid: customerId });
};
