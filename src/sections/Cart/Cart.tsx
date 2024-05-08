import { useNavigate } from "react-router-dom";
import {
  CheckoutLineItem,
  CheckoutModes,
  CheckoutUIModes,
  CreateCheckoutSessionParams,
} from "../../modules/StripeBackend/domain/models/input/CreateCheckoutSessionParams";
import { useCartContext } from "../../providers/Cart/CartContext";
import { useFirebaseAppContext } from "../../providers/FirebaseAppContext/FirebaseAppContext";

const Cart = () => {
  const navigate = useNavigate();
  const { singIn } = useFirebaseAppContext();
  const { createCheckoutSession, checkoutErrorsMessages, isCustomerLoggedIn } =
    useFirebaseAppContext();
  const { cartLineItems, totalAmount, currencyConfig } = useCartContext();

  const convertCartItemsToCheckoutLineItems = () => {
    return cartLineItems.reduce(
      (acc: CheckoutLineItem[], { price: { id }, count }) => {
        return [
          ...acc,
          {
            price: id,
            quantity: count,
          } as CheckoutLineItem,
        ];
      },
      [],
    );
  };

  const createEmbeddedCartCheckoutSession = async () => {
    if (!isCustomerLoggedIn) {
      await singIn();
    }

    const checkoutParams: Omit<
      CreateCheckoutSessionParams,
      "customerId" | "customerEmail"
    > = {
      lineItems: convertCartItemsToCheckoutLineItems(),
      mode: CheckoutModes.payment,
      uiMode: CheckoutUIModes.embedded,
      returnUrl: `${window.location.origin}/Success`,
    };

    try {
      await createCheckoutSession(checkoutParams);
      navigate("/Checkout");
    } catch (error) {
      console.log("Cart -- checkoutSession -- error -- ", error);
    }
  };

  const createHostedCartCheckoutSession = async () => {
    if (!isCustomerLoggedIn) {
      await singIn();
    }

    const checkoutParams: Omit<
      CreateCheckoutSessionParams,
      "customerId" | "customerEmail"
    > = {
      lineItems: convertCartItemsToCheckoutLineItems(),
      mode: CheckoutModes.payment,
      uiMode: CheckoutUIModes.hosted,
      successUrl: `${window.location.origin}/Success`,
      cancelUrl: `${window.location.origin}/Cancel`,
    };

    try {
      const checkoutSession = await createCheckoutSession(checkoutParams);

      if (checkoutSession?.url) {
        window.location.href = checkoutSession.url;
      }
    } catch (error) {
      console.log("Cart -- checkoutSession -- error -- ", error);
    }
  };

  return (
    <div className="bg-white">
      <h3
        className={"px-4 py-16 font-bold text-2xl cursor-pointer"}
        onClick={() => navigate("/productList")}
      >
        Back to product list
      </h3>
      <hr />

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Cart list
        </h2>

        <div className={"flex flex-row divide-x "}>
          <div className={"basis-2/3 pr-4 divide-y"}>
            {Boolean(cartLineItems.length) &&
              cartLineItems.map((cartItem) => (
                <div
                  className="group relative flex flex-row mb-4"
                  key={cartItem.id}
                >
                  {cartItem.images[0] && (
                    <div className="basis-1/4 p-4 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md lg:aspect-none">
                      <img
                        src={cartItem.images[0]}
                        alt="Front of men&#039;s Basic Tee in black."
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                      />
                    </div>
                  )}

                  <div className={"basis-2/4"}>
                    <h3 className="mt-4 text-sm text-gray-700">
                      {cartItem.name}
                    </h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {Intl.NumberFormat(cartItem.price.currency.code, {
                        style: "currency",
                        currency: cartItem.price.currency.code,
                        maximumFractionDigits:
                          cartItem.price.currency.decimalDigits,
                        minimumFractionDigits:
                          cartItem.price.currency.decimalDigits,
                      }).format(cartItem.price.unitAmount / 100)}
                    </p>
                  </div>

                  <div className={"basis-1/4"}>Count: {cartItem.count}</div>
                </div>
              ))}
          </div>

          <div className={"basis-1/3 pl-4"}>
            <h3>Total</h3>
            <h5>
              {Intl.NumberFormat(currencyConfig.code, {
                style: "currency",
                currency: currencyConfig.code,
                maximumFractionDigits: currencyConfig.decimalDigits,
                minimumFractionDigits: currencyConfig.decimalDigits,
              }).format(totalAmount / 100)}
            </h5>

            <button
              className={
                "btn mt-5 overflow-hidden relative w-64 bg-blue-500 text-white py-4 px-2 rounded-xl font-bold uppercase transition-all duration-100 ease-in-out hover:bg-amber-200"
              }
              onClick={createEmbeddedCartCheckoutSession}
            >
              Embedded Checkout
            </button>

            <button
              className={
                "btn mt-5 overflow-hidden relative w-64 bg-blue-500 text-white py-4 px-2 rounded-xl font-bold uppercase transition-all duration-100 ease-in-out hover:bg-amber-200"
              }
              onClick={createHostedCartCheckoutSession}
            >
              Hosted Checkout
            </button>

            {Boolean(checkoutErrorsMessages.length) && (
              <ul>
                {checkoutErrorsMessages.map((message, index) => (
                  <li key={`error-number-${index}`}>{message}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
