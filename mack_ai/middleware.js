// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';

// const isProtectedRoute= createRouteMatcher([
//   "/dashboard(.*)",
//   "/resume(.*)",
//   "/interview-preps(.*)",
//   "/cover-letter(.*)",
//   "/onboarding(.*)",
// ]);

// export default clerkMiddleware(async(auth, req)=>{
//   const {userID} = await auth();
//   if(!userID && isProtectedRoute(req)){
//     const{redirectToSignIn} = await auth();
//     return redirectToSignIn();
//   }

//   return NextResponse.next();
// });



// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/public(.*)',
]);

// Define routes that should be accessible after sign-in (even without DB user)
const isAuthRequiredRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/onboarding',
  '/resume(.*)',
  '/interview-preps(.*)',
  '/cover-letter(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow all public routes
  if (isPublicRoute(req)) {
    return;
  }
  
  // Protect auth-required routes
  if (isAuthRequiredRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|.*\\..*).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};