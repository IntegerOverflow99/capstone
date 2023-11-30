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

type AddUserProps = {
  show: boolean;
  onClose: () => void;
};

const AddUser = (props: AddUserProps) => {
  const { show, onClose } = props;
  const [username, setUsername] = useState<string>('');
  const [allowedVideoRating, setAllowedVideoRating] = useState<IVideoRatings>(
    'G' as any
  );
  const [admin, setAdmin] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const axios = useAxios();
  const router = useRouter();

  const handleAddUser = async () => {
    try {
      const response = await axios.post('/user', {
        username,
        passwordHash: bcrypt.hashSync(password, 10),
        allowedVideoContentRating: allowedVideoRating,
        admin,
      });
      enqueueSnackbar('User added successfully!', {
        variant: 'success',
      });
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (err) {
      const error = err as AxiosError;
      enqueueSnackbar(`HTTP Error addding user: ${error.code}`, {
        variant: 'error',
      });
    }
  };
  return (
    <Modal
      open={show}
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
        <Typography
          variant="h4"
          sx={{
            mb: 2,
          }}
        >
          Add User
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              fullWidth
              label="Allowed Video Rating"
              value={allowedVideoRating}
              onChange={(e) =>
                setAllowedVideoRating(e.target.value as IVideoRatings)
              }
            >
              <MenuItem value="G">G</MenuItem>
              <MenuItem value="PG">PG</MenuItem>
              <MenuItem value="PG-13">PG-13</MenuItem>
              <MenuItem value="R">R</MenuItem>
              <MenuItem value="NC-17">NC-17</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12}>
            <Button fullWidth variant="contained" onClick={handleAddUser}>
              Add User
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" onClick={onClose}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </>
    </Modal>
  );
};

export default AddUser;
