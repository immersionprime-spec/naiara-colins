import { createServerClient, type CookieOptions } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

function createSupabaseForMiddleware(request: NextRequest, response: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const isApiAdmin = pathname.startsWith("/api/admin");
  const isAdminApp =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");

  if (isApiAdmin || isAdminApp) {
    let response = NextResponse.next({ request });
    const supabase = createSupabaseForMiddleware(request, response);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const ok =
      !!user?.email &&
      !!adminEmail &&
      user.email.toLowerCase() === adminEmail;

    if (isApiAdmin) {
      if (!ok) {
        return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
      }
      return response;
    }

    if (!ok) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/(pt|es|en)/:path*",
    "/api/admin/:path*",
  ],
};
