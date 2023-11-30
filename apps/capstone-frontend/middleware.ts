import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session/edge';
import { sessionOptions } from './lib/session';

/**
 * Filters requests to the app by checking the session ensuring authorization when navigating the site pages, and requesting data from the API.
 * @param req The incoming request
 * @returns The response to the request
 */
export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const { user } = await getIronSession(req, res, sessionOptions);

  if (req.nextUrl.pathname === '/') {
    return res;
  } else if (req.nextUrl.pathname.startsWith('/api/login')) {
    return res;
  } else if (
    req.nextUrl.pathname.startsWith('/api/admin') &&
    user?.user?.admin !== true
  ) {
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  } else if (req.nextUrl.pathname.startsWith('/api') && !user) {
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  } else if (
    req.nextUrl.pathname.startsWith('/admin') &&
    user?.user?.admin === false
  ) {
    return NextResponse.redirect(new URL('/', req.url), {
      status: 302,
    });
  } else if (!user && !req.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.redirect(new URL('/', req.url), { status: 302 });
  }

  return res;
};
