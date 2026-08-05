const HTTPS_PREFIX = "https://";
const LOCAL_DEV_URL = "http://localhost:3000";

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

/**
 * Resolves the canonical public URL of the app, without a trailing slash.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL - set this to https://sevlabx.xyz in production.
 *   2. VERCEL_PROJECT_PRODUCTION_URL - the project's production domain.
 *   3. VERCEL_URL - the current deployment URL (preview deploys).
 *   4. localhost, for local development only.
 *
 * NOTE: NEXT_PUBLIC_* values are inlined at build time, so changing
 * NEXT_PUBLIC_SITE_URL in Vercel requires a redeploy to take effect.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return stripTrailingSlash(explicit);

  const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (productionUrl) return HTTPS_PREFIX + stripTrailingSlash(productionUrl);

  const deploymentUrl = process.env.VERCEL_URL;
  if (deploymentUrl) return HTTPS_PREFIX + stripTrailingSlash(deploymentUrl);

  return LOCAL_DEV_URL;
}

/**
 * Builds an absolute auth callback URL, e.g. https://sevlabx.xyz/auth/callback
 */
export function getAuthCallbackUrl(next?: string): string {
  const callback = getSiteUrl() + "/auth/callback";
  if (!next) return callback;
  return callback + "?next=" + encodeURIComponent(next);
}

/**
 * Only allow same-origin relative paths, so `?next=` cannot be abused as an
 * open redirect to an attacker-controlled host.
 */
export function safeNextPath(
  next: string | null | undefined,
  fallback = "/home",
): string {
  if (!next) return fallback;
  if (!next.startsWith("/")) return fallback;
  // Protocol-relative URLs like //evil.com are absolute in browsers.
  if (next.startsWith("//")) return fallback;
  return next;
}
