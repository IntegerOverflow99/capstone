import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from './session';

export const getServerSidePropsSession = withIronSessionSsr(async (context) => {
  const session = context.req.session;
  return {
    props: {
      session,
    },
  };
}, sessionOptions);
