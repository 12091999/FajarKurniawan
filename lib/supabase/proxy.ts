
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  const isProtectedAdminRoute =
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/login"

  if (!supabaseUrl || !supabaseKey) {
    if (!isProtectedAdminRoute) {
      return NextResponse.next({ request })
    }

    return redirectToLogin(request, "configuration")
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });

          Object.entries(headers).forEach(([key, value]) => {
            supabaseResponse.headers.set(key, value);
          });
        },
      },
    }
  );

  if (isProtectedAdminRoute) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return redirectToLogin(request, "unauthorized", supabaseResponse)
    }

    const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin")

    if (adminError || isAdmin !== true) {
      return redirectToLogin(request, "unauthorized", supabaseResponse)
    }
  } else {
    await supabase.auth.getClaims()
  }

  return supabaseResponse;
}

function redirectToLogin(
  request: NextRequest,
  reason: "configuration" | "unauthorized",
  previousResponse?: NextResponse,
) {
  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = "/admin/login"
  loginUrl.search = ""
  loginUrl.searchParams.set("error", reason)

  const response = NextResponse.redirect(loginUrl)

  previousResponse?.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie)
  })

  return response
}

