import {
  stripeDefaultPriceToPrice,
  stripePriceToPrice,
  stripeTaxCodeToString,
} from "./priceMapper";
import { Product } from "../../../domain/models/output/Product";
import { ProductDTO } from "../dto/ProductDTO";

export const stripeProductToProduct = (productDTO: ProductDTO): Product => {
  const prices = productDTO.prices.map(stripePriceToPrice);

  return {
    id: productDTO.id,
    active: productDTO.active,
    defaultPrice: stripeDefaultPriceToPrice(productDTO.default_price, prices),
    description: productDTO.description || "",
    images: productDTO.images,
    marketingFeatures: productDTO.marketing_features.map(({ name }) => name),
    metadata: productDTO.metadata,
    name: productDTO.name,
    taxCode: stripeTaxCodeToString(productDTO.tax_code),
    url: productDTO.url,
    prices: productDTO.prices.map(stripePriceToPrice),
  };
};
