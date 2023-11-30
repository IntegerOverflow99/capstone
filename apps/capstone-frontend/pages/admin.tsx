import React, { useState, useEffect } from 'react';
import { getServerSidePropsSession } from '../lib/SessionContext';
import ProfileWidget from '../components/ProfileWidget';
import {
  IUserSessionData,
  IUserJSONModel,
  IAudioUpload,
  IPhotoUpload,
  IVideoUpload,
} from '@capstone/utils/types';
import {
  Box,
  Container,
  Paper,
  Typography,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Table,
  Collapse,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { camelToCapsAndSpaces, useAxios } from '@capstone/utils/general';
import SearchSection from '../components/SearchSection';
import UserAdmin from '../components/UserAdmin';
import MediaAdmin from '../components/MediaAdmin';
import AudioEdit from '../components/forms/AudioEdit';

export const getServerSideProps = getServerSidePropsSession;

const AdminPage = (props: { session: IUserSessionData }) => {
  const { session } = props;
  const axios = useAxios();

  const [users, setUsers] = useState<IUserJSONModel[]>([]);
  const [userSection, setUserSection] = useState(false);
  const [mediaSection, setMediaSection] = useState(true);
  const [selectedUser, setSelectedUser] = useState<IUserJSONModel | null>();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('/user');
      setUsers(response.data);
    };

    fetchUsers();
  }, [axios]);

  return (
    <Box sx={{ flexGrow: 1, p: 5 }}>
      <ProfileWidget session={session} />
      <Container>
        <Paper
          sx={{
            p: 2,
          }}
          elevation={20}
        >
          <Typography
            variant="h4"
            sx={{
              backgroundColor: '#aaaacc',
              mb: 2,
              ':hover': (theme) => {
                return {
                  color: '#2200CC',
                  cursor: 'pointer',
                };
              },
            }}
            onClick={() => {
              setUserSection(!userSection);
            }}
          >
            {
              //unicode right triangle if userSection is false, down triangle if true
              userSection ? '\u25BC' : '\u25B6'
            }
            User Administration
          </Typography>
          <UserAdmin show={userSection} users={users} />
          <Typography
            variant="h4"
            sx={{
              backgroundColor: '#aaaacc',
              ':hover': (theme) => {
                return {
                  color: '#2200CC',
                  cursor: 'pointer',
                };
              },
            }}
            onClick={() => {
              setMediaSection(!mediaSection);
            }}
          >
            {
              //unicode right triangle if userSection is false, down triangle if true
              mediaSection ? '\u25BC' : '\u25B6'
            }
            Media Administration
          </Typography>
          <MediaAdmin show={mediaSection} />
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminPage;
