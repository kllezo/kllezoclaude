/* ============================================================
   Experience routing.
   · `/` — returning visitors with a remembered experience go
     straight to it. `/?choose` always shows the selection screen.
   · `/creative/**`, `/business/**` — remember the experience the
     visitor is in (cookie, 1 year).
   · Shared URLs (`/services/*`, `/work`, `/about`, `/contact`)
     render inside the remembered experience (default Business)
     via a rewrite, so links like /services/ai-calling always work.
     The rendered pages declare the experience URL as canonical.
   ============================================================ */

import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "kllezo_experience";
const YEAR = 60 * 60 * 24 * 365;
const SHARED = /^\/(services(\/[a-z0-9-]+)?|work|about|contact)\/?$/;

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const remembered = request.cookies.get(COOKIE)?.value;
  const exp = remembered === "creative" || remembered === "business" ? remembered : null;

  if (pathname === "/") {
    if (exp && !searchParams.has("choose")) {
      const url = request.nextUrl.clone();
      url.pathname = `/${exp}`;
      url.search = "";
      return NextResponse.redirect(url, 307);
    }
    return NextResponse.next();
  }

  const top = pathname.split("/")[1];
  if (top === "creative" || top === "business") {
    const res = NextResponse.next();
    if (exp !== top) res.cookies.set(COOKIE, top, { path: "/", maxAge: YEAR, sameSite: "lax" });
    return res;
  }

  if (SHARED.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${exp ?? "business"}${pathname.replace(/\/$/, "")}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/creative/:path*", "/business/:path*", "/services/:path*", "/work", "/about", "/contact"],
};
