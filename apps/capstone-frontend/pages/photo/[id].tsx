import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IPhotoJSONModel, IUserSessionData } from '@capstone/utils/types';
import { useAxios } from '@capstone/utils/general';
import {
  Box,
  Button,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import { getServerSidePropsSession } from '../../lib/SessionContext';
import ProfileWidget from '../../components/ProfileWidget';

export const getServerSideProps = getServerSidePropsSession;

const PhotoViewPage = (props: { session: IUserSessionData }) => {
  const { session } = props;
  const router = useRouter();
  const axios = useAxios();
  const [photo, setPhoto] = useState<IPhotoJSONModel>();
  const { id } = router.query;

  //add to the browser local storage to keep track of the most recently viewed media (we care about MEDIA id here)
  //this will be used to populate the "recently viewed" section on the home page
  //use video.media.id to get the media id

  useEffect(() => {
    const fetchImg = async () => {
      if (!id) return;
      const response = await axios.get(`/photo/${id}`);
      setPhoto(response.data);
      // save to local storage
      const recent = localStorage.getItem('recent');
      if (recent) {
        const recentArr = JSON.parse(recent);
        if (recentArr.length === 15) {
          recentArr.pop();
        }
        recentArr.unshift(response.data.media.id);
        localStorage.setItem('recent', JSON.stringify(recentArr));
      } else {
        localStorage.setItem(
          'recent',
          JSON.stringify([response.data.media.id])
        );
      }
    };

    fetchImg();
  }, [axios, id]);

  return (
    <Box>
      <ProfileWidget session={session} />
      <Grid container spacing={2}>
        <Grid item md={9} sm={12}>
          <Stack spacing={0}>
            <Box sx={{ outline: 'solid', m: 0.5, p: 1 }}>
              {photo?.media?.id ? (
                <img
                  src={
                    process.env['NODE_ENV'] !== 'production'
                      ? `http://localhost:4200/api/media/${photo?.media.id}`
                      : `https://capstonemediaserver.ca/api/media/${photo?.media.id}`
                  }
                />
              ) : (
                <Skeleton variant="rectangular" width="100%" height={400} />
              )}
            </Box>
            <Box sx={{ outline: 'solid', m: 0.5, p: 1 }}>
              <Typography variant="h5">
                <em>Description</em> - {photo?.description}
              </Typography>
            </Box>
            <Stack spacing={1} sx={{ outline: 'solid', m: 0.5, p: 1 }}>
              <Typography variant="body1">Taken On - {photo?.taken}</Typography>
              <Divider />
              <Typography variant="body1">
                <em>Uploaded</em> - {photo?.uploaded}
              </Typography>
              <Divider />
              <Typography variant="body1">
                <em>Resolution</em> - {photo?.height}x{photo?.width}
              </Typography>
            </Stack>
            <Box sx={{ outline: 'solid', m: 0.5, p: 1 }}>
              <Typography variant="body1">Tags here</Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid item md={3} sm={12}>
          <Box sx={{ outline: 'solid', m: 0.5 }}>
            <Stack spacing={1} sx={{ p: 2 }}>
              <Button variant="outlined" startIcon={<StarOutlineIcon />}>
                Favorite
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PhotoViewPage;
