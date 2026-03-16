# @erplinker/bigcommerce-mcp

> The complete BigCommerce developer platform as an MCP server — wired into Cursor, Claude, Windsurf, and any MCP-compatible AI tool.

[![npm version](https://img.shields.io/npm/v/@erplinker/bigcommerce-mcp.svg)](https://www.npmjs.com/package/@erplinker/bigcommerce-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

---

## What This Does

Gives your AI assistant the knowledge of a senior BigCommerce Solutions Engineer. Instead of hallucinating API details, your AI calls this MCP server and gets precise, structured answers about every endpoint, webhook, auth pattern, GraphQL operation, OAuth scope, and code example in the BigCommerce developer ecosystem.

**Coverage:**
- **22 API categories** — 171 fully-documented REST endpoints (v2 + v3)
- **42 webhook event scopes** with payload field reference
- **21 OAuth scopes** with read/write variants
- **3 GraphQL APIs** — 30 operations (Storefront, Admin, Account)
- **12 MCP tools** — search, endpoints, code gen, auth, best practices, live docs
- **49 live doc routes** — fetches directly from developer.bigcommerce.com

---

## Install

```bash
# Global install (recommended)
npm install -g @erplinker/bigcommerce-mcp

# Or local project install
npm install @erplinker/bigcommerce-mcp
```

---

## Cursor Setup (CLI + MCP Config)

### Step 1 — Install globally

```bash
npm install -g @erplinker/bigcommerce-mcp
```

Find your binary path (you'll need this):

```bash
which bigcommerce-mcp
# macOS/Linux: /usr/local/bin/bigcommerce-mcp
# nvm users:   ~/.nvm/versions/node/v20.x.x/bin/bigcommerce-mcp
# Windows:     C:\Users\you\AppData\Roaming\npm\bigcommerce-mcp.cmd
```

### Step 2 — Add to Cursor MCP config

Open the file at one of these paths:

- **macOS:** `~/.cursor/mcp.json`
- **Windows:** `%APPDATA%\Cursor\mcp.json`
- **Linux:** `~/.config/cursor/mcp.json`

Or via Cursor UI: `Cmd+Shift+P` → **"Cursor: Open MCP Settings"**

```json
{
  "mcpServers": {
    "bigcommerce": {
      "command": "bigcommerce-mcp",
      "args": [],
      "description": "BigCommerce full developer docs — REST, GraphQL, Webhooks, Auth, Stencil, Catalyst"
    }
  }
}
```

> **Using nvm or non-standard PATH?** Use the full absolute path:
> ```json
> {
>   "mcpServers": {
>     "bigcommerce": {
>       "command": "/Users/you/.nvm/versions/node/v20.18.0/bin/bigcommerce-mcp"
>     }
>   }
> }
> ```

> **No global install? Use npx:**
> ```json
> {
>   "mcpServers": {
>     "bigcommerce": {
>       "command": "npx",
>       "args": ["-y", "@erplinker/bigcommerce-mcp"]
>     }
>   }
> }
> ```

### Step 3 — Restart Cursor and verify

1. Fully quit and reopen Cursor
2. Open AI chat → type: `@bigcommerce search for order webhooks`
3. You should see the MCP tool execute and return structured data

If the tool doesn't appear, check `View → Output → MCP` in Cursor for error logs.

### Step 4 — Add the Master System Prompt

This is the key step. It tells Cursor's AI *how* to use the MCP tools like an expert.

**Option A — Global (applies to all Cursor projects):**

```
Cursor → Settings (Cmd+,) → Cursor Settings → Rules → "Rules for AI"
```

Paste the contents of the Master Prompt section at the bottom of this README.

**Option B — Per-project `.cursorrules` (recommended for BC projects):**

Create a `.cursorrules` file in your project root and paste the Master Prompt from the section below.

**Option C — New MDC format (Cursor 0.43+):**

```bash
mkdir -p .cursor/rules
```

Create `.cursor/rules/bigcommerce.mdc` and paste the Master Prompt from the section below.

---

## Claude Desktop Setup

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "bigcommerce": {
      "command": "bigcommerce-mcp"
    }
  }
}
```

---

## Windsurf / Other MCP Clients

```json
{
  "mcpServers": {
    "bigcommerce": {
      "command": "bigcommerce-mcp",
      "args": []
    }
  }
}
```

---

## The 12 MCP Tools

| Tool | Use When |
|---|---|
| `search_docs` | Any BC question — searches endpoints, webhooks, GraphQL, scopes, best practices |
| `get_api_endpoints` | Need all endpoints for a category (catalog, orders, customers, cart, etc.) |
| `get_endpoint_detail` | Need exact body schema, params, or OAuth scope for one endpoint |
| `get_webhook_events` | Need webhook scope names and payload structures |
| `get_oauth_scopes` | Setting up API accounts or app scopes — never guess these |
| `get_auth_guide` | Auth questions: REST, GraphQL tokens, Customer SSO, OAuth app flow |
| `get_graphql_info` | GraphQL queries, mutations, token setup |
| `get_code_example` | Need runnable code: REST calls, webhooks, OAuth, GraphQL, cart/checkout |
| `get_rate_limit_info` | Writing any loop or bulk operation — includes full production client |
| `get_best_practices` | Architecture decisions: pagination, webhooks, apps, headless, performance |
| `get_error_codes` | Debugging API errors (400, 401, 403, 404, 422, 429, 500) |
| `fetch_live_doc` | Need live docs from developer.bigcommerce.com (49 available topics) |

---

## Example Prompts That Work Great

```
"What endpoints do I need to build headless cart and checkout?"
"Write a Next.js /auth callback handler for the BigCommerce OAuth flow"
"Give me a production webhook handler for order.created in TypeScript"
"What's the GraphQL query to fetch a product by URL path with prices?"
"How do I sync 200k inventory records without hitting rate limits?"
"What OAuth scopes do I need for managing orders and customers?"
"How do I SSO a customer from my auth system into BigCommerce?"
"Show me how Price Lists work with customer groups — with code"
"I'm getting a 403 on POST /catalog/products — what scope am I missing?"
"Write Stencil JS to AJAX add-to-cart and update the cart counter"
"How do I create a channel and assign products to it in MSF?"
"Generate bulk inventory sync code with rate limit handling"
```

---

## Master Prompt — Paste into Cursor Rules for AI

```
You are an expert BigCommerce developer. You have access to the BigCommerce Developer
Documentation MCP server (@erplinker/bigcommerce-mcp).

ALWAYS call MCP tools before answering BigCommerce questions. Never answer from
memory alone when a tool will give you precise information.

TOOL USAGE RULES:
- search_docs(query) — Call first for any BC API or feature question
- get_api_endpoints(category) — When user needs to know what endpoints exist
  Categories: catalog, orders, customers, cart, checkouts, channels, shipping,
  payments, inventory, pricelists, promotions, webhooks, scripts, themes,
  settings, pages, subscribers, wishlists, reviews, store-info, tax
- get_endpoint_detail(path_contains, method?) — For exact body/params/scope
- get_code_example(operation, language?) — Before writing any BC API code
  Operations: getProduct, getProductsByCategory, createCart, routeQuery,
  customerLogin, webhookSetup, oauthApp, rateLimit, inventorySync,
  or any "METHOD /path" like "POST /catalog/products"
  Languages: node (default), python, php, curl
- get_webhook_events(category?, search?) — For webhook scope strings
  Categories: Orders, Products, Cart, Customers, Channels, Inventory, Shipment, Store
- get_oauth_scopes(resource?) — NEVER guess scope names. Always call this.
- get_auth_guide(type) — type: rest | graphql | customer_login | oauth_app | all
- get_graphql_info(api?, operation_search?) — api: storefront | admin | account
- get_rate_limit_info() — Always call when writing loops or bulk operations
- get_best_practices(topic) — topic: general|pagination|webhooks|apps|headless|performance
- get_error_codes(code?) — When user hits an API error, call this first
- fetch_live_doc(topic) — For niche or recently updated features
  Topics: quickstart, about-api, authentication, api-accounts, oauth-scopes, catalog,
  orders, customers, cart, checkouts, channels, shipping, payments, inventory,
  pricelists, promotions, themes, scripts, settings, pages, subscribers, wishlists,
  reviews, gift-certificates, graphql-storefront, graphql-admin, graphql-account,
  webhooks, webhook-events, app-guide, app-callbacks, embedded-checkout,
  customer-login, stencil, stencil-cli, catalyst, headless, storefront-tokens,
  dev-portal, app-types, app-installation

ALWAYS IN GENERATED CODE:
- REST Management header: X-Auth-Token: {access_token}
  (never use Authorization: Bearer for REST Management)
- GraphQL Storefront header: Authorization: Bearer {channel_token}
- Always include Content-Type: application/json and Accept: application/json
- Always handle 429: read X-Rate-Limit-Time-Reset-Ms, wait, retry
- Never put X-Auth-Token in client-side / browser JavaScript
- Show required OAuth scope in a comment above every API call
- Use ?include= query params to embed nested objects (avoid N+1 requests)
- Use bulk/batch endpoints for multi-record operations
- Use webhooks instead of polling the API

BASE URLS (always use these exactly):
- REST v3:    https://api.bigcommerce.com/stores/{store_hash}/v3
- REST v2:    https://api.bigcommerce.com/stores/{store_hash}/v2
- GraphQL SF: https://{store_domain}/graphql
- Payments:   https://payments.bigcommerce.com/stores/{store_hash}/payments
  (NOTE: Payments API is on a DIFFERENT HOST than REST Management)
- OAuth:      https://login.bigcommerce.com/oauth2/token

ARCHITECTURE DECISIONS:
- Headless storefront       → GraphQL Storefront API + Catalyst (Next.js)
- Store data management     → REST Management API v3
- Real-time event handling  → Webhooks (never polling)
- Customer SSO / sign-in    → Customer Login API (HS256 JWT, 30s TTL)
- App Marketplace app       → OAuth app (/auth + /load + /uninstall callbacks)
- Injecting JS to storefront → Scripts API (not manual theme edits)
- Customer-group pricing    → Price Lists API
- Automatic cart discounts  → Promotions API (not legacy Coupons)
- Multi-location inventory  → Inventory v3 API with location_id
- Multi-storefront setup    → Channels API + MSF architecture

ERROR HANDLING TEMPLATE (always include):
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`BC API ${response.status}: ${JSON.stringify(error.errors ?? error.title ?? error)}`);
  }

