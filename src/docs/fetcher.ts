/**
 * Live documentation fetcher for BigCommerce Developer Center.
 * Fetches and parses actual documentation pages to supplement the knowledge base.
 */

const DOC_BASE = "https://developer.bigcommerce.com";

// Map of topic slugs to their doc URLs
export const DOC_PAGES: Record<string, string> = {
  // Getting started
  "quickstart":          "/api-docs/getting-started/making-requests",
  "about-api":           "/api-docs/getting-started/about-our-api",
  "best-practices":      "/docs/start/best-practices",
  "authentication":      "/docs/start/authentication",
  "api-accounts":        "/docs/start/authentication/api-accounts",
  "oauth-scopes":        "/docs/start/authentication/api-accounts#oauth-scopes",

  // REST APIs
  "catalog":             "/docs/rest-catalog",
  "orders":              "/docs/rest-management/orders",
  "customers":           "/docs/rest-management/customers",
  "cart":                "/docs/rest-storefront/carts",
  "checkouts":           "/docs/rest-storefront/checkouts",
  "channels":            "/docs/rest-management/channels",
  "shipping":            "/docs/rest-management/shipping-v2",
  "payments":            "/docs/rest-payments",
  "inventory":           "/docs/rest-management/inventory",
  "pricelists":          "/docs/rest-management/price-lists",
  "promotions":          "/docs/rest-management/promotions",
  "themes":              "/docs/rest-management/themes",
  "scripts":             "/docs/integrations/scripts",
  "store-info":          "/docs/rest-management/store-information",
  "settings":            "/docs/rest-management/settings",
  "tax":                 "/docs/rest-management/tax",
  "wishlists":           "/docs/rest-management/wishlists",
  "subscribers":         "/docs/rest-management/subscribers",
  "pages":               "/docs/rest-content",
  "redirects":           "/docs/rest-content/redirects",
  "reviews":             "/docs/rest-catalog/products/reviews",
  "gift-certificates":   "/docs/rest-management/marketing",
  "coupons":             "/docs/rest-management/marketing",

  // GraphQL
  "graphql-storefront":  "/docs/storefront/graphql",
  "graphql-admin":       "/docs/graphql-admin",
  "graphql-account":     "/docs/graphql-account",
  "graphql-pagination":  "/docs/storefront/graphql/graphql-storefront-api-overview#pagination",

  // Integrations
  "webhooks":            "/docs/integrations/webhooks",
  "webhook-events":      "/docs/integrations/webhooks/events",
  "app-guide":           "/docs/integrations/apps",
  "app-callbacks":       "/docs/integrations/apps/guide/callbacks",
  "embedded-checkout":   "/docs/storefront/headless/embedded-checkout",
  "customer-login":      "/docs/rest-authentication/customer-login",
  "current-customer":    "/docs/rest-authentication/current-customer",

  // Storefront
  "stencil":             "/docs/storefront/stencil/start",
  "stencil-templates":   "/docs/storefront/stencil/templating-toolkit",
  "stencil-cli":         "/docs/storefront/stencil/cli/install",
  "catalyst":            "/docs/storefront/headless/catalyst",
  "headless":            "/docs/storefront/headless",
  "storefront-tokens":   "/docs/rest-authentication/storefront-jwt",

  // Apps & Dev Portal
  "dev-portal":          "/docs/integrations/apps/guide/developer-portal",
  "app-types":           "/docs/integrations/apps/guide/types",
  "app-installation":    "/docs/integrations/apps/guide/installation",
};

/**
 * Fetches a documentation page from BigCommerce Developer Center.
 * Returns the markdown/text content for use in MCP responses.
 */
export async function fetchDocPage(slug: string): Promise<string | null> {
  const path = DOC_PAGES[slug];
  if (!path) return null;

  const url = `${DOC_BASE}${path}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "BigCommerce-MCP-Server/1.0 (developer-docs-assistant)",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return null;

    const html = await res.text();
    return extractTextFromHtml(html);
  } catch {
    return null;
  }
}

/**
 * Simple HTML text extractor — strips tags and cleans whitespace.
 */
function extractTextFromHtml(html: string): string {
  // Remove script, style, nav, header, footer blocks
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "");

  // Convert headers to markdown-style
  text = text
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n# $1\n")
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n## $1\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n### $1\n")
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, "\n#### $1\n")
    .replace(/<li[^>]*>(.*?)<\/li>/gi, "\n- $1")
    .replace(/<p[^>]*>(.*?)<\/p>/gi, "\n$1\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`")
    .replace(/<pre[^>]*>(.*?)<\/pre>/gis, "\n```\n$1\n```\n")
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "$2 ($1)")
    .replace(/<[^>]+>/g, ""); // Strip remaining tags

  // Decode HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Clean up whitespace
  text = text
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Truncate to reasonable size for MCP context
  if (text.length > 8000) {
    text = text.slice(0, 8000) + "\n\n[...truncated — visit the full doc for more]";
  }

  return text;
}
