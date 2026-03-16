/**
 * BigCommerce Developer Documentation Knowledge Base
 * Comprehensive structured data covering the entire BC developer ecosystem.
 * Updated to reflect BigCommerce API v2/v3 as of 2025.
 */

export interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  version: "v2" | "v3";
  scope?: string;
  params?: Record<string, string>;
  body?: Record<string, string>;
  returns?: string;
  notes?: string;
}

export interface ApiCategory {
  name: string;
  slug: string;
  baseUrl: string;
  description: string;
  docsUrl: string;
  endpoints: Endpoint[];
}

export interface WebhookEvent {
  name: string;
  scope: string;
  description: string;
  payloadFields: string[];
  category: string;
}

export interface OAuthScope {
  name: string;
  uiName: string;
  readScope: string;
  writeScope: string;
  description: string;
}

export interface GraphQLApi {
  name: string;
  description: string;
  endpoint: string;
  authMethod: string;
  operations: { name: string; type: "query" | "mutation"; description: string }[];
}

// ─── REST API CATEGORIES ─────────────────────────────────────────────────────

export const API_CATEGORIES: ApiCategory[] = [
  {
    name: "Catalog",
    slug: "catalog",
    baseUrl: "/stores/{store_hash}/v3/catalog",
    description:
      "Manage products, categories, brands, bulk pricing, custom fields, metafields, product variants, options, modifiers, and more.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-catalog",
    endpoints: [
      { method: "GET",    path: "/products",                             version: "v3", scope: "store/products", description: "Get all products with extensive filtering by category, brand, price, date_modified, etc.", returns: "Paginated list of product objects" },
      { method: "POST",   path: "/products",                             version: "v3", scope: "store/products", description: "Create a new product. Supports bulk creation by passing an array.", body: { name: "string (required)", type: "physical|digital", price: "decimal (required)", weight: "decimal (required for physical)", sku: "string", categories: "array of category IDs", brand_id: "integer" }, returns: "Created product object" },
      { method: "GET",    path: "/products/{product_id}",                version: "v3", scope: "store/products", description: "Get a single product by ID. Use ?include= to embed variants, images, custom_fields, etc." },
      { method: "PUT",    path: "/products/{product_id}",                version: "v3", scope: "store/products", description: "Update a product. Only include fields you want to change." },
      { method: "DELETE", path: "/products/{product_id}",                version: "v3", scope: "store/products", description: "Delete a product by ID." },
      { method: "DELETE", path: "/products",                             version: "v3", scope: "store/products", description: "Bulk delete products. Pass ?id:in=1,2,3 query param.", notes: "Deletes are permanent and cascade to variants." },
      { method: "GET",    path: "/products/{product_id}/images",         version: "v3", scope: "store/products", description: "Get all images for a product." },
      { method: "POST",   path: "/products/{product_id}/images",         version: "v3", scope: "store/products", description: "Add an image to a product via image_url or file upload (multipart/form-data)." },
      { method: "GET",    path: "/products/{product_id}/variants",       version: "v3", scope: "store/products", description: "Get all variants for a product." },
      { method: "POST",   path: "/products/{product_id}/variants",       version: "v3", scope: "store/products", description: "Create a variant for a product." },
      { method: "PUT",    path: "/products/{product_id}/variants/{variant_id}", version: "v3", scope: "store/products", description: "Update a specific variant." },
      { method: "GET",    path: "/products/{product_id}/options",        version: "v3", scope: "store/products", description: "Get all options (e.g. Size, Color) for a product." },
      { method: "POST",   path: "/products/{product_id}/options",        version: "v3", scope: "store/products", description: "Create a new option on a product." },
      { method: "GET",    path: "/products/{product_id}/modifiers",      version: "v3", scope: "store/products", description: "Get product modifiers (add-ons that affect price or behavior)." },
      { method: "GET",    path: "/products/{product_id}/custom_fields",  version: "v3", scope: "store/products", description: "Get custom fields for a product." },
      { method: "GET",    path: "/products/{product_id}/metafields",     version: "v3", scope: "store/products/metafields", description: "Get metafields on a product. Metafields store extra info not visible by default." },
      { method: "POST",   path: "/products/{product_id}/metafields",     version: "v3", scope: "store/products/metafields", description: "Create a metafield on a product.", body: { namespace: "string (required)", key: "string (required)", value: "string (required)", permission_set: "read|write|read_and_sf_access|write_and_sf_access" } },
      { method: "GET",    path: "/products/{product_id}/bulk_pricing_rules", version: "v3", scope: "store/products", description: "Get bulk pricing rules (quantity discounts) for a product." },
      { method: "POST",   path: "/products/{product_id}/videos",         version: "v3", scope: "store/products", description: "Add a video (YouTube/Vimeo) to a product." },
      { method: "GET",    path: "/products/channel-assignments",         version: "v3", scope: "store/products/channel-assignments", description: "Get which channels products are assigned to (MSF)." },
      { method: "PUT",    path: "/products/channel-assignments",         version: "v3", scope: "store/products/channel-assignments", description: "Assign products to channels in bulk." },
      { method: "GET",    path: "/categories",                           version: "v3", scope: "store/products", description: "List all categories with tree and filter support." },
      { method: "POST",   path: "/categories",                           version: "v3", scope: "store/products", description: "Create a category.", body: { name: "string (required)", parent_id: "integer (0 = root)", tree_id: "integer" } },
      { method: "GET",    path: "/categories/tree",                      version: "v3", scope: "store/products", description: "Get the full category tree hierarchy." },
      { method: "GET",    path: "/categories/{category_id}",             version: "v3", scope: "store/products", description: "Get a single category." },
      { method: "PUT",    path: "/categories/{category_id}",             version: "v3", scope: "store/products", description: "Update a category." },
      { method: "GET",    path: "/brands",                               version: "v3", scope: "store/products", description: "Get all brands." },
      { method: "POST",   path: "/brands",                               version: "v3", scope: "store/products", description: "Create a brand." },
      { method: "GET",    path: "/summary",                              version: "v3", scope: "store/products", description: "Get a summary of catalog inventory: product count, variant count, etc." },
    ],
  },
  {
    name: "Orders",
    slug: "orders",
    baseUrl: "/stores/{store_hash}/v2/orders",
    description:
      "Full order lifecycle management including orders, order products, shipments, messages, taxes, coupons, and refunds.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-management/orders",
    endpoints: [
      { method: "GET",    path: "/orders",                               version: "v2", scope: "store/orders", description: "Get all orders. Filter by status, customer, date, channel, etc.", params: { status_id: "integer (0-14)", customer_id: "integer", min_date_created: "RFC-2822 date string", max_date_created: "RFC-2822 date string", channel_id: "integer", page: "integer", limit: "integer (max 250)" } },
      { method: "POST",   path: "/orders",                               version: "v2", scope: "store/orders", description: "Create an order manually. Useful for importing orders from external systems.", notes: "Use status_id 0 (Incomplete) or 1 (Pending) for new orders." },
      { method: "GET",    path: "/orders/{order_id}",                    version: "v2", scope: "store/orders", description: "Get a single order by ID with all details." },
      { method: "PUT",    path: "/orders/{order_id}",                    version: "v2", scope: "store/orders", description: "Update an order. Most commonly used to change status_id." },
      { method: "DELETE", path: "/orders/{order_id}",                    version: "v2", scope: "store/orders", description: "Archive (soft-delete) an order." },
      { method: "GET",    path: "/orders/{order_id}/products",           version: "v2", scope: "store/orders", description: "Get all line items (products) in an order." },
      { method: "GET",    path: "/orders/{order_id}/shippingaddresses",  version: "v2", scope: "store/orders", description: "Get shipping addresses for an order." },
      { method: "GET",    path: "/orders/{order_id}/shipments",          version: "v2", scope: "store/orders", description: "Get shipments created for an order." },
      { method: "POST",   path: "/orders/{order_id}/shipments",          version: "v2", scope: "store/orders", description: "Create a shipment for an order. Triggers shipped notification email.", body: { order_address_id: "integer (required)", tracking_number: "string", shipping_provider: "string (e.g. ups, fedex)", items: "array of { order_product_id, quantity }" } },
      { method: "GET",    path: "/orders/{order_id}/messages",           version: "v2", scope: "store/orders", description: "Get messages (customer/merchant notes) on an order." },
      { method: "GET",    path: "/orders/{order_id}/taxes",              version: "v2", scope: "store/orders", description: "Get tax details for an order." },
      { method: "GET",    path: "/orders/{order_id}/coupons",            version: "v2", scope: "store/orders", description: "Get coupons applied to an order." },
      { method: "POST",   path: "/orders/{order_id}/payment_actions/refund",    version: "v2", scope: "store/orders", description: "Issue a full or partial refund via the payment gateway." },
      { method: "POST",   path: "/orders/{order_id}/payment_actions/capture",   version: "v2", scope: "store/orders", description: "Capture a previously authorized payment." },
      { method: "GET",    path: "/order_statuses",                       version: "v2", scope: "store/orders", description: "Get all available order status definitions with their IDs and labels." },
      { method: "GET",    path: "/orders/count",                         version: "v2", scope: "store/orders", description: "Get total count of orders matching filter params." },
    ],
  },
  {
    name: "Customers",
    slug: "customers",
    baseUrl: "/stores/{store_hash}/v3/customers",
    description:
      "Manage customer accounts, addresses, form fields, attributes, and customer groups/segments.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-management/customers",
    endpoints: [
      { method: "GET",    path: "/customers",                            version: "v3", scope: "store/customers", description: "Get all customers. Filter by email, name, customer_group_id, date_created, etc." },
      { method: "POST",   path: "/customers",                            version: "v3", scope: "store/customers", description: "Create customers (batch supported, up to 10 at once).", body: { email: "string (required)", first_name: "string (required)", last_name: "string (required)", password: "string (min 7 chars)", customer_group_id: "integer", channel_ids: "array of integers" } },
      { method: "PUT",    path: "/customers",                            version: "v3", scope: "store/customers", description: "Batch update customers. Must include id." },
      { method: "DELETE", path: "/customers",                            version: "v3", scope: "store/customers", description: "Batch delete customers. Pass ?id:in=1,2,3." },
      { method: "GET",    path: "/customers/{customer_id}/addresses",    version: "v3", scope: "store/customers", description: "Get addresses for a specific customer." },
      { method: "GET",    path: "/customers/addresses",                  version: "v3", scope: "store/customers", description: "Get addresses across all customers with filtering." },
      { method: "POST",   path: "/customers/addresses",                  version: "v3", scope: "store/customers", description: "Create customer addresses in batch." },
      { method: "GET",    path: "/customers/attribute-values",           version: "v3", scope: "store/customers", description: "Get custom attribute values for customers." },
      { method: "PUT",    path: "/customers/attribute-values",           version: "v3", scope: "store/customers", description: "Upsert attribute values for customers." },
      { method: "GET",    path: "/customers/attributes",                 version: "v3", scope: "store/customers", description: "Get all custom customer attribute definitions." },
      { method: "GET",    path: "/customers/form-field-values",          version: "v3", scope: "store/customers", description: "Get values for customer account form fields." },
      { method: "GET",    path: "/customer-groups",                      version: "v2", scope: "store/customers", description: "Get all customer groups (v2). Used for segmentation and pricing." },
      { method: "POST",   path: "/customer-groups",                      version: "v2", scope: "store/customers", description: "Create a customer group.", body: { name: "string (required)", discount_relabel: "string", is_default: "boolean", category_access: "{ type: all|specific, categories: [] }" } },
      { method: "GET",    path: "/customers/segments",                   version: "v3", scope: "store/customers", description: "Get customer segments (v3). More advanced than groups." },
    ],
  },
  {
    name: "Cart",
    slug: "cart",
    baseUrl: "/stores/{store_hash}/v3/carts",
    description:
      "Server-side cart management. Create, read, update, delete carts, line items, and redirect URLs for checkout.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-storefront/carts",
    endpoints: [
      { method: "POST",   path: "/carts",                                version: "v3", scope: "store/cart", description: "Create a new cart with line items.", body: { line_items: "array of { quantity, product_id, variant_id? }", channel_id: "integer", customer_id: "integer (optional, 0 for guest)", currency: "{ code: 'USD' }" } },
      { method: "GET",    path: "/carts/{cart_id}",                      version: "v3", scope: "store/cart", description: "Get a cart by ID. Use ?include=redirect_urls to get checkout URLs." },
      { method: "PUT",    path: "/carts/{cart_id}",                      version: "v3", scope: "store/cart", description: "Update cart-level properties (customer_id, channel_id)." },
      { method: "DELETE", path: "/carts/{cart_id}",                      version: "v3", scope: "store/cart", description: "Delete a cart." },
      { method: "POST",   path: "/carts/{cart_id}/items",                version: "v3", scope: "store/cart", description: "Add line items to an existing cart." },
      { method: "PUT",    path: "/carts/{cart_id}/items/{item_id}",      version: "v3", scope: "store/cart", description: "Update a line item (quantity, etc)." },
      { method: "DELETE", path: "/carts/{cart_id}/items/{item_id}",      version: "v3", scope: "store/cart", description: "Remove a line item from a cart." },
      { method: "POST",   path: "/carts/{cart_id}/redirect_urls",        version: "v3", scope: "store/cart", description: "Generate checkout redirect URLs. Returns cart_url, checkout_url, embedded_checkout_url." },
      { method: "GET",    path: "/carts/{cart_id}/metafields",           version: "v3", scope: "store/cart", description: "Get metafields for a cart." },
      { method: "POST",   path: "/carts/{cart_id}/metafields",           version: "v3", scope: "store/cart", description: "Create a metafield on a cart for storing custom data." },
    ],
  },
  {
    name: "Checkouts",
    slug: "checkouts",
    baseUrl: "/stores/{store_hash}/v3/checkouts",
    description:
      "Manage the checkout process: addresses, shipping options, coupons, gift certificates, consignments, and order creation.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-storefront/checkouts",
    endpoints: [
      { method: "GET",    path: "/checkouts/{checkout_id}",              version: "v3", scope: "store/checkout", description: "Get the full checkout object including cart, consignments, and taxes." },
      { method: "PUT",    path: "/checkouts/{checkout_id}/billing-address",   version: "v3", scope: "store/checkout", description: "Add or update the billing address on a checkout." },
      { method: "POST",   path: "/checkouts/{checkout_id}/consignments",      version: "v3", scope: "store/checkout", description: "Add a consignment (shipping address + line items). Required before fetching shipping options.", body: { address: "object", line_items: "array of { item_id, quantity }", shipping_option_id: "string (optional)" } },
      { method: "PUT",    path: "/checkouts/{checkout_id}/consignments/{consignment_id}", version: "v3", scope: "store/checkout", description: "Update a consignment to assign a shipping option after calling GET shipping options." },
      { method: "GET",    path: "/checkouts/{checkout_id}/consignments/{consignment_id}/shipping-options", version: "v3", scope: "store/checkout", description: "Get available shipping options for a consignment. Must set address first." },
      { method: "POST",   path: "/checkouts/{checkout_id}/coupons",      version: "v3", scope: "store/checkout", description: "Apply a coupon code to checkout." },
      { method: "DELETE", path: "/checkouts/{checkout_id}/coupons/{coupon_code}", version: "v3", scope: "store/checkout", description: "Remove a coupon from checkout." },
      { method: "POST",   path: "/checkouts/{checkout_id}/gift-certificates", version: "v3", scope: "store/checkout", description: "Apply a gift certificate to checkout." },
      { method: "POST",   path: "/checkouts/{checkout_id}/orders",       version: "v3", scope: "store/checkout", description: "Create an order from a checkout. This is the final step in the checkout flow.", notes: "Returns order_id. Then use Payments API to capture payment." },
      { method: "GET",    path: "/checkouts/{checkout_id}/token",        version: "v3", scope: "store/checkout", description: "Get a one-time checkout token (for embedded checkout flows)." },
    ],
  },
  {
    name: "Channels",
    slug: "channels",
    baseUrl: "/stores/{store_hash}/v3/channels",
    description:
      "Multi-Storefront (MSF) channel management, site URLs, currency assignments, listing overrides, and channel-specific settings.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-management/channels",
    endpoints: [
      { method: "GET",    path: "/channels",                             version: "v3", scope: "store/channel_listings", description: "Get all channels (storefronts, marketplaces, POS, social, etc)." },
      { method: "POST",   path: "/channels",                             version: "v3", scope: "store/channel_listings", description: "Create a new channel.", body: { type: "storefront|marketplace|pos|marketing|social", platform: "string (e.g. bigcommerce, custom)", name: "string", status: "active|inactive|connected|disconnected" } },
      { method: "GET",    path: "/channels/{channel_id}",                version: "v3", scope: "store/channel_listings", description: "Get a single channel by ID." },
      { method: "PUT",    path: "/channels/{channel_id}",                version: "v3", scope: "store/channel_listings", description: "Update channel settings." },
      { method: "GET",    path: "/channels/{channel_id}/site",           version: "v3", scope: "store/sites", description: "Get the site (domain, SSL settings) for a channel." },
      { method: "POST",   path: "/channels/{channel_id}/site",           version: "v3", scope: "store/sites", description: "Create a site for a channel." },
      { method: "PUT",    path: "/channels/{channel_id}/site",           version: "v3", scope: "store/sites", description: "Update channel site URL/domain." },
      { method: "GET",    path: "/channels/{channel_id}/currency-assignments", version: "v3", scope: "store/channel_listings", description: "Get currencies assigned to a channel." },
      { method: "GET",    path: "/channels/{channel_id}/listings",       version: "v3", scope: "store/channel_listings", description: "Get channel listings (product/variant overrides per channel)." },
      { method: "POST",   path: "/channels/{channel_id}/listings",       version: "v3", scope: "store/channel_listings", description: "Create channel listings for product overrides on a specific channel." },
      { method: "GET",    path: "/channels/{channel_id}/menus",          version: "v3", scope: "store/channel_listings", description: "Get navigation menus for a channel." },
      { method: "GET",    path: "/channels/{channel_id}/active-theme",   version: "v3", scope: "store/themes", description: "Get the active theme configuration for a channel." },
    ],
  },
  {
    name: "Shipping",
    slug: "shipping",
    baseUrl: "/stores/{store_hash}/v2/shipping",
    description:
      "Shipping zones, methods, carriers, custom shipping quotes, and the Shipping V3 zones API.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-management/shipping-v2",
    endpoints: [
      { method: "GET",    path: "/shipping/zones",                       version: "v2", scope: "store/shipping", description: "Get all shipping zones." },
      { method: "POST",   path: "/shipping/zones",                       version: "v2", scope: "store/shipping", description: "Create a shipping zone.", body: { name: "string", type: "zip|country|state|global", locations: "array of country/state/zip objects" } },
      { method: "GET",    path: "/shipping/zones/{zone_id}/methods",     version: "v2", scope: "store/shipping", description: "Get shipping methods in a zone." },
      { method: "POST",   path: "/shipping/zones/{zone_id}/methods",     version: "v2", scope: "store/shipping", description: "Add a shipping method to a zone." },
      { method: "GET",    path: "/shipping/carriers",                    version: "v2", scope: "store/shipping", description: "List all shipping carrier connections." },
      { method: "POST",   path: "/shipping/carriers",                    version: "v2", scope: "store/shipping", description: "Connect a shipping carrier." },
    ],
  },
  {
    name: "Store Information",
    slug: "store-info",
    baseUrl: "/stores/{store_hash}/v2",
    description: "Store metadata, time zones, currencies, countries, and system-level settings.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-management/store-information",
    endpoints: [
      { method: "GET",    path: "/store",                                version: "v2", scope: "store/default", description: "Get store details: domain, plan, timezone, currency, weight/dimension units, etc." },
      { method: "GET",    path: "/currencies",                           version: "v2", scope: "store/currencies", description: "Get all currencies configured in the store." },
      { method: "POST",   path: "/currencies",                           version: "v2", scope: "store/currencies", description: "Add a currency to the store." },
      { method: "GET",    path: "/countries",                            version: "v2", scope: "store/default", description: "Get all countries BigCommerce supports." },
      { method: "GET",    path: "/countries/{country_id}/states",        version: "v2", scope: "store/default", description: "Get states/provinces for a country." },
      { method: "GET",    path: "/time",                                 version: "v2", scope: "store/default", description: "Get the current server time in Unix timestamp." },
    ],
  },
  {
    name: "Price Lists",
    slug: "pricelists",
    baseUrl: "/stores/{store_hash}/v3/pricelists",
    description:
      "Customer-group-level price lists with record-level pricing per variant and currency.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-management/price-lists",
    endpoints: [
      { method: "GET",    path: "/pricelists",                           version: "v3", scope: "store/pricelists", description: "Get all price lists." },
      { method: "POST",   path: "/pricelists",                           version: "v3", scope: "store/pricelists", description: "Create a price list.", body: { name: "string (required)", active: "boolean" } },
      { method: "GET",    path: "/pricelists/{price_list_id}/records",   version: "v3", scope: "store/pricelists", description: "Get all price records in a price list." },
      { method: "PUT",    path: "/pricelists/{price_list_id}/records",   version: "v3", scope: "store/pricelists", description: "Upsert price records. Batch-supported (up to 1000 records).", body: { variant_id: "integer (required)", currency: "string (required, e.g. USD)", price: "decimal", sale_price: "decimal", retail_price: "decimal", map_price: "decimal", bulk_pricing_tiers: "array" } },
      { method: "GET",    path: "/pricelists/assignments",               version: "v3", scope: "store/pricelists", description: "Get price list assignments to customer groups and channels." },
      { method: "PUT",    path: "/pricelists/assignments",               version: "v3", scope: "store/pricelists", description: "Assign price lists to customer groups and/or channels." },
    ],
  },
  {
    name: "Promotions & Coupons",
    slug: "promotions",
    baseUrl: "/stores/{store_hash}/v3/promotions",
    description: "Automatic promotions engine and legacy coupon codes.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-management/promotions",
    endpoints: [
      { method: "GET",    path: "/promotions",                           version: "v3", scope: "store/promotions", description: "Get all promotions (automatic discounts). Filter by status, channel, date." },
      { method: "POST",   path: "/promotions",                           version: "v3", scope: "store/promotions", description: "Create an automatic promotion with conditions and actions.", body: { name: "string (required)", redemption_type: "AUTOMATIC|COUPON", status: "ENABLED|DISABLED", conditions: "array of condition objects", actions: "array of action objects (discount type, amount)" } },
      { method: "GET",    path: "/promotions/{promotion_id}/codes",      version: "v3", scope: "store/promotions", description: "Get coupon codes for a promotion." },
      { method: "POST",   path: "/promotions/{promotion_id}/codes",      version: "v3", scope: "store/promotions", description: "Generate coupon codes for a promotion (bulk creation supported)." },
      { method: "GET",    path: "/coupons",                              version: "v2", scope: "store/marketing", description: "Get legacy coupons. Filter by code, type, date, enabled." },
      { method: "POST",   path: "/coupons",                              version: "v2", scope: "store/marketing", description: "Create a legacy coupon.", body: { name: "string", code: "string", type: "per_item_discount|percentage_discount|per_total_discount|shipping_discount|free_shipping|promotions", amount: "decimal", min_purchase: "decimal", max_uses: "integer", applies_to: "{ entity: categories|products, ids: [] }" } },
    ],
  },
  {
    name: "Inventory",
    slug: "inventory",
    baseUrl: "/stores/{store_hash}/v3/inventory",
    description:
      "Multi-location inventory management per SKU and location.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-management/inventory",
    endpoints: [
      { method: "GET",    path: "/inventory/items",                      version: "v3", scope: "store/inventory", description: "Get inventory levels across all locations. Filter by product/variant/location." },
      { method: "PUT",    path: "/inventory/adjustments/absolute",       version: "v3", scope: "store/inventory", description: "Set absolute inventory quantities for items/locations. Up to 2000 records.", body: { items: "array of { sku|variant_id|product_id, location_id, quantity }" } },
      { method: "PUT",    path: "/inventory/adjustments/relative",       version: "v3", scope: "store/inventory", description: "Adjust inventory by a relative amount (positive or negative).", body: { items: "array of { sku|variant_id|product_id, location_id, quantity (signed integer) }" } },
      { method: "GET",    path: "/inventory/locations",                  version: "v3", scope: "store/inventory", description: "Get all inventory locations." },
      { method: "POST",   path: "/inventory/locations",                  version: "v3", scope: "store/inventory", description: "Create an inventory location.", body: { label: "string (required)", code: "string", type_ids: "array of type IDs (warehouse, store, etc)", address: "object", operating_hours: "object" } },
    ],
  },
  {
    name: "Tax",
    slug: "tax",
    baseUrl: "/stores/{store_hash}/v3/tax",
    description: "Tax provider integrations and tax quote APIs.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-management/tax",
    endpoints: [
      { method: "GET",    path: "/tax/providers",                        version: "v3", scope: "store/information", description: "Get all available tax provider integrations." },
      { method: "PUT",    path: "/tax/providers/{provider_id}/connection", version: "v3", scope: "store/information", description: "Connect or update a tax provider (e.g. Avalara).", body: { username: "string", password: "string", test_mode: "boolean" } },
      { method: "POST",   path: "/tax/providers/{provider_id}/connection/test", version: "v3", scope: "store/information", description: "Test the connection to a tax provider." },
    ],
  },
  {
    name: "Payments",
    slug: "payments",
    baseUrl: "/stores/{store_hash}/v3/payments",
    description:
      "Payment processing: access tokens, stored instruments, order payment creation, and gateway management.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-payments",
    endpoints: [
      { method: "POST",   path: "/payments/access_tokens",               version: "v3", scope: "store/payments", description: "Create a payment access token for processing a payment for a specific order.", body: { order: "{ id: integer (required) }" }, notes: "Token expires in 30 minutes. Used in the Payment Processing API." },
      { method: "GET",    path: "/payments/methods",                     version: "v3", scope: "store/payments", description: "Get available payment methods for an order. Pass ?order_id=." },
      { method: "POST",   path: "https://payments.bigcommerce.com/stores/{store_hash}/payments", version: "v3", scope: "store/payments", description: "Process a payment. Different host than management API!", body: { payment: "{ instrument: { type: card|nonce, ... }, payment_method_id, amount (optional)" } },
      { method: "GET",    path: "/payments/stored-instruments",          version: "v3", scope: "store/payments_methods_read", description: "Get stored payment instruments for a customer." },
    ],
  },
  {
    name: "Webhooks",
    slug: "webhooks",
    baseUrl: "/stores/{store_hash}/v3/hooks",
    description: "Subscribe to store events and receive real-time HTTP POST notifications.",
    docsUrl: "https://developer.bigcommerce.com/docs/integrations/webhooks",
    endpoints: [
      { method: "GET",    path: "/hooks",                                version: "v3", scope: "store/default", description: "Get all webhook subscriptions for this store/app." },
      { method: "POST",   path: "/hooks",                                version: "v3", scope: "store/default", description: "Create a webhook subscription.", body: { scope: "string (e.g. store/order/created)", destination: "string (HTTPS URL, must return 200)", is_active: "boolean", headers: "object (optional custom headers sent with payloads)", events_history_enabled: "boolean" } },
      { method: "GET",    path: "/hooks/{hook_id}",                      version: "v3", scope: "store/default", description: "Get a webhook by ID." },
      { method: "PUT",    path: "/hooks/{hook_id}",                      version: "v3", scope: "store/default", description: "Update a webhook (destination, active status, headers)." },
      { method: "DELETE", path: "/hooks/{hook_id}",                      version: "v3", scope: "store/default", description: "Delete a webhook subscription." },
      { method: "GET",    path: "/hooks/{hook_id}/delivery_attempts",    version: "v3", scope: "store/default", description: "Get delivery history for a webhook (last 30 days, up to 10 recent attempts)." },
    ],
  },
  {
    name: "Scripts",
    slug: "scripts",
    baseUrl: "/stores/{store_hash}/v3/content/scripts",
    description: "Programmatically inject scripts into storefront pages (replaces Script Manager UI).",
    docsUrl: "https://developer.bigcommerce.com/docs/integrations/scripts",
    endpoints: [
      { method: "GET",    path: "/content/scripts",                      version: "v3", scope: "store/content/scripts", description: "Get all scripts injected by this app." },
      { method: "POST",   path: "/content/scripts",                      version: "v3", scope: "store/content/scripts", description: "Inject a script into storefront pages.", body: { name: "string (required)", kind: "src|script_tag", html: "string (inline script HTML)", src: "string (external JS URL)", auto_uninstall: "boolean", load_method: "default|async|defer", location: "head|footer", visibility: "storefront|all_pages|checkout|order_confirmation", channel_id: "integer", consent_category: "analytics|functional|targeting|essential" } },
      { method: "PUT",    path: "/content/scripts/{script_uuid}",        version: "v3", scope: "store/content/scripts", description: "Update an existing script." },
      { method: "DELETE", path: "/content/scripts/{script_uuid}",        version: "v3", scope: "store/content/scripts", description: "Remove a script." },
    ],
  },
  {
    name: "Themes",
    slug: "themes",
    baseUrl: "/stores/{store_hash}/v3/themes",
    description: "Theme management: upload, activate, download, and configure Stencil themes.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-management/themes",
    endpoints: [
      { method: "GET",    path: "/themes",                               version: "v3", scope: "store/themes", description: "Get all themes in the theme library." },
      { method: "POST",   path: "/themes",                               version: "v3", scope: "store/themes", description: "Upload a theme ZIP file via multipart/form-data." },
      { method: "GET",    path: "/themes/{theme_id}",                    version: "v3", scope: "store/themes", description: "Get metadata for a specific theme." },
      { method: "DELETE", path: "/themes/{theme_id}",                    version: "v3", scope: "store/themes", description: "Delete a theme." },
      { method: "POST",   path: "/themes/{theme_id}/actions/activate",   version: "v3", scope: "store/themes", description: "Activate a theme for the store or a specific channel.", body: { which: "original|last_activated|last_created", channel_id: "integer (for MSF)" } },
      { method: "GET",    path: "/themes/{theme_id}/download",           version: "v3", scope: "store/themes", description: "Get a download job ID for a theme." },
    ],
  },
  {
    name: "Settings",
    slug: "settings",
    baseUrl: "/stores/{store_hash}/v3/settings",
    description: "Store-wide and channel-specific settings: storefront, catalog, search, analytics, and more.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-management/settings",
    endpoints: [
      { method: "GET",    path: "/settings/store",                       version: "v3", scope: "store/information", description: "Get general store settings." },
      { method: "PUT",    path: "/settings/store",                       version: "v3", scope: "store/information", description: "Update general store settings." },
      { method: "GET",    path: "/settings/storefront",                  version: "v3", scope: "store/information", description: "Get storefront settings (SEO, display preferences)." },
      { method: "GET",    path: "/settings/search/filters",              version: "v3", scope: "store/information", description: "Get product search/filter settings." },
      { method: "GET",    path: "/settings/analytics",                   version: "v3", scope: "store/information", description: "Get configured analytics providers." },
      { method: "GET",    path: "/settings/logo",                        version: "v3", scope: "store/information", description: "Get logo configuration." },
      { method: "GET",    path: "/settings/SEO",                         version: "v3", scope: "store/information", description: "Get SEO settings." },
    ],
  },
  {
    name: "Pages & Redirects",
    slug: "pages",
    baseUrl: "/stores/{store_hash}/v3/content",
    description: "Manage CMS pages, blog posts, redirects, and banners.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-content",
    endpoints: [
      { method: "GET",    path: "/content/pages",                        version: "v3", scope: "store/content", description: "Get all storefront pages." },
      { method: "POST",   path: "/content/pages",                        version: "v3", scope: "store/content", description: "Create a page.", body: { name: "string (required)", type: "page|raw|contact_form|feed|link|blog", body: "string (HTML content)", is_visible: "boolean", channel_id: "integer" } },
      { method: "GET",    path: "/content/redirects",                    version: "v3", scope: "store/content", description: "Get URL redirects. Supports 301/302 types." },
      { method: "PUT",    path: "/content/redirects",                    version: "v3", scope: "store/content", description: "Upsert URL redirects in bulk.", body: { from_path: "string", site_id: "integer", to: "{ type: product|category|brand|page|post|url, entity_id|url: ... }" } },
    ],
  },
  {
    name: "Subscribers",
    slug: "subscribers",
    baseUrl: "/stores/{store_hash}/v3/customers/subscribers",
    description: "Manage newsletter/marketing subscriber lists.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-management/subscribers",
    endpoints: [
      { method: "GET",    path: "/customers/subscribers",                version: "v3", scope: "store/customers", description: "Get all subscribers. Filter by email, first_name, source, date." },
      { method: "POST",   path: "/customers/subscribers",                version: "v3", scope: "store/customers", description: "Create a subscriber.", body: { email: "string (required)", first_name: "string", last_name: "string", source: "string", channel_id: "integer" } },
      { method: "DELETE", path: "/customers/subscribers",                version: "v3", scope: "store/customers", description: "Delete subscribers by IDs." },
    ],
  },
  {
    name: "Gift Certificates",
    slug: "gift-certificates",
    baseUrl: "/stores/{store_hash}/v2/gift_certificates",
    description: "Manage gift certificate codes, balances, and redemption.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-management/marketing",
    endpoints: [
      { method: "GET",    path: "/gift_certificates",                    version: "v2", scope: "store/marketing", description: "Get all gift certificates." },
      { method: "POST",   path: "/gift_certificates",                    version: "v2", scope: "store/marketing", description: "Create a gift certificate.", body: { code: "string (auto-generated if omitted)", amount: "decimal (required)", balance: "decimal", to_name: "string", to_email: "string", template: "string (email template)" } },
      { method: "GET",    path: "/gift_certificates/{id}",               version: "v2", scope: "store/marketing", description: "Get a specific gift certificate." },
      { method: "PUT",    path: "/gift_certificates/{id}",               version: "v2", scope: "store/marketing", description: "Update balance or status of a gift certificate." },
    ],
  },
  {
    name: "Wishlists",
    slug: "wishlists",
    baseUrl: "/stores/{store_hash}/v3/wishlists",
    description: "Customer wishlists CRUD operations.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-management/wishlists",
    endpoints: [
      { method: "GET",    path: "/wishlists",                            version: "v3", scope: "store/wishlists", description: "Get all wishlists. Filter by customer_id, page, limit." },
      { method: "POST",   path: "/wishlists",                            version: "v3", scope: "store/wishlists", description: "Create a wishlist.", body: { name: "string (required)", customer_id: "integer (required)", is_public: "boolean", items: "array of { product_id, variant_id }" } },
      { method: "GET",    path: "/wishlists/{wishlist_id}",              version: "v3", scope: "store/wishlists", description: "Get a wishlist by ID." },
      { method: "PUT",    path: "/wishlists/{wishlist_id}",              version: "v3", scope: "store/wishlists", description: "Update wishlist name or visibility." },
      { method: "POST",   path: "/wishlists/{wishlist_id}/items",        version: "v3", scope: "store/wishlists", description: "Add items to a wishlist." },
      { method: "DELETE", path: "/wishlists/{wishlist_id}/items/{item_id}", version: "v3", scope: "store/wishlists", description: "Remove an item from a wishlist." },
    ],
  },
  {
    name: "Reviews",
    slug: "reviews",
    baseUrl: "/stores/{store_hash}/v3/catalog/products/{product_id}/reviews",
    description: "Manage product reviews: create, moderate, respond.",
    docsUrl: "https://developer.bigcommerce.com/docs/rest-catalog/products/reviews",
    endpoints: [
      { method: "GET",    path: "/products/{product_id}/reviews",        version: "v3", scope: "store/products", description: "Get reviews for a product. Filter by status (0=pending, 1=approved, 2=disapproved)." },
      { method: "POST",   path: "/products/{product_id}/reviews",        version: "v3", scope: "store/products", description: "Create a review.", body: { title: "string (required)", text: "string", status: "0|1|2", rating: "1-5 integer", email: "string", name: "string", date_reviewed: "ISO 8601 date" } },
      { method: "PUT",    path: "/products/{product_id}/reviews/{review_id}", version: "v3", scope: "store/products", description: "Update a review (e.g. approve/disapprove)." },
      { method: "DELETE", path: "/products/{product_id}/reviews/{review_id}", version: "v3", scope: "store/products", description: "Delete a review." },
    ],
  },
];

