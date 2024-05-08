import {
  CheckoutLineItem,
  CheckoutModes,
  CheckoutUIModes,
  CreateCheckoutSessionParams,
} from "../models/input/CreateCheckoutSessionParams";

export const validateCheckoutParams = (
  checkoutParams: CreateCheckoutSessionParams,
) => {
  const errors = [];

  if (checkoutParams.customerId === undefined) {
    errors.push("Customer id not defined");
  }

  if (checkoutParams.mode === undefined) {
    errors.push("Mode not defined");
  } else if (
    checkoutParams.mode !== CheckoutModes.payment &&
    checkoutParams.mode !== CheckoutModes.subscription
  ) {
    errors.push(
      `Invalid mode '${checkoutParams.mode}'. Modes accepted are payment or subscription`,
    );
  }

  if (checkoutParams.uiMode === undefined) {
    errors.push("UI mode not defined");
  } else if (
    checkoutParams.uiMode !== CheckoutUIModes.embedded &&
    checkoutParams.uiMode !== CheckoutUIModes.hosted
  ) {
    errors.push(
      `Invalid UI mode '${checkoutParams.uiMode}'. Modes accepted are embedded or hosted`,
    );
  }

  if (checkoutParams.uiMode === CheckoutUIModes.hosted) {
    if (checkoutParams.successUrl === undefined) {
      errors.push(
        "Undefined success URL. When the UI mode is embedded this param is required",
      );
    }
  } else {
    if (checkoutParams.successUrl !== undefined) {
      errors.push(
        "Invalid para success URL. Success url is not allowed when the UI mode is embedded",
      );
    }

    if (checkoutParams.returnUrl === undefined) {
      errors.push(
        "Undefined return URL. When the UI mode is embedded this param is required",
      );
    }
  }

  if (checkoutParams.lineItems === undefined) {
    errors.push("Line items not defined");
  } else {
    if (checkoutParams.lineItems.length === 0) {
      errors.push("Any price defined");
    } else {
      checkoutParams.lineItems.forEach(({ price, quantity }, index) => {
        if (price === undefined) {
          errors.push(`Price in line ${index} not defined`);
        }

        if (quantity === undefined) {
          errors.push(`Quantity in line ${index} not defined`);
        }
      });
    }
  }

  return errors;
};
