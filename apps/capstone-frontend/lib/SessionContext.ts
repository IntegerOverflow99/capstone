import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from './session';

/**
 * This function is a quick drop in replacement for manually writing the serverside rendering function on each page that needs session access (all of them.)
 */
export const getServerSidePropsSession = withIronSessionSsr(async (context) => {
  const session = context.req.session;
  return {
    props: {
      session,
    },
  };
}, sessionOptions);