// ─── WEBHOOK EVENTS ──────────────────────────────────────────────────────────

export const WEBHOOK_EVENTS: WebhookEvent[] = [
  // Orders
  { name: "store/order/created",              category: "Orders",    scope: "store/order/created",              description: "New order placed", payloadFields: ["store_id", "producer", "scope", "data.type", "data.id"] },
  { name: "store/order/updated",              category: "Orders",    scope: "store/order/updated",              description: "Order updated (status, fields)", payloadFields: ["store_id", "producer", "scope", "data.type", "data.id"] },
  { name: "store/order/archived",             category: "Orders",    scope: "store/order/archived",             description: "Order archived", payloadFields: ["store_id", "producer", "data.id"] },
  { name: "store/order/statusUpdated",        category: "Orders",    scope: "store/order/statusUpdated",        description: "Order status changed", payloadFields: ["store_id", "data.type", "data.id"] },
  { name: "store/order/message/created",      category: "Orders",    scope: "store/order/message/created",      description: "Order message created", payloadFields: ["store_id", "data.type", "data.id"] },
  { name: "store/order/refund/created",       category: "Orders",    scope: "store/order/refund/created",       description: "Refund created on order", payloadFields: ["store_id", "data.type", "data.id", "data.refund_id"] },
  { name: "store/order/transaction/created",  category: "Orders",    scope: "store/order/transaction/created",  description: "Transaction created on order", payloadFields: ["store_id", "data.order_id", "data.transaction_id"] },
  { name: "store/order/transaction/updated",  category: "Orders",    scope: "store/order/transaction/updated",  description: "Transaction updated on order", payloadFields: ["store_id", "data.order_id", "data.transaction_id"] },
  // Products
  { name: "store/product/created",            category: "Products",  scope: "store/product/created",            description: "Product created", payloadFields: ["store_id", "data.type", "data.id"] },
  { name: "store/product/updated",            category: "Products",  scope: "store/product/updated",            description: "Product updated", payloadFields: ["store_id", "data.type", "data.id"] },
  { name: "store/product/deleted",            category: "Products",  scope: "store/product/deleted",            description: "Product deleted", payloadFields: ["store_id", "data.type", "data.id"] },
  { name: "store/product/inventory/updated",  category: "Products",  scope: "store/product/inventory/updated",  description: "Product inventory changed", payloadFields: ["store_id", "data.type", "data.id", "data.inventory.product_id", "data.inventory.method", "data.inventory.value"] },
  { name: "store/product/inventory/order/updated", category: "Products", scope: "store/product/inventory/order/updated", description: "Inventory updated due to order", payloadFields: ["store_id", "data.type", "data.id"] },
  // Cart
  { name: "store/cart/created",               category: "Cart",      scope: "store/cart/created",               description: "Cart created", payloadFields: ["store_id", "data.type", "data.id"] },
  { name: "store/cart/updated",               category: "Cart",      scope: "store/cart/updated",               description: "Cart updated", payloadFields: ["store_id", "data.type", "data.id"] },
  { name: "store/cart/deleted",               category: "Cart",      scope: "store/cart/deleted",               description: "Cart deleted (e.g. after order placed)", payloadFields: ["store_id", "data.type", "data.id"] },
  { name: "store/cart/lineItem/created",      category: "Cart",      scope: "store/cart/lineItem/created",      description: "Item added to cart", payloadFields: ["store_id", "data.type", "data.id", "data.itemId"] },
  { name: "store/cart/lineItem/updated",      category: "Cart",      scope: "store/cart/lineItem/updated",      description: "Cart line item updated", payloadFields: ["store_id", "data.type", "data.id", "data.itemId"] },
  { name: "store/cart/lineItem/deleted",      category: "Cart",      scope: "store/cart/lineItem/deleted",      description: "Item removed from cart", payloadFields: ["store_id", "data.type", "data.id", "data.itemId"] },
  { name: "store/cart/converted",             category: "Cart",      scope: "store/cart/converted",             description: "Cart converted to order", payloadFields: ["store_id", "data.type", "data.id", "data.orderId", "data.customerId"] },
  { name: "store/cart/couponApplied",         category: "Cart",      scope: "store/cart/couponApplied",         description: "Coupon applied to cart", payloadFields: ["store_id", "data.type", "data.id", "data.couponId"] },
  // Customers
  { name: "store/customer/created",           category: "Customers", scope: "store/customer/created",           description: "Customer account created", payloadFields: ["store_id", "data.type", "data.id"] },
  { name: "store/customer/updated",           category: "Customers", scope: "store/customer/updated",           description: "Customer account updated", payloadFields: ["store_id", "data.type", "data.id"] },
  { name: "store/customer/deleted",           category: "Customers", scope: "store/customer/deleted",           description: "Customer account deleted", payloadFields: ["store_id", "data.type", "data.id"] },
  { name: "store/customer/address/created",   category: "Customers", scope: "store/customer/address/created",   description: "Customer address added", payloadFields: ["store_id", "data.type", "data.id", "data.address.customer_id"] },
  { name: "store/customer/address/updated",   category: "Customers", scope: "store/customer/address/updated",   description: "Customer address updated", payloadFields: ["store_id", "data.type", "data.id"] },
  { name: "store/customer/address/deleted",   category: "Customers", scope: "store/customer/address/deleted",   description: "Customer address deleted", payloadFields: ["store_id", "data.type", "data.id"] },
  { name: "store/customer/payment/instrument/default/updated", category: "Customers", scope: "store/customer/payment/instrument/default/updated", description: "Customer default payment instrument changed", payloadFields: ["store_id", "data.type", "data.id"] },
  // Channels / Sites
  { name: "store/channel/created",            category: "Channels",  scope: "store/channel/created",            description: "Channel created", payloadFields: ["store_id", "data.type", "data.id"] },
  { name: "store/channel/updated",            category: "Channels",  scope: "store/channel/updated",            description: "Channel updated", payloadFields: ["store_id", "data.type", "data.id"] },
  // Inventory
  { name: "store/inventory/location/updated", category: "Inventory", scope: "store/inventory/location/updated", description: "Inventory at a specific location updated", payloadFields: ["store_id", "data.type", "data.id"] },
  // Shipments
  { name: "store/shipment/created",           category: "Shipment",  scope: "store/shipment/created",           description: "Shipment created", payloadFields: ["store_id", "data.type", "data.id", "data.orderId"] },
  { name: "store/shipment/updated",           category: "Shipment",  scope: "store/shipment/updated",           description: "Shipment updated", payloadFields: ["store_id", "data.type", "data.id", "data.orderId"] },
  { name: "store/shipment/deleted",           category: "Shipment",  scope: "store/shipment/deleted",           description: "Shipment deleted", payloadFields: ["store_id", "data.type", "data.id", "data.orderId"] },
  // Store
  { name: "store/app/uninstalled",            category: "Store",     scope: "store/app/uninstalled",            description: "App uninstalled from store — clean up data!", payloadFields: ["store_id", "producer", "scope"] },
  { name: "store/information/updated",        category: "Store",     scope: "store/information/updated",        description: "Store settings updated", payloadFields: ["store_id", "producer", "scope"] },
  // Category
  { name: "store/category/created",           category: "Catalog",   scope: "store/category/created",           description: "Category created", payloadFields: ["store_id", "data.type", "data.id"] },
  { name: "store/category/updated",           category: "Catalog",   scope: "store/category/updated",           description: "Category updated", payloadFields: ["store_id", "data.type", "data.id"] },
  { name: "store/category/deleted",           category: "Catalog",   scope: "store/category/deleted",           description: "Category deleted", payloadFields: ["store_id", "data.type", "data.id"] },
  // SKU / Variant
  { name: "store/sku/created",                category: "Catalog",   scope: "store/sku/created",                description: "Product SKU/variant created", payloadFields: ["store_id", "data.type", "data.id"] },
  { name: "store/sku/updated",                category: "Catalog",   scope: "store/sku/updated",                description: "Product SKU/variant updated", payloadFields: ["store_id", "data.type", "data.id"] },
  { name: "store/sku/deleted",                category: "Catalog",   scope: "store/sku/deleted",                description: "Product SKU/variant deleted", payloadFields: ["store_id", "data.type", "data.id"] },
];

