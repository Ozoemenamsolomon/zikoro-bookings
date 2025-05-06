import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";


const includedPaths:string[] = [

]

export const updateSession = async (request: NextRequest) => { 

  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );
  
    const path = request.nextUrl.pathname;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    
    // Check if the request path starts with /workspace
    if (path.startsWith("/ws") && !user ) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirectedFrom", path);
      return NextResponse.redirect(redirectUrl);
    }
    

    // Check if the request path is included in the protected paths
    const isIncludedPath = includedPaths.some((includedPath) =>
      path.startsWith(includedPath)
    );
  
    if (isIncludedPath && !user) {
      // If user is not authenticated and path is included, redirect to the login page
      if (path.startsWith("/api")) {
        return NextResponse.json(
          { error: "Authorization failed" }, 
          { status: 403 }
        );
      } else {
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("redirectedFrom", path);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // TODO: Apply protection when user from users table is null or without referal code.
    // AVOID THIS, IT WILL INCREASE THE LOADING TIME, RATHER ADD IT TO THE GLOBAL CONTEXT, WHERE USER ALREADY EXIST IN useUSERSTORE
    // const {data:userData,error} = await supabase.from('users').select('*').eq('userEmail',user?.email).single()
    // if(!userData?.referralCode){
    //   const redirectUrl = new URL(`/onboarding?email=${userData?.userEmail}&createdAt=${userData?.created_at}`, request.url);
    //   redirectUrl.searchParams.set("redirectedFrom", path);
    //   return NextResponse.redirect(redirectUrl);
    // }

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
