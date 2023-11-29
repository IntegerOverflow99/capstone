import React, { useEffect, useState } from 'react';
import {
  Modal,
  Typography,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useAxios } from '@capstone/utils/general';
import { enqueueSnackbar } from 'notistack';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { IUserJSONModel, IVideoRatings } from '@capstone/utils/types';
import bcrypt from 'bcryptjs';

type UserEditProps = {
  open: boolean;
  onClose: () => void;
  row?: IUserJSONModel;
};

const UserEdit = (props: UserEditProps) => {
  const { open, onClose, row } = props;
  const [username, setUsername] = useState<string>(row?.username || '');
  const [allowedVideoRating, setAllowedVideoRating] = useState<IVideoRatings>(
    (row?.allowedVideoContentRating as IVideoRatings) || 'E'
  );
  const [admin, setAdmin] = useState<boolean>(row?.admin || false);
  const [password, setPassword] = useState<string>('');
  const axios = useAxios();
  const router = useRouter();

  useEffect(() => {
    setUsername(row?.username || '');
    setAllowedVideoRating(
      (row?.allowedVideoContentRating as IVideoRatings) || 'E'
    );
    setAdmin(row?.admin || false);
  }, [row]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        margin: 0,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: '10px',
      }}
    >
      <>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Edit User
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <Select
              label="Allowed Video Rating"
              variant="outlined"
              fullWidth
              value={allowedVideoRating}
              onChange={(e) =>
                setAllowedVideoRating(e.target.value as IVideoRatings)
              }
            >
              <MenuItem value="E">E</MenuItem>
              <MenuItem value="PG">PG</MenuItem>
              <MenuItem value="PG-13">PG-13</MenuItem>
              <MenuItem value="R">R</MenuItem>
              <MenuItem value="NC-17">NC-17</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              helperText="Leave blank to keep current password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={admin}
                  onChange={(e) => setAdmin(e.target.checked)}
                />
              }
              label="Admin"
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={async () => {
                if (!row) return;
                const passwordHash = password ? bcrypt.hashSync(password) : '';
                try {
                  let output;
                  if (passwordHash) {
                    output = {
                      username: username,
                      allowed_video_content_rating: allowedVideoRating,
                      admin: admin,
                      passwordHash: passwordHash,
                    };
                  } else {
                    output = {
                      username: username,
                      allowed_video_content_rating: allowedVideoRating,
                      admin: admin,
                    };
                  }
                  await axios.put(`/user/${row.id}`, output);
                } catch (err) {
                  enqueueSnackbar(
                    `Error updating user! HTTP: ${(err as AxiosError).status}`,
                    { variant: 'error' }
                  );
                }
                router.refresh();
              }}
            >
              Save
            </Button>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={async () => {
                if (!row) return;
                try {
                  await axios.delete(`/user/${row.id}`);
                } catch (err) {
                  enqueueSnackbar(
                    `Error deleting user! HTTP: ${(err as AxiosError).status}`,
                    { variant: 'error' }
                  );
                }
                router.refresh();
              }}
            >
              Delete
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={onClose}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </>
    </Modal>
  );
};

export default UserEdit;
