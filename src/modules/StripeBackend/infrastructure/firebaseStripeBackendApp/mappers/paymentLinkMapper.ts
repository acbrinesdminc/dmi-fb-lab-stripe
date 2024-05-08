import { PaymentLink } from "../../../domain/models/output/PaymentLink";
import { PaymentLinkDTO } from "../dto/PaymentLinkDTO";

export const paymentLinkMapper = (
  paymentLink: PaymentLinkDTO,
): PaymentLink => ({
  id: paymentLink.id,
  active: paymentLink.active,
  url: paymentLink.url,
});
