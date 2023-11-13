import { IAudioJSONModel } from '@capstone/utils/types';
import { Box, Container, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SearchSection from '../../components/SearchSection';
import { useAxios } from '@capstone/utils/general';

const AudioIndex = () => {
  const [data, setData] = useState<IAudioJSONModel[]>([]);
  const axios = useAxios();

  useEffect(() => {
    const fetchAudios = async () => {
      const res = await axios.get('/audio');
      setData(
        res.data.map((audio: IAudioJSONModel) => {
          const out: any = { ...audio, ...audio.media };
          delete out.media;
          return out;
        })
      );
    };

    fetchAudios();
  }, [axios]);

  return (
    <Box sx={{ flexGrow: 1, p: 5 }}>
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
