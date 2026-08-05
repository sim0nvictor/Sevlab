import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl, safeNextPath } from "@/lib/site-url";

/**
 * Behind a proxy (Vercel), the raw request URL origin can be an internal host
 * or plain http, which would produce a broken redirect. Trust the forwarded
 * headers when present, and fall back to the configured site URL.
 */
function resolveBaseUrl(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
    return forwardedProto + "://" + forwardedHost;
  }
  return getSiteUrl();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));
  const baseUrl = resolveBaseUrl(request);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(baseUrl + next);
    }
  }

  return NextResponse.redirect(baseUrl + "/auth/auth-code-error");
}
