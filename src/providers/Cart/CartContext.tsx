import { createContext, PropsWithChildren, useContext, useState } from "react";
import { CurrencyConfig } from "../../modules/StripeBackend/domain/models/output/Currencies";
import { Price } from "../../modules/StripeBackend/domain/models/output/Price";
import { Product } from "../../modules/StripeBackend/domain/models/output/Product";
import { CartItem } from "../../types/CartItem";

interface CartContextState {
  cartLineItems: CartItem[];
  addItem: (product: Product, price: Price, count: number) => void;
  updateQuantity: (product: Product, count: number) => void;
  removeCartLineItem: (product: Product) => void;
  currencyConfig: CurrencyConfig;
  totalAmount: number;
}

const currencyConfig = {
  symbol: "$",
  name: "US Dollar",
  symbolNative: "$",
  decimalDigits: 2,
  rounding: 0,
  code: "USD",
  namePlural: "US dollars",
} as CurrencyConfig;

const CartContext = createContext<CartContextState>({} as CartContextState);

export const CartContextProvider = ({ children }: PropsWithChildren) => {
  const [cartLineItems, setCartLineItems] = useState<CartItem[]>([]);

  const addItem = (product: Product, price: Price, count: number) => {
    const productInCart = cartLineItems.find(({ id }) => product.id === id);

    if (!productInCart) {
      setCartLineItems((prevState) => {
        return [
          ...prevState,
          {
            ...product,
            count,
            price,
          },
        ];
      });

      return;
    }

    setCartLineItems((prevState) => {
      return prevState.reduce((acc: CartItem[], curr) => {
        const currProduct =
          curr.id !== product.id
            ? curr
            : {
              ...curr,
              count: curr.count + count,
            };

        return [...acc, currProduct];
      }, [] as CartItem[]);
    });
  };

  const updateQuantity = (product: Product, count: number) => {
    setCartLineItems((prevState) => {
      return prevState.reduce((acc: CartItem[], curr) => {
        const currProduct =
          curr.id !== product.id
            ? curr
            : {
              ...curr,
              count,
            };

        return [...acc, currProduct];
      }, [] as CartItem[]);
    });
  };

  const removeCartLineItem = (product: Product) => {
    setCartLineItems((prevState) =>
      prevState.filter(({ id }) => product.id !== id),
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartLineItems,
        addItem,
        updateQuantity,
        removeCartLineItem,
        currencyConfig,
        totalAmount: cartLineItems.reduce((total, item) => {
          return total + item.price.unitAmount * item.count;
        }, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