// ─── OAUTH SCOPES ─────────────────────────────────────────────────────────────

export const OAUTH_SCOPES: OAuthScope[] = [
  { name: "products",       uiName: "Products",          readScope: "store/products/read-only",     writeScope: "store/products",     description: "Manage products, variants, options, modifiers, custom fields, and metafields" },
  { name: "orders",         uiName: "Orders",            readScope: "store/orders/read-only",       writeScope: "store/orders",       description: "Manage orders, shipments, messages, and refunds" },
  { name: "customers",      uiName: "Customers",         readScope: "store/customers/read-only",    writeScope: "store/customers",    description: "Manage customers, addresses, and form field values" },
  { name: "cart",           uiName: "Cart",              readScope: "store/cart/read-only",         writeScope: "store/cart",         description: "Manage server-side cart operations" },
  { name: "checkouts",      uiName: "Checkouts",         readScope: "store/checkout/read-only",     writeScope: "store/checkout",     description: "Manage checkout flow, consignments, and payment processing" },
  { name: "content",        uiName: "Content",           readScope: "store/content/read-only",      writeScope: "store/content",      description: "Manage pages, blog posts, redirects, and banners" },
  { name: "marketing",      uiName: "Marketing",         readScope: "store/marketing/read-only",    writeScope: "store/marketing",    description: "Manage coupons, gift certificates, and banners" },
  { name: "payments",       uiName: "Checkout Payment Methods", readScope: "store/payments_methods_read", writeScope: "store/payments", description: "Create payment tokens, stored instruments, and process payments" },
  { name: "shipping",       uiName: "Shipping",          readScope: "store/shipping/read-only",     writeScope: "store/shipping",     description: "Manage shipping zones, methods, and carriers" },
  { name: "store_info",     uiName: "Store Information", readScope: "store/information/read-only",  writeScope: "store/information",  description: "Read and update general store settings and information" },
  { name: "sites",          uiName: "Sites & Routes",    readScope: "store/sites/read-only",        writeScope: "store/sites",        description: "Manage channels, sites, and domain routing" },
  { name: "channel_listings", uiName: "Channel Listings", readScope: "store/channel_listings/read-only", writeScope: "store/channel_listings", description: "Manage product listings and assignments on channels" },
  { name: "themes",         uiName: "Themes",            readScope: "store/themes/read-only",       writeScope: "store/themes",       description: "Upload, activate, and manage Stencil themes" },
  { name: "scripts",        uiName: "Scripts",           readScope: "store/content/scripts/read-only", writeScope: "store/content/scripts", description: "Inject and manage JavaScript on storefront pages" },
  { name: "pricelists",     uiName: "Price Lists",       readScope: "store/pricelists/read-only",   writeScope: "store/pricelists",   description: "Manage customer-group price lists and records" },
  { name: "inventory",      uiName: "Inventory",         readScope: "store/inventory/read-only",    writeScope: "store/inventory",    description: "Manage multi-location inventory levels and adjustments" },
  { name: "wishlists",      uiName: "Wishlists",         readScope: "store/wishlists/read-only",    writeScope: "store/wishlists",    description: "Manage customer wishlists" },
  { name: "promotions",     uiName: "Promotions",        readScope: "store/promotions/read-only",   writeScope: "store/promotions",   description: "Manage automatic promotions and coupon codes" },
  { name: "product_metafields", uiName: "Product Metafields", readScope: "store/products/metafields/read-only", writeScope: "store/products/metafields", description: "Manage product-level metafields" },
  { name: "customer_login", uiName: "Customer Login",    readScope: "",                              writeScope: "store/customer_login", description: "Sign customers in with a JWT (Customer Login API)" },
  { name: "current_customer", uiName: "Current Customer", readScope: "store/current_customer",     writeScope: "",                   description: "Identify the currently signed-in customer (client-side)" },
];

