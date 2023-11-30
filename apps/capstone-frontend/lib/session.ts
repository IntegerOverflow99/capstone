import { IUserSessionData } from '@capstone/utils/types';
import type { IronSessionOptions } from 'iron-session';

/**
 * Session Options - used to configure the session middleware, which is used to store user data
 */
export const sessionOptions: IronSessionOptions = {
  cookieName: 'capstone-session',
  password:
    'FQAwjcr2yZLX3Igbm/ZmWMxZSO751qUCPLuIt+WiTYt3KZGXFji5eDAnc/pmHUK8kwmq/5bsp6WXX2+lOT7yoQ==',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

/**
 * Extend the IronSessionData interface to include our user data
 */
declare module 'iron-session' {
  interface IronSessionData {
    user?: IUserSessionData;
  }
}
