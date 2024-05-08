import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetProductsListParams } from "../../modules/StripeBackend/domain/models/input/GetProductsListParams";
import { Product } from "../../modules/StripeBackend/domain/models/output/Product";
import { useCartContext } from "../../providers/Cart/CartContext";
import { useFirebaseAppContext } from "../../providers/FirebaseAppContext/FirebaseAppContext";

const ProductList = () => {
  const { searchProducts } = useFirebaseAppContext();
  const [productsListQueried, setProductsListQueried] =
    useState<boolean>(false);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const { addItem } = useCartContext();
  const navigate = useNavigate();

  const addToCart = (product: Product) => {
    addItem(product, product.defaultPrice, 1);
  };

  useEffect(() => {
    const getSpainProductsList = async () => {
      const queryParams: GetProductsListParams = {
        metadata: [
          {
            key: "type",
            value: "spain_store",
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
          Product list
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {Boolean(productsList.length) &&
            productsList.map((product) => (
              <div className="group relative" key={product.id}>
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    src={product.images[0]}
                    alt="Front of men&#039;s Basic Tee in black."
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>

                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>

                <p className="mt-1 text-sm text-gray-500">
                  {product.description}
                </p>

                <p className="mt-1 text-lg font-medium text-gray-900">
                  {Intl.NumberFormat(product.defaultPrice.currency.code, {
                    style: "currency",
                    currency: product.defaultPrice.currency.code,
                    maximumFractionDigits:
                      product.defaultPrice.currency.decimalDigits,
                    minimumFractionDigits:
                      product.defaultPrice.currency.decimalDigits,
                  }).format(product.defaultPrice.unitAmount / 100)}
                </p>

                <div>
                  <button
                    className={
                      "btn overflow-hidden relative w-64 bg-red-400 mr-4 text-white py-4 px-4 rounded-xl font-bold uppercase --"
                    }
                    onClick={() => addToCart(product)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