// ─── GRAPHQL APIS ────────────────────────────────────────────────────────────

export const GRAPHQL_APIS: GraphQLApi[] = [
  {
    name: "GraphQL Storefront API",
    description: "Query and mutate storefront data from the browser or a headless frontend. No server-side secret needed—use a channel token. Ideal for SSR/SSG with Catalyst or custom headless builds.",
    endpoint: "https://store-{store_hash}.mybigcommerce.com/graphql OR https://{storefront_domain}/graphql",
    authMethod: "Bearer token (channel API token, generated via REST or customer JWT for personalized data)",
    operations: [
      { name: "route", type: "query", description: "Resolve a URL path to its entity (product, category, page). Core for headless routing." },
      { name: "site.products", type: "query", description: "Fetch products with filtering, cursor pagination, and nested data (images, variants, prices)" },
      { name: "site.product", type: "query", description: "Fetch a single product by entityId, path, or SKU" },
      { name: "site.category", type: "query", description: "Fetch a category and its product connection with filters" },
      { name: "site.categories", type: "query", description: "Fetch the full category tree" },
      { name: "site.brands", type: "query", description: "Fetch brands" },
      { name: "site.content.pages", type: "query", description: "Fetch CMS pages" },
      { name: "customer", type: "query", description: "Fetch the currently authenticated customer (requires customer JWT)" },
      { name: "cart", type: "query", description: "Fetch current cart by entity ID with line items and prices" },
      { name: "addCartLineItems", type: "mutation", description: "Add items to a cart" },
      { name: "updateCartLineItem", type: "mutation", description: "Update line item quantity/options in cart" },
      { name: "deleteCartLineItem", type: "mutation", description: "Remove a line item from cart" },
      { name: "createCart", type: "mutation", description: "Create a new cart with initial line items" },
      { name: "deleteCart", type: "mutation", description: "Delete a cart" },
      { name: "applyCheckoutCoupon", type: "mutation", description: "Apply a coupon code during checkout" },
      { name: "selectCheckoutShippingOption", type: "mutation", description: "Select a shipping option on a consignment" },
      { name: "submitCheckout", type: "mutation", description: "Submit checkout to create an order" },
      { name: "loginCustomer", type: "mutation", description: "Authenticate a customer with email/password, returning a customer access token" },
      { name: "logoutCustomer", type: "mutation", description: "Log out the current customer" },
    ],
  },
  {
    name: "GraphQL Admin API",
    description: "Perform store management operations via GraphQL instead of REST. Manages users, control panel access, and some admin-specific mutations. Beta/growing surface area.",
    endpoint: "https://api.bigcommerce.com/stores/{store_hash}/graphql",
    authMethod: "X-Auth-Token header with store-level or app-level access token",
    operations: [
      { name: "admin.users", type: "query", description: "List control panel users" },
      { name: "admin.user", type: "query", description: "Get a specific control panel user" },
      { name: "createUser", type: "mutation", description: "Create a control panel user" },
      { name: "updateUser", type: "mutation", description: "Update a control panel user" },
      { name: "deleteUser", type: "mutation", description: "Delete a control panel user" },
      { name: "updateB2BEUserOrdersCompany", type: "mutation", description: "Update B2B Buyer Portal user company attribute on orders" },
    ],
  },
  {
    name: "GraphQL Account API",
    description: "Account-level operations spanning multiple stores. Manages store creation, account users, and cross-store resources. Requires account-level API credentials.",
    endpoint: "https://api.bigcommerce.com/accounts/{account_uuid}/graphql",
    authMethod: "X-Auth-Token with account-level access token (created in account control panel)",
    operations: [
      { name: "stores", type: "query", description: "List all stores under an account" },
      { name: "store", type: "query", description: "Get details for a specific store" },
      { name: "users", type: "query", description: "List account-level users" },
      { name: "createUser", type: "mutation", description: "Create an account-level user" },
      { name: "assignUserToStore", type: "mutation", description: "Assign a user to a store with a specific role" },
    ],
  },
];

