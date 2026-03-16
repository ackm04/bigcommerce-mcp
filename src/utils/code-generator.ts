/**
 * Code example generator for BigCommerce API operations.
 * Generates ready-to-use code snippets in multiple languages.
 */

type Language = "curl" | "node" | "python" | "php";

export interface CodeExample {
  language: Language;
  label: string;
  code: string;
}

export function generateRestExample(
  method: string,
  path: string,
  body?: Record<string, unknown>,
  language: Language = "node"
): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = `https://api.bigcommerce.com/stores/\${STORE_HASH}${normalizedPath}`;
  const hasBody = body && Object.keys(body).length > 0;
  const bodyStr = hasBody ? JSON.stringify(body, null, 2) : null;

  switch (language) {
    case "curl":
      return generateCurl(method, fullUrl, bodyStr);
    case "node":
      return generateNode(method, fullUrl, bodyStr);
    case "python":
      return generatePython(method, fullUrl, bodyStr);
    case "php":
      return generatePhp(method, fullUrl, bodyStr);
    default:
      return generateNode(method, fullUrl, bodyStr);
  }
}

function generateCurl(method: string, url: string, body: string | null): string {
  const lines = [
    `curl -X ${method} \\`,
    `  "${url}" \\`,
    `  -H "X-Auth-Token: $ACCESS_TOKEN" \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -H "Accept: application/json"`,
  ];
  if (body) {
    lines[lines.length - 1] += " \\";
    lines.push(`  -d '${body}'`);
  }
  return lines.join("\n");
}

function generateNode(method: string, url: string, body: string | null): string {
  const hasBody = body !== null;
  return `// Using native fetch (Node 18+)
const STORE_HASH = process.env.BC_STORE_HASH;
const ACCESS_TOKEN = process.env.BC_ACCESS_TOKEN;

const response = await fetch(\`${url}\`, {
  method: "${method}",
  headers: {
    "X-Auth-Token": ACCESS_TOKEN,
    "Content-Type": "application/json",
    "Accept": "application/json",
  },${hasBody ? `\n  body: JSON.stringify(${body}),` : ""}
});

if (!response.ok) {
  const error = await response.json();
  throw new Error(\`BC API Error \${response.status}: \${JSON.stringify(error)}\`);
}

${method === "DELETE" ? `// 204 No Content on success
console.log("Deleted successfully");` : `const data = await response.json();
console.log(data);`}`;
}

function generatePython(method: string, url: string, body: string | null): string {
  const hasBody = body !== null;
  return `import os
import requests

store_hash = os.environ["BC_STORE_HASH"]
access_token = os.environ["BC_ACCESS_TOKEN"]

url = f"${url.replace("${STORE_HASH}", "{store_hash}")}"
headers = {
    "X-Auth-Token": access_token,
    "Content-Type": "application/json",
    "Accept": "application/json",
}
${hasBody ? `payload = ${body.replace(/true/g, "True").replace(/false/g, "False").replace(/null/g, "None")}` : ""}

response = requests.${method.toLowerCase()}(url, headers=headers${hasBody ? ", json=payload" : ""})
response.raise_for_status()

${method === "DELETE" ? `print("Deleted successfully")` : `data = response.json()
print(data)`}`;
}

function generatePhp(method: string, url: string, body: string | null): string {
  const hasBody = body !== null;
  return `<?php
$storeHash = $_ENV['BC_STORE_HASH'];
$accessToken = $_ENV['BC_ACCESS_TOKEN'];

$url = "${url.replace("${STORE_HASH}", "' . $storeHash . '")}";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${method}');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-Auth-Token: ' . $accessToken,
    'Content-Type: application/json',
    'Accept: application/json',
]);
${hasBody ? `curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(${body}));` : ""}

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode >= 400) {
    throw new Exception("BC API Error {$httpCode}: {$response}");
}

${method === "DELETE" ? `echo "Deleted successfully";` : `$data = json_decode($response, true);
var_dump($data);`}`;
}

// ─── GRAPHQL EXAMPLE GENERATOR ───────────────────────────────────────────────

