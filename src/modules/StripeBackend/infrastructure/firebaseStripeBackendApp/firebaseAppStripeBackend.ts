import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider as AuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFunctions, HttpsCallable, httpsCallable } from "firebase/functions";
import { CheckoutSessionDTO } from "./dto/CheckoutSessionDTO";
import { CustomerDTO } from "./dto/CustomerDTO";
import { PaymentLinkDTO } from "./dto/PaymentLinkDTO";
import { ProductDTO } from "./dto/ProductDTO";
import { ProductListDTO } from "./dto/ProductListDTO";
import { customerMapper } from "./mappers/customerMapper";
import { paymentLinkMapper } from "./mappers/paymentLinkMapper";
import { stripeProductToProduct } from "./mappers/productMapper";
import { userMapper } from "./mappers/userMapper";
import { CancelCheckoutSessionParams } from "../../domain/models/input/CancelCheckoutSessionParams";
import { CreateCheckoutSessionParams } from "../../domain/models/input/CreateCheckoutSessionParams";
import { GetCheckoutSessionParams } from "../../domain/models/input/GetCheckoutSessionParams";
import { GetCustomerParams } from "../../domain/models/input/GetCustomerParams";
import { GetPaymentLinkParams } from "../../domain/models/input/GetPaymentLinkParams";
import { GetProductParams } from "../../domain/models/input/GetProductParams";
import { GetProductsListParams } from "../../domain/models/input/GetProductsListParams";
import { CheckoutSession } from "../../domain/models/output/CheckoutSession";
import { Customer } from "../../domain/models/output/Customer";
import { PaymentLink } from "../../domain/models/output/PaymentLink";
import { Product } from "../../domain/models/output/Product";
import { ProductList } from "../../domain/models/output/ProductList";
import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { StripeBackendRepository } from "../../domain/repositories/StripeBackendRepository";
import firebaseConfig from "../config/FirebaseAppConfig";

const firebaseFunctions = getFunctions(
  initializeApp(firebaseConfig),
  process.env.REACT_APP_FIREBASE_DOMAIN,
);
const functionsPrefix = "ext-stripe-backend";
const authProvider = new AuthProvider();
const auth = getAuth();

const firebaseProductsList: HttpsCallable<
  GetProductsListParams,
  ProductListDTO
> = httpsCallable(firebaseFunctions, `${functionsPrefix}-productsList`);

const firebaseProductById: HttpsCallable<
  GetProductParams,
  { product: ProductDTO }
> = httpsCallable(firebaseFunctions, `${functionsPrefix}-productById`);

const firebaseGetCustomerByFirebaseUID: HttpsCallable<
  GetCustomerParams,
  { customer: CustomerDTO }
> = httpsCallable(
  firebaseFunctions,
  `${functionsPrefix}-getCustomerByFirebaseUID`,
);

const firebaseGetPaymentLink: HttpsCallable<
  GetPaymentLinkParams,
  { paymentLink: PaymentLinkDTO }
> = httpsCallable(firebaseFunctions, `${functionsPrefix}-getPaymentLink`);

const firebaseCreateCheckoutSession: HttpsCallable<
  CreateCheckoutSessionParams,
  { checkoutSession: CheckoutSessionDTO }
> = httpsCallable(
  firebaseFunctions,
  `${functionsPrefix}-createCheckoutSession`,
);

const firebaseGetCheckoutSession: HttpsCallable<
  GetCheckoutSessionParams,
  { checkoutSession: CheckoutSessionDTO }
> = httpsCallable(firebaseFunctions, `${functionsPrefix}-getCheckoutSession`);

const firebaseExpireCheckoutSession: HttpsCallable<
  CancelCheckoutSessionParams,
  { checkoutSession: CheckoutSessionDTO }
> = httpsCallable(
  firebaseFunctions,
  `${functionsPrefix}-expireCheckoutSession`,
);

const productsList = async (
  params: GetProductsListParams,
): Promise<ProductList> => {
  const {
    data: { products },
  } = await firebaseProductsList(params);

  return {
    products: products.map(stripeProductToProduct),
  };
};

const productById = async (params: GetProductParams): Promise<Product> => {
  const {
    data: { product },
  } = await firebaseProductById(params);

  return stripeProductToProduct(product);
};

const getCustomerByFirebaseUID = async (
  params: GetCustomerParams,
): Promise<Customer> => {
  const {
    data: { customer },
  } = await firebaseGetCustomerByFirebaseUID(params);

  return customerMapper(customer);
};

const getStripePaymentLink = async (
  params: GetPaymentLinkParams,
): Promise<PaymentLink> => {
  const {
    data: { paymentLink },
  } = await firebaseGetPaymentLink(params);

  return paymentLinkMapper(paymentLink);
};

const createCheckoutSession = async (
  params: CreateCheckoutSessionParams,
): Promise<CheckoutSession> => {
  const {
    data: { checkoutSession },
  } = await firebaseCreateCheckoutSession(params);

  return checkoutSession;
};

const getCheckoutSession = async (
  params: GetCheckoutSessionParams,
): Promise<CheckoutSession> => {
  const {
    data: { checkoutSession },
  } = await firebaseGetCheckoutSession(params);

  return checkoutSession;
};

const cancelCheckoutSession = async (
  params: CancelCheckoutSessionParams,
): Promise<CheckoutSession> => {
  const {
    data: { checkoutSession },
  } = await firebaseExpireCheckoutSession(params);

  return checkoutSession;
};

const singInPopup = async () => {
  try {
    const result = await signInWithPopup(auth, authProvider);
    const credential = AuthProvider.credentialFromResult(result);

    if (credential === null) {
      return null;
    }

    return await userMapper(result.user);
  } catch (error) {
    // @ts-ignore
    return Promise.reject(error.message);
  }
};

const singOut = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    return false;
  }
};

export const createAuthRepository = (): AuthRepository => ({
  singIn: singInPopup,
  singOut,
});

export const createFirebaseAppStripeBackend = (): StripeBackendRepository => ({
  singIn: singInPopup,
  singOut,
  searchProducts: productsList,
  getProduct: productById,
  getCustomer: getCustomerByFirebaseUID,
  getPaymentLink: getStripePaymentLink,
  createCheckoutSession,
  getCheckoutSession,
  cancelCheckoutSession,
});