// ─── AUTHENTICATION PATTERNS ──────────────────────────────────────────────────

export const AUTH_PATTERNS = {
  restManagement: {
    name: "REST Management API Auth",
    method: "Header: X-Auth-Token: {access_token}",
    description: "All REST Management API requests require the X-Auth-Token header with a store-level or app-level access token.",
    example: `GET https://api.bigcommerce.com/stores/{store_hash}/v3/catalog/products
X-Auth-Token: {your_access_token}
Content-Type: application/json
Accept: application/json`,
    notes: [
      "Never send X-Auth-Token in client-side code — it exposes your secret",
      "For app-level tokens, use the OAuth grant code flow to obtain access_token",
      "Store hash is visible in the BC control panel URL: /manage/dashboard/{store_hash}",
    ],
  },
  storefrontGraphQL: {
    name: "GraphQL Storefront API Auth",
    method: "Header: Authorization: Bearer {channel_token}",
    description: "Storefront GraphQL uses short-lived channel tokens. Create them server-side via the REST API then pass to client.",
    tokenCreation: `POST /stores/{store_hash}/v3/storefront/api-token
X-Auth-Token: {access_token}
{
  "channel_id": 1,
  "expires_at": 1893456000,
  "allowed_cors_origins": ["https://your-storefront.com"]
}`,
    notes: [
      "Tokens are store/channel scoped and support CORS",
      "For customer-specific data, use customer tokens (Customer Login API JWT)",
      "Do not use store management tokens for the storefront API",
    ],
  },
  customerLogin: {
    name: "Customer Login API (SSO)",
    method: "JWT signed with client_secret",
    description: "Sign customers into a BC storefront programmatically using a signed JWT. Redirect to /login/token/{jwt}.",
    jwtPayload: `{
  "iss": "{client_id}",
  "iat": {unix_timestamp},
  "jti": "{unique_uuid}",
  "operation": "customer_login",
  "store_hash": "{store_hash}",
  "customer_id": {customer_id},
  "channel_id": 1,
  "redirect_to": "/account.php"
}`,
    algorithm: "HS256, signed with client_secret",
    expiresIn: "30 seconds",
    notes: [
      "jti must be unique per request (UUID v4 recommended)",
      "Token expires in 30 seconds — generate on demand, never cache",
      "Append ?nav_type=storefront for headless redirect",
    ],
  },
  oauthFlow: {
    name: "OAuth App Auth Flow",
    description: "Standard OAuth 2.0 grant code flow for apps listed on the BC App Marketplace.",
    steps: [
      "1. App installed: BC posts a grant code to your /auth callback URL",
      "2. Exchange grant code for access_token at https://login.bigcommerce.com/oauth2/token",
      "3. Store access_token and store_hash securely (per-store)",
      "4. Use access_token in X-Auth-Token header for all subsequent requests",
      "5. Handle /load callback (retrieve stored token by store_hash)",
      "6. Handle /uninstall callback (delete stored token, clean up data)",
    ],
    tokenEndpoint: "POST https://login.bigcommerce.com/oauth2/token",
    tokenBody: `{
  "client_id": "{app_client_id}",
  "client_secret": "{app_client_secret}",
  "code": "{grant_code_from_bc}",
  "scope": "{requested_scopes}",
  "grant_type": "authorization_code",
  "redirect_uri": "{your_auth_callback_url}",
  "context": "{context_from_bc}"
}`,
  },
};

