import { useAxios } from '@capstone/utils/general';
import { IUserSessionData } from '@capstone/utils/types';
import { Button, Card, Popover, Stack, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

type ProfileModalProps = {
  open: boolean;
  session: IUserSessionData;
  anchorEl?: HTMLElement | null;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
  };
  onClose?: () => void;
};

const ProfileModal = (props: ProfileModalProps) => {
  const { open, session, anchorEl, anchorOrigin, onClose } = props;
  const axios = useAxios();
  const router = useRouter();
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      sx={{ zIndex: 100000 }}
      anchorOrigin={anchorOrigin}
      onClose={onClose}
    >
      <Card sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography variant="overline">
            <strong>User Info</strong>
          </Typography>
        </Box>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent={'space-between'} spacing={6}>
            <Typography variant="body1">
              <em>User:</em>
            </Typography>
            <Typography variant="body1">{session?.user?.username}</Typography>
          </Stack>
          <Stack direction="row" justifyContent={'space-between'} spacing={6}>
            <Typography variant="body1">
              <em>Rating Limit:</em>
            </Typography>
            <Typography variant="body1">
              {session?.user?.allowedVideoContentRating}
            </Typography>
          </Stack>
          <Button onClick={() => console.log(session)} variant="contained">
            Admin Page
          </Button>
          <Button
            onClick={async () => {
              await axios.post('/api/logout', {}, { baseURL: '' });
              router.reload();
            }}
            variant="contained"
          >
            Log Out
          </Button>
        </Stack>
      </Card>
    </Popover>
  );
};

export default ProfileModal;
