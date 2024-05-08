import { GetCheckoutSessionParams } from "../../domain/models/input/GetCheckoutSessionParams";
import { StripeBackendRepository } from "../../domain/repositories/StripeBackendRepository";

export const getCheckoutSession = (
  repository: StripeBackendRepository,
  params: GetCheckoutSessionParams,
) => repository.getCheckoutSession(params);