// ─── RATE LIMITS ─────────────────────────────────────────────────────────────

export const RATE_LIMITS = {
  description: "BigCommerce uses a leaky bucket algorithm. The store plan determines the bucket size (request window).",
  headers: {
    "X-Rate-Limit-Requests-Left": "Requests remaining in the current window",
    "X-Rate-Limit-Requests-Quota": "Maximum requests allowed in the window",
    "X-Rate-Limit-Time-Reset-Ms": "Milliseconds until the window resets",
    "X-Rate-Limit-Time-Window-Ms": "Duration of the rate limit window in ms",
  },
  handling: `// Robust rate limit handling
async function bcRequest(url, options) {
  const response = await fetch(url, options);
  
  if (response.status === 429) {
    const resetMs = parseInt(response.headers.get('X-Rate-Limit-Time-Reset-Ms') || '5000');
    await new Promise(resolve => setTimeout(resolve, resetMs + 100));
    return bcRequest(url, options); // Retry after window resets
  }
  
  return response;
}`,
  tips: [
    "Use bulk endpoints (batch create/update/delete) to minimize request count",
    "Implement exponential backoff for 429 responses",
    "Cache GET responses where data is unlikely to change frequently",
    "Use webhooks instead of polling to avoid unnecessary reads",
    "Thread reads and writes carefully — parallel requests exhaust the bucket faster",
  ],
};

