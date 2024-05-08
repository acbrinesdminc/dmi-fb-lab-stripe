import { CreateCheckoutSessionParams } from "../../domain/models/input/CreateCheckoutSessionParams";
import { StripeBackendRepository } from "../../domain/repositories/StripeBackendRepository";
import { validateCheckoutParams } from "../../domain/utils/validateCheckoutParams";

export const createCheckoutSession = (
  repository: StripeBackendRepository,
  params: CreateCheckoutSessionParams,
) => {
  const errors = validateCheckoutParams(params);

  if (errors.length) {
    return Promise.reject(errors);
  }

  return repository.createCheckoutSession(params);
};
