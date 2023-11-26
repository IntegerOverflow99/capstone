import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session/edge';
import { sessionOptions } from './lib/session';

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next();
  const { user } = await getIronSession(req, res, sessionOptions);

  // console.log(req.nextUrl.pathname);

  if (req.nextUrl.pathname === '/') {
    return res;
  } else if (req.nextUrl.pathname.startsWith('/api/login')) {
    return res;
  } else if (req.nextUrl.pathname.startsWith('/api') && !user) {
    return NextResponse.json({ msg: 'Unauthorized' }, { status: 401 });
  } else if (!user && !req.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.redirect(new URL('/', req.url), { status: 302 });
  }

  return res;
};
