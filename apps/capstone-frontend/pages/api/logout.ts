import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from 'apps/capstone-frontend/lib/session';
import { NextApiRequest, NextApiResponse } from 'next';

async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  res.status(200).json({ msg: 'Logged out' });
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions);