// ─── BEST PRACTICES ───────────────────────────────────────────────────────────

export const BEST_PRACTICES: Record<string, string[]> = {
  general: [
    "Always use v3 APIs over v2 when available — v3 is more consistent and performant",
    "Use ?include= query params to embed related objects and avoid N+1 requests",
    "Implement idempotency via request deduplication for POST operations",
    "Never expose X-Auth-Token in client-side JavaScript",
    "Use X-Correlation-Id header to group related requests for debugging",
    "Respect the Content-Type and Accept headers — always application/json",
    "Handle both camelCase (GraphQL) and snake_case (REST) field naming conventions",
  ],
  pagination: [
    "REST APIs use offset pagination: ?page=1&limit=250 (max limit varies by endpoint)",
    "GraphQL Storefront API uses cursor pagination — use pageInfo.endCursor and hasNextPage",
    "For large catalog exports, iterate pages until meta.pagination.total_pages is reached",
    "The maximum limit for most REST v3 endpoints is 250 records per request",
    "For batch operations on large datasets, process in chunks of 100-250 records",
  ],
  webhooks: [
    "Always respond with HTTP 200 within 10 seconds or BC will retry",
    "Process webhook payloads asynchronously (queue them, respond 200 immediately)",
    "Webhooks deliver minimal payloads — fetch full details via REST API after receiving",
    "BC retries failed webhooks with exponential backoff — make handlers idempotent",
    "Inactive webhooks (no successful delivery for 7 days) are automatically disabled",
    "Use events_history_enabled: true to replay missed events via delivery_attempts endpoint",
    "Validate the webhook signature if you set a shared secret (HMAC-SHA256)",
  ],
  apps: [
    "Implement all three callbacks: /auth, /load, /uninstall",
    "Store tokens by store_hash — multiple stores can install the same app",
    "Use the /uninstall hook to delete stored tokens and data for GDPR compliance",
    "Test with the BC sandbox environment before submitting to the App Marketplace",
    "Implement proper OAuth CSRF protection with the state parameter",
    "Request minimum required OAuth scopes — follow the principle of least privilege",
  ],
  headless: [
    "Use the GraphQL Storefront API for all data fetching — it supports SSR/SSG perfectly",
    "Generate Storefront API tokens server-side and inject into client as environment variables",
    "The `route` query is essential for universal URL routing in headless builds",
    "Use Catalyst (Next.js-based headless reference) as your starting point",
    "Product prices require a channel token with the correct channel_id for accurate pricing",
    "Customer-specific pricing requires a customer access token (post-login JWT)",
  ],
  performance: [
    "Use CDN-cacheable GraphQL queries with GET method and persisted query hashes",
    "Prefer bulk APIs over individual record APIs for importing/syncing large datasets",
    "Stale-While-Revalidate patterns work well for product catalog pages",
    "For inventory-heavy apps, subscribe to inventory webhook instead of polling",
    "Use parallel fetching for unrelated data, but respect rate limits",
  ],
};

