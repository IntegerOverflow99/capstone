import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from 'apps/capstone-frontend/lib/session';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Handles logout attempts - destroys the session and returns a 200.
 * @param req the incoming HTTP request
 * @param res the outgoing HTTP response
 */
async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  res.status(200).json({ msg: 'Logged out' });
}

export default withIronSessionApiRoute(logoutRoute, sessionOptions);
