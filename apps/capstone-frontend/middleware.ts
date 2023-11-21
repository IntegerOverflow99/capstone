import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session/edge';
import { sessionOptions } from './lib/session';

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const { user } = await getIronSession(req, res, sessionOptions);

  console.log(req.nextUrl.pathname);

  if (req.nextUrl.pathname === '/') {
    console.log('index page');
    return res;
  } else if (req.nextUrl.pathname.startsWith('/api/login')) {
    console.log('api login');
    return res;
  } else if (req.nextUrl.pathname.startsWith('/api') && !user) {
    console.log('api unauthorized access');
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  } else if (!user && !req.nextUrl.pathname.startsWith('/_next')) {
    console.log('redirecting');
    return NextResponse.redirect(new URL('/', req.url), { status: 302 });
  }

  return res;
};
