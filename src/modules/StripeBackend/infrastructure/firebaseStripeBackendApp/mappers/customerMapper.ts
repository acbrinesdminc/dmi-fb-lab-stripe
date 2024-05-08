import { addressMapper, shippingAddressMapper } from "./addressMapper";
import { Customer } from "../../../domain/models/output/Customer";
import { CustomerDTO } from "../dto/CustomerDTO";

export const customerMapper = (customer: CustomerDTO): Customer => ({
  id: customer.id,
  address: customer.address !== null ? addressMapper(customer.address) : null,
  currency: customer.currency || null,
  email: customer.email || "",
  metadata: customer.metadata,
  name: customer.name || "",
  phone: customer.phone || "",
  preferredLocale: customer.preferred_locales?.length
    ? customer.preferred_locales[0]
    : "",
  shipping: shippingAddressMapper(customer.shipping),
});
