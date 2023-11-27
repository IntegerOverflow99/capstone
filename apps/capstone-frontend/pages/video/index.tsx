import { IUserSessionData, IVideoJSONModel } from '@capstone/utils/types';
import { Box, Container, Paper, Typography } from '@mui/material';
import React, { useState, useEffect, useMemo } from 'react';
import SearchSection from '../../components/SearchSection';
import { useAxios } from '@capstone/utils/general';
import { getServerSidePropsSession } from '../../lib/SessionContext';
import ProfileWidget from '../../components/ProfileWidget';

export const getServerSideProps = getServerSidePropsSession;

const VideoIndex = (props: { session: IUserSessionData }) => {
  const { session } = props;
  const [data, setData] = useState<IVideoJSONModel[]>([]);
  const axios = useAxios();

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get('/video');
      setData(
        res.data.map((video: IVideoJSONModel) => {
          const out: any = { ...video, ...video.media };
          delete out.media;
          return out;
        })
      );
    };

    fetchVideos();
  }, [axios]);

  return (
    <Box sx={{ flexGrow: 1, p: 5 }}>
      <ProfileWidget session={session} />
      <Container>
        <Paper sx={{ p: 2 }} elevation={20}>
          <Typography variant="h2">Videos</Typography>
          <SearchSection data={data} navigatesTo={'video'} />
        </Paper>
      </Container>
    </Box>
  );
};

export default VideoIndex;
