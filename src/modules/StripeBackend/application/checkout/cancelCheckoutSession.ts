import { CancelCheckoutSessionParams } from "../../domain/models/input/CancelCheckoutSessionParams";
import { StripeBackendRepository } from "../../domain/repositories/StripeBackendRepository";

export const cancelCheckoutSession = (
  repository: StripeBackendRepository,
  params: CancelCheckoutSessionParams,
) => repository.cancelCheckoutSession(params);
