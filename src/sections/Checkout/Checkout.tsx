import { useEffect, useState } from "react";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useFirebaseAppContext } from "../../providers/FirebaseAppContext/FirebaseAppContext";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_API_KEY as string,
);

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState<string>("");
  const { getCheckoutSession } = useFirebaseAppContext();

  const fetchClientSecret = async () => {
    // Create a Checkout Session
    const checkoutSession = await getCheckoutSession();
    setClientSecret(checkoutSession?.client_secret as string);
  };

  useEffect(() => {
    fetchClientSecret();
  }, []);

  return (
    <>
      {!clientSecret && <h1>Loading...</h1>}

      {clientSecret && (
        <>
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </>
      )}
    </>
  );
};

export default Checkout;
