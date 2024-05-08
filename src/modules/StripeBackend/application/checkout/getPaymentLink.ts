import { GetPaymentLinkParams } from "../../domain/models/input/GetPaymentLinkParams";
import { StripeBackendRepository } from "../../domain/repositories/StripeBackendRepository";

export const getPaymentLink = (
  repository: StripeBackendRepository,
  params: GetPaymentLinkParams,
) => repository.getPaymentLink(params);
