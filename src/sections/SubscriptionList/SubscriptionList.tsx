import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckoutLineItem,
  CheckoutModes,
  CheckoutUIModes,
  CreateCheckoutSessionParams,
} from "../../modules/StripeBackend/domain/models/input/CreateCheckoutSessionParams";
import { GetProductsListParams } from "../../modules/StripeBackend/domain/models/input/GetProductsListParams";
import { Price } from "../../modules/StripeBackend/domain/models/output/Price";
import { Product } from "../../modules/StripeBackend/domain/models/output/Product";
import { useFirebaseAppContext } from "../../providers/FirebaseAppContext/FirebaseAppContext";

const SubscriptionList = () => {
  const { searchProducts, createCheckoutSession, checkoutErrorsMessages } =
    useFirebaseAppContext();
  const [productsListQueried, setProductsListQueried] =
    useState<boolean>(false);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const navigate = useNavigate();

  const createHostedCartCheckoutSession = async (price: Price) => {
    const checkoutParams: Omit<
      CreateCheckoutSessionParams,
      "customerId" | "customerEmail"
    > = {
      lineItems: [
        {
          price: price.id,
          quantity: 1,
        } as CheckoutLineItem,
      ],
      mode: CheckoutModes.subscription,
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

  useEffect(() => {
    const getSpainProductsList = async () => {
      const queryParams: GetProductsListParams = {
        metadata: [
          {
            key: "type",
            value: "membership_subscription",
          },
        ],
      };
      const { products } = await searchProducts(queryParams);

      setProductsList(products || []);
      setProductsListQueried(true);
    };

    if (!productsListQueried) {
      getSpainProductsList();
    }
  }, [productsListQueried, searchProducts]);

  return (
    <div className="bg-white">
      <h3
        className={"px-4 py-16 font-bold text-2xl cursor-pointer"}
        onClick={() => navigate("/Cart")}
      >
        Go to cart
      </h3>
      <hr />

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Subscription list
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {Boolean(productsList.length) &&
            productsList.map((product) => (
              <div className="group relative" key={product.id}>
                <h3 className="mb-4 text-2xl text-gray-700">{product.name}</h3>

                {product.prices.map((price) => (
                  <div
                    key={price.id}
                    className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-4"
                  >
                    <p className="mt-1 text-lg font-medium text-gray-900">
                      {Intl.NumberFormat(price.currency.code, {
                        style: "currency",
                        currency: price.currency.code,
                        maximumFractionDigits: price.currency.decimalDigits,
                        minimumFractionDigits: price.currency.decimalDigits,
                      }).format(price.unitAmount / 100)}
                    </p>

                    <div className={"flex justify-between"}>
                      <button
                        className={
                          "btn overflow-hidden relative w-64 bg-red-400 mr-4 text-white py-4 px-4 rounded-xl font-bold uppercase --"
                        }
                        onClick={() => createHostedCartCheckoutSession(price)}
                      >
                        Subscribe
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>

      {Boolean(checkoutErrorsMessages.length) && (
        <ul>
          {checkoutErrorsMessages.map((message, index) => (
            <li key={`error-number-${index}`}>{message}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SubscriptionList;
