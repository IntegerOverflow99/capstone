import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { IUserJSONModel, IUserSessionData } from '@capstone/utils/types';
import { sessionOptions } from 'apps/capstone-frontend/lib/session';
import bcrypt from 'bcrypt';

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = await req.body;
  const URL = `http://localhost:3000/user/${username}`;
  const response = await axios.get(URL);

  const userData = response.data as IUserJSONModel & { passwordHash: string };

  const match = await bcrypt.compare(password, userData.passwordHash);
  const sessionData: any = response.data;
  delete sessionData.passwordHash;

  if (match) {
    req.session.user = sessionData as IUserSessionData;
    await req.session.save();
    res.status(200).json({ msg: 'Logged in' });
  } else {
    res.status(401).json({ msg: 'Invalid credentials' });
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
