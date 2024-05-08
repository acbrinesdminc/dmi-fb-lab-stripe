import { Currencies, Currency } from "../models/output/Currencies";

export const getCurrencyConfig = (currencyCode: string) => {
  if (!Currencies.hasOwnProperty(currencyCode)) {
    return Currencies[process.env.REACT_APP_DEFAULT_CURRENCY_CODE || "USD"];
  }

  return Currencies[currencyCode] as Currency;
};
