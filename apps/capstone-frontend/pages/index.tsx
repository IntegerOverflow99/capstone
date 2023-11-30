import { Container, Button, Typography, TextField, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IUserSessionData } from '@capstone/utils/types';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../lib/session';
import { useRouter } from 'next/router';
import ProfileWidget from '../components/ProfileWidget';
import { useAxios } from '@capstone/utils/general';

// get props for serverside rendering
export const getServerSideProps = withIronSessionSsr(async (context) => {
  const session = context.req.session;
  return {
    props: {
      session,
    },
  };
}, sessionOptions);

/**
 * The login index page - users are forced here by middleware to login before accessing the rest of the site
 * @param props { session: IUserSessionData }
 * @returns React.FC
 */
const SignInPage = (props: { session: any }) => {
  const { session } = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const router = useRouter();
  const axios = useAxios();

  useEffect(() => {
    session?.user && router.push('/search');
  }, [session]);

  const handleSignIn = async () => {
    const res = await axios.post(
      '/api/login',
      {
        username,
        password,
      },
      { baseURL: '', validateStatus: () => true }
    );
    if (res.status == 200) {
      router.push('/search');
    } else {
      setErrMsg('Invalid Credentials! Try again!');
    }
  };

  return (
    <>
      <ProfileWidget session={session} />
      <Container sx={{ p: 2 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Sign In
        </Typography>
        {errMsg && (
          <Typography variant="overline" sx={{ mb: 2, color: 'red' }}>
            {errMsg}
          </Typography>
        )}

        <Stack
          spacing={2}
          direction={{ xs: 'column', md: 'row' }}
          sx={{ mb: 2 }}
        >
          <TextField
            label="Username"
            fullWidth
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleSignIn();
              }
            }}
          />
          <TextField
            label="Password"
            fullWidth
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                handleSignIn();
              }
            }}
          />
        </Stack>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSignIn}
        >
          Sign In
        </Button>
      </Container>
    </>
  );
};

export default SignInPage;
