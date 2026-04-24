import { getProtectedRouteDetails } from './lib/premium-routes.js';
import { resolvePremiumRouteAccess } from './lib/premium-route-access.js';

export const config = {
  matcher: [
    '/paths/:path*',
    '/deep-dives/:path*'
  ],
  runtime: 'nodejs'
};

export default async function middleware(request) {
  const url = new URL(request.url);
  const routeDetails = getProtectedRouteDetails(url.pathname);

  if (!routeDetails.protected) {
    return;
  }

  const access = await resolvePremiumRouteAccess(url.pathname, request.headers.get('cookie') || '');
  if (access.allowed) {
    return;
  }

  const redirectUrl = new URL('/membership.html', url);
  redirectUrl.searchParams.set('next', `${url.pathname}${url.search}`);
  return Response.redirect(redirectUrl, 307);
}
