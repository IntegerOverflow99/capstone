import { IAudioJSONModel, IUserSessionData } from '@capstone/utils/types';
import { Box, Container, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SearchSection from '../../components/SearchSection';
import { useAxios } from '@capstone/utils/general';
import { getServerSidePropsSession } from '../../lib/SessionContext';
import ProfileWidget from '../../components/ProfileWidget';

// get props for serverside rendering
export const getServerSideProps = getServerSidePropsSession;

/**
 * The Audio Index Page - allows for searching and filtering of audio files, and viewing of metadata
 * @param props { session: IUserSessionData }
 * @returns React.FC
 */
const AudioIndex = (props: { session: IUserSessionData }) => {
  const { session } = props;
  const [data, setData] = useState<IAudioJSONModel[]>([]);
  const axios = useAxios();

  useEffect(() => {
    const fetchAudios = async () => {
      const res = await axios.get('/audio');
      setData(
        res.data.map((audio: IAudioJSONModel) => {
          const out: any = { ...audio, ...audio.media, id: audio.id };
          delete out.media;
          return out;
        })
      );
    };

    fetchAudios();
  }, [axios]);

  return (
    <Box sx={{ flexGrow: 1, p: 5 }}>
      <ProfileWidget session={session} />
      <Container>
        <Paper sx={{ p: 2 }} elevation={20}>
          <Typography variant="h2">Audios</Typography>
          <SearchSection data={data} navigatesTo={'audio'} />
        </Paper>
      </Container>
    </Box>
  );
};

export default AudioIndex;
