import { Stripe } from "stripe";
import {
  Price,
  PriceBillingScheme,
  PriceRecurring,
  PriceRecurringInterval,
  PriceTaxBehavior,
  PriceType,
} from "../../../domain/models/output/Price";
import { getCurrencyConfig } from "../../../domain/utils/getCurrencyConfig";

export const stripeTaxCodeToString = (
  taxCode: string | Stripe.TaxCode | null,
) => {
  if (taxCode === null) {
    return null;
  }

  if (taxCode instanceof String) {
    return taxCode as string;
  }

  const { id } = taxCode as Stripe.TaxCode;

  return id;
};

export const stripePriceRecurringToPriceRecurring = (
  recurring: Stripe.Price.Recurring,
): PriceRecurring => ({
  interval: recurring.interval as PriceRecurringInterval,
  intervalCount: recurring.interval_count,
});

export const stripePriceToPrice = (price: Stripe.Price): Price => ({
  id: price.id,
  active: price.active,
  billingScheme:
    price.billing_scheme === "per_unit"
      ? PriceBillingScheme.perUnit
      : PriceBillingScheme.tiered,
  currency: getCurrencyConfig(price.currency),
  customUnitAmount: price.custom_unit_amount,
  metadata: price.metadata,
  recurring:
    price.recurring === null
      ? null
      : stripePriceRecurringToPriceRecurring(price.recurring),
  taxBehavior: price.tax_behavior as PriceTaxBehavior,
  type: price.type === "one_time" ? PriceType.oneTime : PriceType.recurring,
  unitAmount: price.unit_amount || 0,
  unitAmountDecimal: price.unit_amount_decimal || "",
});

export const stripeDefaultPriceToPrice = (
  defaultPrice: string | Stripe.Price | null | undefined,
  prices: Price[],
): Price => {
  if (!defaultPrice) {
    return prices[0];
  }

  if (typeof defaultPrice === "string") {
    return prices.find(({ id }) => defaultPrice) || prices[0];
  }

  return stripePriceToPrice(defaultPrice as Stripe.Price);
};