export function generateGraphQLExample(operation: string): string {
  const examples: Record<string, string> = {
    getProduct: `// GraphQL Storefront API — Fetch a product
const STORE_DOMAIN = process.env.BC_STORE_DOMAIN; // e.g. store-xyz.mybigcommerce.com
const STOREFRONT_TOKEN = process.env.BC_STOREFRONT_TOKEN;

const query = \`
  query GetProduct($entityId: Int!) {
    site {
      product(entityId: $entityId) {
        entityId
        name
        sku
        description { html }
        defaultImage { url(width: 800) altText }
        prices {
          price { value currencyCode }
          salePrice { value currencyCode }
          retailPrice { value currencyCode }
        }
        inventory { isInStock }
        variants(first: 25) {
          edges {
            node {
              entityId
              sku
              isPurchasable
              defaultImage { url(width: 400) }
              prices { price { value currencyCode } }
              productOptions {
                edges {
                  node {
                    entityId
                    displayName
                    ... on MultipleChoiceOption {
                      values {
                        edges { node { entityId label isDefault } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
\`;

const response = await fetch(\`https://\${STORE_DOMAIN}/graphql\`, {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${STOREFRONT_TOKEN}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query, variables: { entityId: 123 } }),
});

const { data, errors } = await response.json();
if (errors) throw new Error(JSON.stringify(errors));
console.log(data.site.product);`,

    getProductsByCategory: `// GraphQL Storefront API — Products by category with cursor pagination
const query = \`
  query CategoryProducts($entityId: Int!, $cursor: String) {
    site {
      category(entityId: $entityId) {
        name
        products(first: 12, after: $cursor, sort: FEATURED) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              entityId
              name
              path
              defaultImage { url(width: 400) altText }
              prices {
                price { value currencyCode }
                salePrice { value currencyCode }
              }
            }
          }
        }
      }
    }
  }
\`;

// Fetch all pages
let cursor = null;
let products = [];

do {
  const res = await fetch(gqlEndpoint, {
    method: "POST",
    headers: { "Authorization": \`Bearer \${token}\`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { entityId: 5, cursor } }),
  });
  const { data } = await res.json();
  const { edges, pageInfo } = data.site.category.products;
  products.push(...edges.map(e => e.node));
  cursor = pageInfo.hasNextPage ? pageInfo.endCursor : null;
} while (cursor);`,

    createCart: `// GraphQL Storefront API — Create cart and get checkout URL
const mutation = \`
  mutation CreateCart($input: CreateCartInput!) {
    cart {
      createCart(input: $input) {
        cart {
          entityId
          lineItems {
            physicalItems { quantity name }
          }
        }
      }
    }
  }
\`;

const variables = {
  input: {
    lineItems: [
      { productEntityId: 123, variantEntityId: 456, quantity: 2 },
    ],
  },
};

const res = await fetch(gqlEndpoint, {
  method: "POST",
  headers: { "Authorization": \`Bearer \${token}\`, "Content-Type": "application/json" },
  body: JSON.stringify({ query: mutation, variables }),
});
const { data } = await res.json();
const cartId = data.cart.createCart.cart.entityId;

// Now get checkout URL via REST
const checkoutRes = await fetch(
  \`https://api.bigcommerce.com/stores/\${storeHash}/v3/carts/\${cartId}/redirect_urls\`,
  { method: "POST", headers: { "X-Auth-Token": accessToken, "Content-Type": "application/json" } }
);
const { data: urls } = await checkoutRes.json();
console.log("Checkout URL:", urls.checkout_url);`,

    routeQuery: `// GraphQL Storefront API — Universal URL routing (essential for headless)
const query = \`
  query RouteQuery($path: String!) {
    site {
      route(path: $path) {
        node {
          __typename
          ... on Product {
            entityId
            name
            sku
          }
          ... on Category {
            entityId
            name
            path
          }
          ... on Brand {
            entityId
            name
            path
          }
          ... on RawHtmlPage {
            entityId
            htmlBody
            name
          }
          ... on ContactPage {
            entityId
            name
          }
          ... on BlogPost {
            entityId
            name
            htmlBody
            publishedDate { utc }
          }
        }
      }
    }
  }
\`;

// In your Next.js app router:
// app/[[...slug]]/page.tsx
async function Page({ params }: { params: { slug?: string[] } }) {
  const path = "/" + (params.slug?.join("/") ?? "");
  const res = await fetch(gqlEndpoint, {
    method: "POST",
    headers: { "Authorization": \`Bearer \${token}\`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { path } }),
  });
  const { data } = await res.json();
  const node = data.site.route.node;
  
  switch (node?.__typename) {
    case "Product": return <ProductPage product={node} />;
    case "Category": return <CategoryPage category={node} />;
    case "Brand": return <BrandPage brand={node} />;
    default: return <NotFound />;
  }
}`,

    customerLogin: `// Customer Login API — Sign in customer and redirect (Node.js/Next.js)
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

function generateCustomerLoginToken(
  customerId: number,
  storeHash: string,
  clientId: string,
  clientSecret: string,
  channelId = 1
): string {
  const payload = {
    iss: clientId,
    iat: Math.floor(Date.now() / 1000),
    jti: uuidv4(),                    // MUST be unique per request
    operation: "customer_login",
    store_hash: storeHash,
    customer_id: customerId,
    channel_id: channelId,
    // Optional: redirect_to: "/account.php",
  };
  
  return jwt.sign(payload, clientSecret, { algorithm: "HS256", expiresIn: "30s" });
}

// Generate token and redirect
const token = generateCustomerLoginToken(
  123,                              // your customer's BC ID
  process.env.BC_STORE_HASH!,
  process.env.BC_CLIENT_ID!,
  process.env.BC_CLIENT_SECRET!
);

// Redirect customer to storefront login
const loginUrl = \`https://store-\${storeHash}.mybigcommerce.com/login/token/\${token}\`;
// In Next.js: redirect(loginUrl);`,

    webhookSetup: `// Webhook registration — subscribe to order events
const webhookRes = await fetch(
  \`https://api.bigcommerce.com/stores/\${STORE_HASH}/v3/hooks\`,
  {
    method: "POST",
    headers: {
      "X-Auth-Token": ACCESS_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scope: "store/order/created",
      destination: "https://your-app.com/webhooks/bc",
      is_active: true,
      events_history_enabled: true,   // enable delivery history replay
      headers: {
        "X-Custom-Auth": "your-secret-here",  // optional auth on your endpoint
      },
    }),
  }
);

// Your webhook handler (Express)
app.post("/webhooks/bc", async (req, res) => {
  // IMPORTANT: Respond 200 IMMEDIATELY to avoid BC marking as failed
  res.status(200).send("OK");
  
  // Then process asynchronously
  const { scope, data } = req.body;
  await queue.push({ scope, orderId: data.id });
});

// Queue processor — fetch full order details
async function processOrderCreated(orderId: number) {
  const res = await fetch(
    \`https://api.bigcommerce.com/stores/\${STORE_HASH}/v2/orders/\${orderId}\`,
    { headers: { "X-Auth-Token": ACCESS_TOKEN } }
  );
  const order = await res.json();
  // ... process order
}`,

    oauthApp: `// OAuth App — /auth callback handler (Next.js Route Handler)
// app/api/bc/auth/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const scope = searchParams.get("scope");
  const context = searchParams.get("context"); // e.g. "stores/xyz123"
  
  if (!code || !context) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }
  
  // Exchange grant code for access token
  const tokenRes = await fetch("https://login.bigcommerce.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.BC_CLIENT_ID!,
      client_secret: process.env.BC_CLIENT_SECRET!,
      code,
      scope: scope ?? "",
      grant_type: "authorization_code",
      redirect_uri: \`\${process.env.APP_URL}/api/bc/auth\`,
      context,
    }),
  });
  
  const { access_token, context: storeContext } = await tokenRes.json();
  const storeHash = storeContext.split("/")[1];
  
  // Persist token (database, KV store, etc.)
  await db.upsert({ storeHash, accessToken: access_token, scope });
  
  // Redirect to app UI
  return NextResponse.redirect(\`\${process.env.APP_URL}/dashboard?store=\${storeHash}\`);
}`,
  };

  return examples[operation] ?? `// No example available for operation: ${operation}\n// Refer to: https://developer.bigcommerce.com/docs`;
}

