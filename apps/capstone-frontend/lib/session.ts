import { IUserSessionData } from '@capstone/utils/types';
import type { IronSessionOptions } from 'iron-session';

export const sessionOptions: IronSessionOptions = {
  cookieName: 'capstone-session',
  password: 'default-dev-password-please-change-me', //TODO: change this to something more secure in env
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

declare module 'iron-session' {
  interface IronSessionData {
    user?: IUserSessionData;
  }
}
