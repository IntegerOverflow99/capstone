import { IUserSessionData, IVideoJSONModel } from '@capstone/utils/types';
import { Box, Container, Paper, Typography } from '@mui/material';
import React, { useState, useEffect, useMemo } from 'react';
import SearchSection from '../../components/SearchSection';
import { useAxios } from '@capstone/utils/general';
import { getServerSidePropsSession } from '../../lib/SessionContext';
import ProfileWidget from '../../components/ProfileWidget';

// get props for serverside rendering
export const getServerSideProps = getServerSidePropsSession;

/**
 * Video Index Page - allows for searching and filtering of video files
 * @param props { session: IUserSessionData }
 * @returns React.FC
 */
const VideoIndex = (props: { session: IUserSessionData }) => {
  const { session } = props;
  const [data, setData] = useState<IVideoJSONModel[]>([]);
  const axios = useAxios();

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get('/video');
      setData(
        res.data
          .map((video: IVideoJSONModel) => {
            const out: any = { ...video, ...video.media };
            delete out.media;
            return out;
          })
          .filter((video: IVideoJSONModel) => {
            // ensure the video is below the users allowed video content rating
            switch (session.user!.allowedVideoContentRating) {
              case 'R':
                return true;
              case 'NC-17':
                return video.rating !== 'R';
              case 'PG-13':
                return video.rating !== 'R' && video.rating !== 'NC-17';
              case 'PG':
                return video.rating === 'PG' || video.rating === 'G';
              case 'G':
                return video.rating === 'G';
            }
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
