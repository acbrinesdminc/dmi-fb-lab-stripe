import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { createFirebaseAppStripeBackend } from "./modules/StripeBackend/infrastructure/firebaseStripeBackendApp/firebaseAppStripeBackend";
import { CartContextProvider } from "./providers/Cart/CartContext";
import { FirebaseAppContextProvider } from "./providers/FirebaseAppContext/FirebaseAppContext";
import Cancel from "./sections/Cancel";
import Cart from "./sections/Cart";
import Checkout from "./sections/Checkout";
import Login from "./sections/Login";
import PricingTable from "./sections/PricingTable";
import ProductList from "./sections/ProductList";
import SubscriptionList from "./sections/SubscriptionList";
import Success from "./sections/Success";

const App = () => {
  const authRepository = createFirebaseAppStripeBackend();

  return (
    <FirebaseAppContextProvider repository={authRepository}>
      <CartContextProvider>
        <Router>
          <Routes>
            <Route path={"/"} element={<Login />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/checkout"} element={<Checkout />} />
            <Route path={"/pricing"} element={<PricingTable />} />
            <Route path={"/productList"} element={<ProductList />} />
            <Route path={"/subscriptionList"} element={<SubscriptionList />} />
            <Route path={"/Cart"} element={<Cart />} />
            <Route path={"/Success"} element={<Success />} />
            <Route path={"/Cancel"} element={<Cancel />} />
          </Routes>
        </Router>
      </CartContextProvider>
    </FirebaseAppContextProvider>
  );
};

export default App;