// ─── RATE LIMIT HANDLER GENERATOR ───────────────────────────────────────────

export function generateRateLimitHandler(): string {
  return `// Production-grade BigCommerce API client with rate limit handling
class BigCommerceClient {
  private storeHash: string;
  private accessToken: string;

  constructor(storeHash: string, accessToken: string) {
    this.storeHash = storeHash;
    this.accessToken = accessToken;
  }

  private baseUrl(version: "v2" | "v3" = "v3"): string {
    return \`https://api.bigcommerce.com/stores/\${this.storeHash}/\${version}\`;
  }

  async request<T>(
    method: string,
    path: string,
    body?: unknown,
    retries = 3
  ): Promise<T> {
    const version = path.startsWith("/v2") ? "v2" : "v3";
    const cleanPath = path.replace(/^\\/v[23]/, "");

    const response = await fetch(\`\${this.baseUrl(version)}\${cleanPath}\`, {
      method,
      headers: {
        "X-Auth-Token": this.accessToken,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    // Rate limit — back off and retry
    if (response.status === 429 && retries > 0) {
      const resetMs = parseInt(response.headers.get("X-Rate-Limit-Time-Reset-Ms") ?? "5000");
      console.warn(\`Rate limited. Retrying in \${resetMs}ms...\`);
      await new Promise(r => setTimeout(r, resetMs + 200));
      return this.request<T>(method, path, body, retries - 1);
    }

    if (response.status === 204) return undefined as T;

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        \`BC API \${response.status}: \${JSON.stringify(data.errors ?? data.title ?? data)}\`
      );
    }

    return data as T;
  }

  // Paginate through all results for a collection endpoint
  async *paginate<T>(path: string, params: Record<string, unknown> = {}): AsyncGenerator<T[]> {
    let page = 1;
    const limit = 250;

    while (true) {
      const qs = new URLSearchParams({
        ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
        page: String(page),
        limit: String(limit),
      });

      const result = await this.request<{ data: T[]; meta: { pagination: { total_pages: number } } }>(
        "GET",
        \`\${path}?\${qs}\`
      );

      yield result.data;

      if (page >= result.meta.pagination.total_pages) break;
      page++;
    }
  }
}

// Usage
const bc = new BigCommerceClient(STORE_HASH, ACCESS_TOKEN);

// Get all products (auto-pagination)
const allProducts = [];
for await (const page of bc.paginate("/catalog/products", { include: "variants,images" })) {
  allProducts.push(...page);
  console.log(\`Fetched \${allProducts.length} products...\`);
}`;
}

