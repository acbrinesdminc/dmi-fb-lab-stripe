import {
  createContext,
  useState,
  PropsWithChildren,
  useContext,
  useEffect,
} from "react";
import {
  singIn as authSingIn,
  singOut as authSingOut,
} from "../../modules/StripeBackend/application/auth/authService";
import { cancelCheckoutSession as fbaCancelCheckoutSession } from "../../modules/StripeBackend/application/checkout/cancelCheckoutSession";
import { createCheckoutSession as fbaCreateCheckoutSession } from "../../modules/StripeBackend/application/checkout/createCheckoutSession";
import { getPaymentLink as fbaGetPaymentLink } from "../../modules/StripeBackend/application/checkout/getPaymentLink";
import { getCustomer as fbaGetCustomer } from "../../modules/StripeBackend/application/customer/getCustomer";
import { getProduct as fbaGetProduct } from "../../modules/StripeBackend/application/products/getProduct";
import { getProductList } from "../../modules/StripeBackend/application/products/getProductList";
import { CancelCheckoutSessionParams } from "../../modules/StripeBackend/domain/models/input/CancelCheckoutSessionParams";
import { CreateCheckoutSessionParams } from "../../modules/StripeBackend/domain/models/input/CreateCheckoutSessionParams";
import { GetPaymentLinkParams } from "../../modules/StripeBackend/domain/models/input/GetPaymentLinkParams";
import { GetProductParams } from "../../modules/StripeBackend/domain/models/input/GetProductParams";
import { AuthUser } from "../../modules/StripeBackend/domain/models/output/AuthUser";
import { CheckoutSession } from "../../modules/StripeBackend/domain/models/output/CheckoutSession";
import { Customer } from "../../modules/StripeBackend/domain/models/output/Customer";
import { StripeBackendRepository } from "../../modules/StripeBackend/domain/repositories/StripeBackendRepository";

interface FirebaseAppContextState extends StripeBackendRepository {
  user: AuthUser | null;
  errorMessage: string | undefined;
  singIn: () => Promise<AuthUser | null>;
  singOut: () => Promise<Boolean>;
  getCustomer: () => Promise<Customer | null>;
  isCustomerLoggedIn: boolean;
  createCheckoutSession: (
    params: Omit<CreateCheckoutSessionParams, "customerId" | "customerEmail">,
  ) => Promise<CheckoutSession | null>;
  checkoutErrorsMessages: string[];
  getCheckoutSession: () => Promise<CheckoutSession | null>;
}
const FirebaseAppContext = createContext<FirebaseAppContextState>(
  {} as FirebaseAppContextState,
);

export const FirebaseAppContextProvider = ({
  children,
  repository,
}: PropsWithChildren<{ repository: StripeBackendRepository }>) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [checkoutSession, setCheckoutSession] =
    useState<CheckoutSession | null>(null);
  const [checkoutErrors, setCheckoutErrors] = useState<string[]>([]);

  const singIn = async () => {
    if (authUser) {
      return Promise.resolve(authUser);
    }

    try {
      const authUser = await authSingIn(repository);

      if (!authUser) {
        return null;
      }

      setAuthUser(authUser);
      return authUser;
    } catch (error) {
      // @ts-ignore
      setErrorMessage(error.message);

      return null;
    }
  };

  const singOut = async () => {
    try {
      await authSingOut(repository);
      return true;
    } catch (error) {
      return false;
    }
  };

  const getCustomer = async () => {
    if (authUser === null) {
      return Promise.resolve(null);
    }

    if (customer) {
      return Promise.resolve(customer);
    }

    const stripeCustomer = await fbaGetCustomer(repository, authUser.uid);
    setCustomer(stripeCustomer);
    return stripeCustomer;
  };

  const createCheckoutSession = async (
    params: Omit<CreateCheckoutSessionParams, "customerId" | "customerEmail">,
  ) => {
    setCheckoutErrors([]);

    if (!customer) {
      return Promise.reject("No customer");
    }

    if (checkoutSession) {
      return Promise.resolve(checkoutSession);
    }

    try {
      const session = await fbaCreateCheckoutSession(repository, {
        ...params,
        customerId: customer.id,
      });

      setCheckoutSession(session);
      return session;
    } catch (errors) {
      setCheckoutErrors(errors as string[]);
      return Promise.reject(null);
    }
  };

  const getCheckoutSession = async () => {
    if (checkoutSession !== null && checkoutSession) {
      return Promise.resolve(checkoutSession);
    }

    return Promise.reject(null);
  };

  const cancelCheckoutSession = async ({
    sessionId,
  }: CancelCheckoutSessionParams) => {
    setCheckoutSession(null);
    return await fbaCancelCheckoutSession(repository, { sessionId });
  };

  useEffect(() => {
    if (authUser !== null) {
      getCustomer();
    }
  }, [authUser]);

  return (
    <FirebaseAppContext.Provider
      value={{
        user: authUser,
        errorMessage,
        singIn,
        singOut,
        searchProducts: (params) => getProductList(repository, params),
        getProduct: ({ productId }: GetProductParams) =>
          fbaGetProduct(repository, productId),
        getCustomer,
        isCustomerLoggedIn: customer !== null,
        getPaymentLink: ({ paymentLinkId }: GetPaymentLinkParams) =>
          fbaGetPaymentLink(repository, { paymentLinkId }),
        createCheckoutSession,
        checkoutErrorsMessages: checkoutErrors,
        getCheckoutSession,
        cancelCheckoutSession,
      }}
    >
      {children}
    </FirebaseAppContext.Provider>
  );
};

export const useFirebaseAppContext = () => useContext(FirebaseAppContext);
