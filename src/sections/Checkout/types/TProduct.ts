export type TPrice = {
  id: string;
  unit_amount: number;
  type: string;
  transform_quantity: null;
  interval_count: number;
  trial_period_days: number | null;
  billing_scheme: string;
  tax_behavior: string;
  metadata: {};
  interval: string;
  tiers_mode: null;
  active: true;
  currency: string;
  product: string;
  description: string | null;
  recurring: {
    interval_count: number;
    usage_type: string;
    trial_period_days: number | null;
    interval: string;
    aggregate_usage: null;
  };
};

export type TProduct = {
  id: string;
  name: string;
  metadata: {};
  active: boolean;
  images: string[];
  description: string;
  taxCode: string;
  prices: TPrice[];
};