// ─── INVENTORY SYNC EXAMPLE ──────────────────────────────────────────────────

export function generateInventorySyncExample(): string {
  return `// Bulk inventory sync — update up to 2000 items per request
async function syncInventory(
  updates: { sku: string; locationId: number; quantity: number }[]
) {
  const BATCH_SIZE = 500; // Recommended batch size for reliability
  
  for (let i = 0; i < updates.length; i += BATCH_SIZE) {
    const batch = updates.slice(i, i + BATCH_SIZE);
    
    const response = await fetch(
      \`https://api.bigcommerce.com/stores/\${STORE_HASH}/v3/inventory/adjustments/absolute\`,
      {
        method: "PUT",
        headers: {
          "X-Auth-Token": ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: batch.map(u => ({
            sku: u.sku,
            location_id: u.locationId,
            quantity: u.quantity,
          })),
        }),
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      console.error(\`Batch \${i / BATCH_SIZE + 1} failed:\`, error);
      // Handle partial failure — check individual item errors
      if (error.errors) {
        error.errors.forEach((e: any) => console.error(\`  SKU \${e.entity_id}: \${e.message}\`));
      }
    } else {
      console.log(\`Batch \${i / BATCH_SIZE + 1}/\${Math.ceil(updates.length / BATCH_SIZE)} synced\`);
    }
    
    // Brief pause between batches to be a good API citizen
    if (i + BATCH_SIZE < updates.length) {
      await new Promise(r => setTimeout(r, 200));
    }
  }
}`;
}