// ─── STENCIL / STOREFRONT ─────────────────────────────────────────────────────

export const STOREFRONT_DOCS = {
  stencil: {
    description: "BigCommerce's native theme engine. Handlebars templating, SCSS, JS/jQuery, and a CLI for local development.",
    cliSetup: `npm install -g @bigcommerce/stencil-cli
stencil init        # configure API credentials
stencil start       # hot-reload local dev server at https://localhost:3000
stencil bundle      # package theme for upload
stencil push        # upload and optionally activate`,
    templateLocations: {
      pages: "templates/pages/*.html",
      partials: "templates/components/*.html",
      layouts: "templates/layout/*.html",
    },
    keyObjects: [
      "{{product}} — product data on PDP",
      "{{category}} — category data on CLP",
      "{{cart}} — cart data (requires cart page or AJAX)",
      "{{customer}} — logged-in customer data",
      "{{settings}} — store settings",
      "{{theme_settings}} — custom theme settings (config/settings_schema.json)",
    ],
    jsApi: [
      "window.BCData.product_attributes — variant option/attribute data",
      "utils.api.cart.itemAdd(productId, optionSelections) — add to cart",
      "utils.api.product.getById(id, {template}) — get product HTML fragment",
      "$(window).on('cart-quantity-update', callback) — cart update events",
    ],
  },
  catalyst: {
    description: "BigCommerce's official Next.js-based headless starter kit. Built on App Router, Tailwind, and the GraphQL Storefront API.",
    repoUrl: "https://github.com/bigcommerce/catalyst",
    setup: `npx create-catalyst-app@latest my-store
cd my-store
# Configure .env.local with your store_hash, channel_id, and storefront token
npm run dev`,
    keyFeatures: [
      "Server Components + Streaming for fast TTFB",
      "Integrated GraphQL code generation (codegen)",
      "Makeswift visual page builder integration",
      "Full i18n support with next-intl",
      "Built-in cart, checkout, auth, and account pages",
      "Automatic data fetching with React cache()",
    ],
  },
};

// ─── ERROR CODES ─────────────────────────────────────────────────────────────

export const ERROR_CODES: Record<number, string> = {
  200: "OK — Request successful",
  201: "Created — Resource created successfully",
  204: "No Content — Successful deletion/update with no body",
  207: "Multi-Status — Partial batch success, check individual item statuses",
  400: "Bad Request — Invalid request body or parameters; check the errors array in response",
  401: "Unauthorized — Missing or invalid X-Auth-Token header",
  403: "Forbidden — Valid token but insufficient OAuth scope for the operation",
  404: "Not Found — Resource does not exist or wrong store_hash/ID",
  405: "Method Not Allowed — HTTP method not supported on this endpoint",
  409: "Conflict — Resource state conflict (e.g. duplicate SKU)",
  413: "Payload Too Large — Reduce batch size",
  415: "Unsupported Media Type — Set Content-Type: application/json",
  422: "Unprocessable Entity — Validation error; check response errors array for field details",
  429: "Too Many Requests — Rate limit hit; check X-Rate-Limit-* headers and back off",
  500: "Internal Server Error — BC server error; retry with exponential backoff",
  503: "Service Unavailable — BC maintenance or overload; retry later",
};
