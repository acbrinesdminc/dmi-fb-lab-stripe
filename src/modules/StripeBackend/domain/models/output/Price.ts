import { CurrencyConfig } from "./Currencies";
import { MetaData } from "./MetaData";

export enum PriceBillingScheme {
  perUnit = "per_unit",
  tiered = "tiered",
}

export type PriceCustomUnitAmount = {
  maximum: number | null;
  minimum: number | null;
  preset: number | null;
} | null;

export enum PriceRecurringInterval {
  day = "day",
  month = "month",
  week = "week",
  year = "year",
}

export type PriceRecurring = {
  interval: PriceRecurringInterval;
  intervalCount: number;
} | null;

export enum PriceType {
  oneTime = "one_time",
  recurring = "recurring",
}

export enum PriceTaxBehavior {
  exclusive = "exclusive",
  inclusive = "inclusive",
  unspecified = "unspecified",
}

export type Price = {
  id: string;
  active: boolean;
  billingScheme: PriceBillingScheme;
  currency: CurrencyConfig;
  customUnitAmount: PriceCustomUnitAmount;
  metadata: MetaData;
  recurring: PriceRecurring;
  taxBehavior: PriceTaxBehavior;
  type: PriceType;
  unitAmount: number;
  unitAmountDecimal: string;
};
