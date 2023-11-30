import { IUserSessionData } from '@capstone/utils/types';
import React from 'react';
import { Card, IconButton, Stack, Theme, Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useAxios } from '@capstone/utils/general';
import ProfileModal from './ProfileModal';
import { useRouter } from 'next/router';

/**
 * Props for the ProfileWidget component
 */
type ProfileWidgetProps = {
  session: IUserSessionData;
};

/**
 * Widget that displays the user's username and profile picture, exists everywhere onsite
 * @param props ProfileWidgetProps
 * @returns React.FC
 */
const ProfileWidget = (props: ProfileWidgetProps) => {
  const { session } = props;
  const axios = useAxios();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const router = useRouter();

  return (
    <Card
      sx={{
        //pin to the very top right corner of the screen
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: 10000,
        m: 1,
      }}
      onClick={(e) => {
        if (session?.user) {
          setOpen(!open);
          setAnchorEl(e.currentTarget);
        } else {
          router.push('/');
        }
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center' }}>
        <Typography
          variant="h6"
          sx={{ m: 1 }}
          color="text.secondary"
          display={{ xs: 'none', sm: 'none', md: 'block' }}
        >
          {session?.user?.username || 'Click to Log In'}
        </Typography>
        <IconButton>
          <AccountCircle fontSize="large" />
        </IconButton>
      </Stack>
      <ProfileModal
        open={open}
        session={session}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={() => {
          setOpen(false);
          setAnchorEl(null);
        }}
      />
    </Card>
  );
};

export default ProfileWidget;
