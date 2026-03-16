#!/usr/bin/env node
/**
 * BigCommerce Developer Documentation MCP Server
 *
 * Exposes the entire BigCommerce developer ecosystem as MCP tools:
 *  - search_docs           — Full-text search across all BC docs
 *  - get_api_endpoints     — List/search API endpoints by category
 *  - get_endpoint_detail   — Get full detail for a specific endpoint
 *  - get_webhook_events    — List and filter all webhook event scopes
 *  - get_oauth_scopes      — Get OAuth scopes reference
 *  - get_auth_guide        — Authentication patterns (REST, GraphQL, SSO, OAuth flow)
 *  - get_graphql_info      — GraphQL API operations and usage
 *  - get_code_example      — Generate ready-to-use code examples
 *  - get_rate_limit_info   — Rate limiting details and handler code
 *  - get_best_practices    — Best practices by topic area
 *  - get_error_codes       — HTTP error code reference
 *  - fetch_live_doc        — Fetch a live documentation page from developer.bigcommerce.com
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import {
  API_CATEGORIES,
  WEBHOOK_EVENTS,
  OAUTH_SCOPES,
  GRAPHQL_APIS,
  AUTH_PATTERNS,
  RATE_LIMITS,
  BEST_PRACTICES,
  ERROR_CODES,
  type ApiCategory,
  type Endpoint,
} from "./docs/knowledge-base.js";

import { fetchDocPage, DOC_PAGES } from "./docs/fetcher.js";

import {
  generateRestExample,
  generateGraphQLExample,
  generateRateLimitHandler,
  generateInventorySyncExample,
} from "./utils/code-generator.js";

// ─── SERVER SETUP ─────────────────────────────────────────────────────────────

const server = new Server(
  {
    name: "bigcommerce-dev-docs",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ─── TOOL DEFINITIONS ─────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_docs",
        description:
          "Full-text search across all BigCommerce developer documentation — API endpoints, webhooks, authentication, GraphQL, Stencil, Catalyst, best practices, and more. Use this as the first tool when you're not sure where to start.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description:
                "Search query, e.g. 'create product variant', 'webhook order created', 'customer login JWT', 'headless checkout'",
            },
            limit: {
              type: "number",
              description: "Max results to return (default: 10)",
              default: 10,
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_api_endpoints",
        description:
          "Get all REST API endpoints for a specific BigCommerce API category. Returns methods, paths, descriptions, required OAuth scopes, and parameter info.",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description:
                "API category slug. Options: catalog, orders, customers, cart, checkouts, channels, shipping, payments, inventory, pricelists, promotions, webhooks, scripts, themes, settings, pages, subscribers, gift-certificates, wishlists, reviews, store-info, tax",
            },
            method: {
              type: "string",
              description: "Filter by HTTP method: GET, POST, PUT, DELETE, PATCH",
              enum: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            },
          },
          required: ["category"],
        },
      },
      {
        name: "get_endpoint_detail",
        description:
          "Get comprehensive detail for a specific BigCommerce API endpoint — request body schema, path parameters, query params, example response, OAuth scope, and usage notes.",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "API category (e.g. catalog, orders, customers, cart)",
            },
            path_contains: {
              type: "string",
              description:
                "Part of the endpoint path to search for, e.g. '/products', '/orders/{order_id}/shipments', 'variants'",
            },
            method: {
              type: "string",
              description: "HTTP method: GET, POST, PUT, DELETE",
            },
          },
          required: ["path_contains"],
        },
      },
      {
        name: "get_webhook_events",
        description:
          "Get all BigCommerce webhook event scopes with descriptions and payload structures. Filter by category or search by name.",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description:
                "Filter by category: Orders, Products, Cart, Customers, Channels, Inventory, Shipment, Store, Catalog",
            },
            search: {
              type: "string",
              description: "Search by event name or description keyword",
            },
          },
          required: [],
        },
      },
      {
        name: "get_oauth_scopes",
        description:
          "Get the complete OAuth scope reference for BigCommerce. Find the correct read/write scopes for any API resource.",
        inputSchema: {
          type: "object",
          properties: {
            resource: {
              type: "string",
              description:
                "Filter by resource name, e.g. 'products', 'orders', 'customers', 'payments', 'cart'",
            },
          },
          required: [],
        },
      },
      {
        name: "get_auth_guide",
        description:
          "Get authentication guides and code examples for BigCommerce APIs — REST Management auth, Storefront GraphQL tokens, Customer Login API (SSO), and the OAuth app installation flow.",
        inputSchema: {
          type: "object",
          properties: {
            type: {
              type: "string",
              description:
                "Auth type: rest (REST Management API), graphql (Storefront API), customer_login (Customer SSO JWT), oauth_app (App Marketplace OAuth flow)",
              enum: ["rest", "graphql", "customer_login", "oauth_app", "all"],
            },
          },
          required: ["type"],
        },
      },
      {
        name: "get_graphql_info",
        description:
          "Get information about BigCommerce GraphQL APIs — Storefront API, Admin API, and Account API. Includes available operations, auth methods, and endpoints.",
        inputSchema: {
          type: "object",
          properties: {
            api: {
              type: "string",
              description: "GraphQL API name: storefront, admin, account, or all",
              enum: ["storefront", "admin", "account", "all"],
            },
            operation_search: {
              type: "string",
              description: "Search for a specific operation by name, e.g. 'cart', 'product', 'route'",
            },
          },
          required: [],
        },
      },
      {
        name: "get_code_example",
        description:
          "Get ready-to-use code examples for BigCommerce API operations in multiple languages. Includes REST API calls, GraphQL queries, webhook handlers, OAuth flow, cart/checkout, customer login, and more.",
        inputSchema: {
          type: "object",
          properties: {
            operation: {
              type: "string",
              description:
                "Operation to get example for: getProduct, getProductsByCategory, createCart, routeQuery, customerLogin, webhookSetup, oauthApp, rateLimit, inventorySync, or specify a method+path like 'POST /catalog/products'",
            },
            language: {
              type: "string",
              description: "Programming language: node (default), python, php, curl",
              enum: ["node", "python", "php", "curl"],
              default: "node",
            },
          },
          required: ["operation"],
        },
      },
      {
        name: "get_rate_limit_info",
        description:
          "Get BigCommerce API rate limit details — how the bucket algorithm works, response headers, and a production-grade client with auto-retry and pagination.",
        inputSchema: {
          type: "object",
          properties: {
            include_client_code: {
              type: "boolean",
              description: "Include a full production-grade API client implementation with rate limit handling",
              default: true,
            },
          },
          required: [],
        },
      },
      {
        name: "get_best_practices",
        description:
          "Get best practices for BigCommerce development by topic area — pagination, webhooks, app development, headless/Catalyst, performance, and general API usage.",
        inputSchema: {
          type: "object",
          properties: {
            topic: {
              type: "string",
              description:
                "Topic area: general, pagination, webhooks, apps, headless, performance, or all",
              enum: ["general", "pagination", "webhooks", "apps", "headless", "performance", "all"],
            },
          },
          required: ["topic"],
        },
      },
      {
        name: "get_error_codes",
        description:
          "Get HTTP error code reference for BigCommerce APIs with explanations and troubleshooting guidance.",
        inputSchema: {
          type: "object",
          properties: {
            code: {
              type: "number",
              description: "Specific HTTP status code to look up, e.g. 422, 429, 403",
            },
          },
          required: [],
        },
      },
      {
        name: "fetch_live_doc",
        description:
          "Fetch a live documentation page from developer.bigcommerce.com. Use when you need the most up-to-date documentation for a specific topic not covered by the other tools.",
        inputSchema: {
          type: "object",
          properties: {
            topic: {
              type: "string",
              description: `Topic slug to fetch. Available topics: ${Object.keys(DOC_PAGES).join(", ")}`,
            },
          },
          required: ["topic"],
        },
      },
    ],
  };
});

// ─── TOOL HANDLERS ────────────────────────────────────────────────────────────

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {

      // ── search_docs ──────────────────────────────────────────────────────────
      case "search_docs": {
        const { query, limit = 10 } = args as { query: string; limit?: number };
        const q = query.toLowerCase();
        // Support multi-word queries by checking if ALL tokens match
        const tokens = q.split(/\s+/).filter(Boolean);
        const matches = (text: string) => tokens.every((t) => text.includes(t));
        const results: string[] = [];

        // Search API categories
        for (const cat of API_CATEGORIES) {
          if (matches(`${cat.name} ${cat.description} ${cat.slug}`)) {
            results.push(`📂 API Category: **${cat.name}**\n   ${cat.description}\n   Base URL: \`${cat.baseUrl}\`\n   Docs: ${cat.docsUrl}`);
          }
          for (const ep of cat.endpoints) {
            const epText = `${ep.method} ${ep.path} ${ep.description} ${ep.scope ?? ""} ${cat.name}`;
            if (matches(epText)) {
              results.push(`🔌 ${cat.name} — \`${ep.method} ${ep.path}\`\n   ${ep.description}\n   Scope: \`${ep.scope ?? "store/default"}\``);
            }
          }
        }

        // Search webhook events
        for (const ev of WEBHOOK_EVENTS) {
          if (matches(`${ev.name} ${ev.description} ${ev.category} ${ev.scope}`)) {
            results.push(`🔔 Webhook: \`${ev.scope}\`\n   ${ev.description} (Category: ${ev.category})`);
          }
        }

        // Search GraphQL
        for (const api of GRAPHQL_APIS) {
          if (matches(`${api.name} ${api.description}`)) {
            results.push(`⚡ GraphQL: **${api.name}**\n   ${api.description}\n   Endpoint: \`${api.endpoint}\``);
          }
          for (const op of api.operations) {
            if (matches(`${op.name} ${op.description} ${op.type} graphql`)) {
              results.push(`⚡ ${api.name} — \`${op.type} ${op.name}\`\n   ${op.description}`);
            }
          }
        }

        // Search OAuth scopes
        for (const scope of OAUTH_SCOPES) {
          if (matches(`${scope.name} ${scope.description} ${scope.uiName} ${scope.readScope} ${scope.writeScope}`)) {
            results.push(`🔑 OAuth Scope: **${scope.uiName}**\n   Read: \`${scope.readScope || "n/a"}\` | Write: \`${scope.writeScope || "n/a"}\`\n   ${scope.description}`);
          }
        }

        // Search best practices
        for (const [topic, tips] of Object.entries(BEST_PRACTICES)) {
          for (const tip of tips) {
            if (matches(tip)) {
              results.push(`💡 Best Practice (${topic}): ${tip}`);
            }
          }
        }

        const sliced = results.slice(0, limit);

        if (sliced.length === 0) {
          return {
            content: [{
              type: "text",
              text: `No results found for "${query}".\n\nTry searching for:\n- API category names (catalog, orders, customers, cart, channels)\n- Webhook events (order, product, cart, customer)\n- Operations (create, update, delete, sync, paginate)\n- Concepts (authentication, OAuth, GraphQL, headless, rate limit)\n\nAvailable topics in fetch_live_doc: ${Object.keys(DOC_PAGES).slice(0, 20).join(", ")}...`,
            }],
          };
        }

        return {
          content: [{
            type: "text",
            text: `Found ${results.length} result(s) for "${query}" (showing top ${sliced.length}):\n\n${sliced.join("\n\n")}`,
          }],
        };
      }

      // ── get_api_endpoints ─────────────────────────────────────────────────────
      case "get_api_endpoints": {
        const { category, method } = args as { category: string; method?: string };
        const cat = API_CATEGORIES.find(
          (c) => c.slug === category.toLowerCase() || c.name.toLowerCase() === category.toLowerCase()
        );

        if (!cat) {
          const available = API_CATEGORIES.map((c) => `${c.slug} (${c.name})`).join(", ");
          return {
            content: [{
              type: "text",
              text: `Category "${category}" not found.\n\nAvailable categories:\n${available}`,
            }],
          };
        }

        const endpoints = method
          ? cat.endpoints.filter((e) => e.method === method.toUpperCase())
          : cat.endpoints;

        const lines = [
          `# ${cat.name} API`,
          `**Description:** ${cat.description}`,
          `**Base URL:** \`${cat.baseUrl}\``,
          `**API Docs:** ${cat.docsUrl}`,
          `**Endpoints (${endpoints.length}${method ? ` — ${method}` : ""}):**`,
          "",
          ...endpoints.map((e) => {
            const parts = [
              `## \`${e.method} ${e.path}\` (API ${e.version})`,
              `**Description:** ${e.description}`,
              `**OAuth Scope:** \`${e.scope ?? "store/default"}\``,
            ];
            if (e.params) {
              parts.push(`**Query Params:**\n${Object.entries(e.params).map(([k, v]) => `  - \`${k}\`: ${v}`).join("\n")}`);
            }
            if (e.body) {
              parts.push(`**Request Body:**\n${Object.entries(e.body).map(([k, v]) => `  - \`${k}\`: ${v}`).join("\n")}`);
            }
            if (e.returns) {
              parts.push(`**Returns:** ${e.returns}`);
            }
            if (e.notes) {
              parts.push(`**Notes:** ⚠️ ${e.notes}`);
            }
            return parts.join("\n");
          }),
        ];

        return {
          content: [{ type: "text", text: lines.join("\n") }],
        };
      }

      // ── get_endpoint_detail ───────────────────────────────────────────────────
      case "get_endpoint_detail": {
        const { category, path_contains, method } = args as {
          category?: string;
          path_contains: string;
          method?: string;
        };

        const searchPath = path_contains.toLowerCase();
        const results: { cat: ApiCategory; ep: Endpoint }[] = [];

        const cats = category
          ? API_CATEGORIES.filter(
              (c) => c.slug === category.toLowerCase() || c.name.toLowerCase() === category.toLowerCase()
            )
          : API_CATEGORIES;

        for (const cat of cats) {
          for (const ep of cat.endpoints) {
            if (
              ep.path.toLowerCase().includes(searchPath) &&
              (!method || ep.method === method.toUpperCase())
            ) {
              results.push({ cat, ep });
            }
          }
        }

        if (results.length === 0) {
          return {
            content: [{
              type: "text",
              text: `No endpoint found matching "${path_contains}"${method ? ` with method ${method}` : ""}.\n\nTip: Use get_api_endpoints with a category name to browse all endpoints.`,
            }],
          };
        }

        const output = results.slice(0, 5).map(({ cat, ep }) => {
          const parts = [
            `# \`${ep.method} ${ep.path}\``,
            `**Category:** ${cat.name}`,
            `**API Version:** ${ep.version}`,
            `**Full URL:** \`https://api.bigcommerce.com/stores/{store_hash}${ep.path}\``,
            `**Description:** ${ep.description}`,
            `**OAuth Scope Required:** \`${ep.scope ?? "store/default"}\``,
          ];

          if (ep.params) {
            parts.push(
              `\n**Query Parameters:**\n${Object.entries(ep.params)
                .map(([k, v]) => `| \`${k}\` | ${v} |`)
                .join("\n")}`
            );
          }

          if (ep.body) {
            parts.push(
              `\n**Request Body Fields:**\n${Object.entries(ep.body)
                .map(([k, v]) => `| \`${k}\` | ${v} |`)
                .join("\n")}`
            );
          }

          if (ep.returns) {
            parts.push(`\n**Returns:** ${ep.returns}`);
          }

          if (ep.notes) {
            parts.push(`\n**⚠️ Important Notes:** ${ep.notes}`);
          }

          parts.push(`\n**Documentation:** ${cat.docsUrl}`);

          return parts.join("\n");
        });

        return {
          content: [{
            type: "text",
            text: output.join("\n\n---\n\n"),
          }],
        };
      }

      // ── get_webhook_events ────────────────────────────────────────────────────
      case "get_webhook_events": {
        const { category, search } = args as { category?: string; search?: string };
        let events = WEBHOOK_EVENTS;

        if (category) {
          events = events.filter((e) => e.category.toLowerCase() === category.toLowerCase());
        }

        if (search) {
          const s = search.toLowerCase();
          events = events.filter(
            (e) => e.name.toLowerCase().includes(s) || e.description.toLowerCase().includes(s)
          );
        }

        if (events.length === 0) {
          const categories = [...new Set(WEBHOOK_EVENTS.map((e) => e.category))];
          return {
            content: [{
              type: "text",
              text: `No webhook events found.\n\nAvailable categories: ${categories.join(", ")}\nTotal events: ${WEBHOOK_EVENTS.length}`,
            }],
          };
        }

        const grouped: Record<string, typeof events> = {};
        for (const ev of events) {
          grouped[ev.category] = grouped[ev.category] ?? [];
          grouped[ev.category].push(ev);
        }

        const lines = [
          `# BigCommerce Webhook Events (${events.length} shown)`,
          "",
          "**Registration endpoint:** `POST /stores/{store_hash}/v3/hooks`",
          "**Payload always includes:** `store_id`, `producer`, `scope`, `hash`, `data`, `created_at`",
          "",
        ];

        for (const [cat, evs] of Object.entries(grouped)) {
          lines.push(`## ${cat} Events`);
          for (const ev of evs) {
            lines.push(`### \`${ev.scope}\``);
            lines.push(`**Description:** ${ev.description}`);
            lines.push(`**Key Payload Fields:** \`${ev.payloadFields.join("`, `")}\``);
            lines.push("");
          }
        }

        lines.push(`\n**Tip:** Payload contains minimal data (just IDs). Fetch full details via REST API after receiving the event.`);
        lines.push(`**Reliability:** BC retries with exponential backoff. Always respond HTTP 200 within 10 seconds.`);

        return {
          content: [{ type: "text", text: lines.join("\n") }],
        };
      }

      // ── get_oauth_scopes ──────────────────────────────────────────────────────
      case "get_oauth_scopes": {
        const { resource } = args as { resource?: string };
        let scopes = OAUTH_SCOPES;

        if (resource) {
          const r = resource.toLowerCase();
          scopes = scopes.filter(
            (s) =>
              s.name.includes(r) ||
              s.uiName.toLowerCase().includes(r) ||
              s.description.toLowerCase().includes(r) ||
              s.readScope.includes(r) ||
              s.writeScope.includes(r)
          );
        }

        const lines = [
          `# BigCommerce OAuth Scopes Reference`,
          resource ? `*(filtered by: "${resource}")* — ${scopes.length} result(s)` : `*(all ${scopes.length} scopes)*`,
          "",
          "Scopes are set when creating API accounts or configuring apps in the Developer Portal.",
          "Use the **minimum required scopes** for your use case (principle of least privilege).",
          "",
          "| Resource | UI Label | Read Scope | Write Scope | Description |",
          "|---|---|---|---|---|",
          ...scopes.map(
            (s) =>
              `| ${s.name} | ${s.uiName} | \`${s.readScope || "n/a"}\` | \`${s.writeScope || "n/a"}\` | ${s.description} |`
          ),
        ];

        return {
          content: [{ type: "text", text: lines.join("\n") }],
        };
      }

      // ── get_auth_guide ────────────────────────────────────────────────────────
      case "get_auth_guide": {
        const { type } = args as { type: string };
        const sections: string[] = [];

        const addRest = () => {
          const p = AUTH_PATTERNS.restManagement;
          sections.push(`# ${p.name}\n\n${p.description}\n\n**Header:** \`${p.method}\`\n\n**Example Request:**\n\`\`\`\n${p.example}\n\`\`\`\n\n**Notes:**\n${p.notes.map((n) => `- ${n}`).join("\n")}`);
        };
        const addGraphQL = () => {
          const p = AUTH_PATTERNS.storefrontGraphQL;
          sections.push(`# ${p.name}\n\n${p.description}\n\n**Method:** ${p.method}\n\n**Create a Token:**\n\`\`\`json\n${p.tokenCreation}\n\`\`\`\n\n**Notes:**\n${p.notes.map((n) => `- ${n}`).join("\n")}`);
        };
        const addCustomerLogin = () => {
          const p = AUTH_PATTERNS.customerLogin;
          sections.push(`# ${p.name}\n\n${p.description}\n\n**Method:** ${p.method}\n**Algorithm:** ${p.algorithm}\n**Token TTL:** ${p.expiresIn}\n\n**JWT Payload:**\n\`\`\`json\n${p.jwtPayload}\n\`\`\`\n\n**Notes:**\n${p.notes.map((n) => `- ${n}`).join("\n")}`);
        };
        const addOAuth = () => {
          const p = AUTH_PATTERNS.oauthFlow;
          sections.push(`# ${p.name}\n\n${p.description}\n\n**Steps:**\n${p.steps.map((s) => `${s}`).join("\n")}\n\n**Token Endpoint:** \`${p.tokenEndpoint}\`\n\n**Request Body:**\n\`\`\`json\n${p.tokenBody}\n\`\`\``);
        };

        if (type === "rest" || type === "all") addRest();
        if (type === "graphql" || type === "all") addGraphQL();
        if (type === "customer_login" || type === "all") addCustomerLogin();
        if (type === "oauth_app" || type === "all") addOAuth();

        if (sections.length === 0) {
          return {
            content: [{
              type: "text",
              text: "Invalid auth type. Use: rest, graphql, customer_login, oauth_app, or all",
            }],
          };
        }

        return {
          content: [{ type: "text", text: sections.join("\n\n---\n\n") }],
        };
      }

      // ── get_graphql_info ──────────────────────────────────────────────────────
      case "get_graphql_info": {
        const { api = "all", operation_search } = args as {
          api?: string;
          operation_search?: string;
        };

        const apis =
          api === "all"
            ? GRAPHQL_APIS
            : GRAPHQL_APIS.filter((a) => a.name.toLowerCase().includes(api.toLowerCase()));

        if (apis.length === 0) {
          return {
            content: [{
              type: "text",
              text: `No GraphQL API found matching "${api}". Available: storefront, admin, account`,
            }],
          };
        }

        const lines: string[] = [];
        for (const gql of apis) {
          lines.push(`# ${gql.name}`);
          lines.push(`**Description:** ${gql.description}`);
          lines.push(`**Endpoint:** \`${gql.endpoint}\``);
          lines.push(`**Authentication:** ${gql.authMethod}`);
          lines.push("");

          let ops = gql.operations;
          if (operation_search) {
            const s = operation_search.toLowerCase();
            ops = ops.filter(
              (o) => o.name.toLowerCase().includes(s) || o.description.toLowerCase().includes(s)
            );
          }

          lines.push(`**Operations (${ops.length}):**`);
          lines.push("| Type | Name | Description |");
          lines.push("|---|---|---|");
          for (const op of ops) {
            lines.push(`| \`${op.type}\` | \`${op.name}\` | ${op.description} |`);
          }
          lines.push("");
        }

        return {
          content: [{ type: "text", text: lines.join("\n") }],
        };
      }

      // ── get_code_example ─────────────────────────────────────────────────────
      case "get_code_example": {
        const { operation, language = "node" } = args as {
          operation: string;
          language?: "node" | "python" | "php" | "curl";
        };

        // Special cases
        if (operation === "rateLimit") {
          return {
            content: [{
              type: "text",
              text: `# BigCommerce Rate Limit Handler\n\n\`\`\`typescript\n${generateRateLimitHandler()}\n\`\`\``,
            }],
          };
        }

        if (operation === "inventorySync") {
          return {
            content: [{
              type: "text",
              text: `# Bulk Inventory Sync\n\n\`\`\`typescript\n${generateInventorySyncExample()}\n\`\`\``,
            }],
          };
        }

        // GraphQL examples
        const graphqlOps = ["getProduct", "getProductsByCategory", "createCart", "routeQuery", "customerLogin", "webhookSetup", "oauthApp"];
        if (graphqlOps.includes(operation)) {
          const code = generateGraphQLExample(operation);
          return {
            content: [{
              type: "text",
              text: `# ${operation} Example\n\n\`\`\`typescript\n${code}\n\`\`\``,
            }],
          };
        }

        // REST endpoint example: "POST /catalog/products"
        const restMatch = operation.match(/^(GET|POST|PUT|DELETE|PATCH)\s+(.+)/i);
        if (restMatch) {
          const [, method, path] = restMatch;
          const code = generateRestExample(method.toUpperCase(), path, undefined, language as any);
          return {
            content: [{
              type: "text",
              text: `# ${method.toUpperCase()} ${path}\n\n\`\`\`${language === "node" ? "typescript" : language}\n${code}\n\`\`\``,
            }],
          };
        }

        return {
          content: [{
            type: "text",
            text: `Available operations:\n- GraphQL: getProduct, getProductsByCategory, createCart, routeQuery, customerLogin, webhookSetup, oauthApp\n- Special: rateLimit, inventorySync\n- REST: "METHOD /path" e.g. "POST /catalog/products", "GET /orders"\n\nYou specified: "${operation}"`,
          }],
        };
      }

      // ── get_rate_limit_info ───────────────────────────────────────────────────
      case "get_rate_limit_info": {
        const { include_client_code = true } = args as { include_client_code?: boolean };

        const lines = [
          "# BigCommerce API Rate Limits",
          "",
          RATE_LIMITS.description,
          "",
          "## Rate Limit Response Headers",
          "| Header | Description |",
          "|---|---|",
          ...Object.entries(RATE_LIMITS.headers).map(([h, d]) => `| \`${h}\` | ${d} |`),
          "",
          "## Best Practices",
          ...RATE_LIMITS.tips.map((t) => `- ${t}`),
          "",
          "## 429 Handler (Inline)",
          `\`\`\`typescript\n${RATE_LIMITS.handling}\n\`\`\``,
        ];

        if (include_client_code) {
          lines.push("", "## Full Production Client with Pagination");
          lines.push(`\`\`\`typescript\n${generateRateLimitHandler()}\n\`\`\``);
        }

        return {
          content: [{ type: "text", text: lines.join("\n") }],
        };
      }

      // ── get_best_practices ────────────────────────────────────────────────────
      case "get_best_practices": {
        const { topic } = args as { topic: string };

        const topics =
          topic === "all"
            ? Object.keys(BEST_PRACTICES)
            : [topic];

        const lines: string[] = ["# BigCommerce Development Best Practices", ""];
        for (const t of topics) {
          const tips = BEST_PRACTICES[t];
          if (!tips) {
            lines.push(`Topic "${t}" not found. Available: ${Object.keys(BEST_PRACTICES).join(", ")}`);
            continue;
          }
          lines.push(`## ${t.charAt(0).toUpperCase() + t.slice(1)}`);
          for (const tip of tips) {
            lines.push(`- ${tip}`);
          }
          lines.push("");
        }

        return {
          content: [{ type: "text", text: lines.join("\n") }],
        };
      }

      // ── get_error_codes ───────────────────────────────────────────────────────
      case "get_error_codes": {
        const { code } = args as { code?: number };

        if (code) {
          const message = ERROR_CODES[code];
          if (!message) {
            return {
              content: [{
                type: "text",
                text: `HTTP ${code} is not in the BigCommerce error reference.\n\nCommon BC error codes: ${Object.keys(ERROR_CODES).join(", ")}`,
              }],
            };
          }
          return {
            content: [{
              type: "text",
              text: `# HTTP ${code}\n\n**${message}**\n\n${getErrorTroubleshooting(code)}`,
            }],
          };
        }

        const lines = [
          "# BigCommerce API HTTP Status Code Reference",
          "",
          "| Code | Meaning |",
          "|---|---|",
          ...Object.entries(ERROR_CODES).map(([c, m]) => `| **${c}** | ${m} |`),
          "",
          "**Tip:** Error responses include an `errors` array or `title` field with specific field-level validation details.",
          "**Tip:** For 422 errors, always check `errors[].field` to find which input failed validation.",
        ];

        return {
          content: [{ type: "text", text: lines.join("\n") }],
        };
      }

      // ── fetch_live_doc ────────────────────────────────────────────────────────
      case "fetch_live_doc": {
        const { topic } = args as { topic: string };
        const content = await fetchDocPage(topic);

        if (!content) {
          return {
            content: [{
              type: "text",
              text: `Could not fetch documentation for topic "${topic}".\n\nAvailable topics: ${Object.keys(DOC_PAGES).join(", ")}\n\nAlternatively, visit: https://developer.bigcommerce.com/docs directly.`,
            }],
          };
        }

        return {
          content: [{
            type: "text",
            text: `# BigCommerce Docs: ${topic}\n*(Live from developer.bigcommerce.com)*\n\n${content}`,
          }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{
        type: "text",
        text: `Error executing tool "${name}": ${message}`,
      }],
      isError: true,
    };
  }
});

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

function getErrorTroubleshooting(code: number): string {
  const guides: Record<number, string> = {
    400: "Check your request body for missing required fields or incorrect data types. The `errors` array in the response will specify which fields failed.",
    401: "Your X-Auth-Token is missing, expired, or invalid. Regenerate your API credentials in the BC Control Panel or re-run the OAuth flow.",
    403: "Your API account has insufficient OAuth scopes. Add the required scope in the BC Control Panel (for store accounts) or the Developer Portal (for apps).",
    404: "Check that your store_hash is correct and the resource ID exists. Also verify you're using the right API version (v2 vs v3).",
    422: "Validation error. The `errors` array in the response body details which field(s) failed and why. Common causes: duplicate SKU, invalid enum value, missing required nested field.",
    429: "You've hit the rate limit. Check the `X-Rate-Limit-Time-Reset-Ms` header and wait that many milliseconds before retrying. Consider using bulk endpoints to reduce request volume.",
    500: "BigCommerce server error. Retry with exponential backoff (1s, 2s, 4s). If persistent, check the BigCommerce Status page: status.bigcommerce.com",
    503: "BigCommerce is under maintenance or experiencing high load. Retry with exponential backoff. Check status.bigcommerce.com for incidents.",
  };
  return guides[code] ?? "Check the BigCommerce API documentation for this error code.";
}

// ─── START SERVER ─────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("BigCommerce Developer Docs MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