RATE LIMIT TEMPLATE (always include for loops):
  if (response.status === 429) {
    const ms = parseInt(response.headers.get('X-Rate-Limit-Time-Reset-Ms') ?? '5000');
    await new Promise(r => setTimeout(r, ms + 200));
    // retry request
  }

PAGINATION TEMPLATE (REST v3):
  let page = 1;
  do {
    const res = await bc.get(`/endpoint?page=${page}&limit=250`);
    // process res.data
    page++;
  } while (page <= res.meta.pagination.total_pages);
```

---

## Project Structure

```
bigcommerce-mcp/
├── src/
│   ├── index.ts                     # MCP server, all 12 tool handlers
│   ├── docs/
│   │   ├── knowledge-base.ts        # 171 endpoints, 42 webhooks, 21 scopes, auth
│   │   └── fetcher.ts               # Live doc fetcher → developer.bigcommerce.com
│   └── utils/
│       └── code-generator.ts        # Code example generators (REST, GraphQL, OAuth)
├── dist/                            # Compiled output (ships with npm package)
├── claude_desktop_config.example.json
├── package.json
├── tsconfig.json
├── LICENSE
└── README.md
```

---

## Links

- [BigCommerce Developer Center](https://developer.bigcommerce.com)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Cursor MCP Docs](https://docs.cursor.com/context/model-context-protocol)
- [npm package](https://www.npmjs.com/package/@erplinker/bigcommerce-mcp)

---

## License

MIT — see [LICENSE](LICENSE)
