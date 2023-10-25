import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IVideoJSONModel } from '@capstone/utils/types';
import { useAxios } from '@capstone/utils/general';
import {
  Box,
  Button,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import LiveTvIcon from '@mui/icons-material/LiveTv';

const VideoViewPage = () => {
  const router = useRouter();
  const axios = useAxios();
  const [video, setVideo] = useState<IVideoJSONModel>();
  const { id } = router.query;

  useEffect(() => {
    const fetchVideo = async () => {
      console.log(id);
      if (!id) return;
      const response = await axios.get(`/video/${id}`);
      setVideo(response.data);
    };

    fetchVideo();
  }, [axios, id]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item md={3}>
          <Box sx={{ outline: 'solid', m: 0.5 }}>
            <Stack spacing={1} sx={{ p: 2 }}>
              <Skeleton variant="rectangular" height={500} />
              <Button variant="outlined" startIcon={<StarOutlineIcon />}>
                Favorite
              </Button>
              <Button variant="outlined" startIcon={<CloudDownloadIcon />}>
                Download
              </Button>
              <Button variant="outlined" startIcon={<LiveTvIcon />}>
                Stream
              </Button>
            </Stack>
          </Box>
        </Grid>
        <Grid item md={6}>
          <Stack spacing={0}>
            <Box sx={{ outline: 'solid', m: 0.5, p: 1 }}>
              <Typography variant="h4">
                <strong>{video?.title}</strong>
              </Typography>
            </Box>
            <Box sx={{ outline: 'solid', m: 0.5, p: 1 }}>
              <Typography variant="h5">{video?.description}</Typography>
            </Box>
            <Stack spacing={1} sx={{ outline: 'solid', m: 0.5, p: 1 }}>
              <Typography variant="body1">Genres - {video?.genres}</Typography>
              <Divider />
              <Typography variant="body1">
                Year - {video?.release_year}
              </Typography>
              <Divider />
              {/* TODO: Rating - {video?.rating}  */}
              <Typography variant="body1">
                Runtime - {video?.runtime}
              </Typography>
              <Divider />
              <Typography variant="body1">
                Resolution - {video?.width}x{video?.height}
              </Typography>
            </Stack>
            <Box sx={{ outline: 'solid', m: 0.5, p: 1 }}>
              <Typography variant="body1">Tags here</Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid item md={3}>
          <Stack spacing={0}>
            <Box sx={{ outline: 'solid', m: 0.5, p: 1 }}>
              <Typography variant="h4">
                <strong>Reviews</strong>
              </Typography>
            </Box>
            <Box sx={{ outline: 'solid', m: 0.5, p: 1 }}>
              {/* //TODO: review api data */}
              <Typography variant="body2">{video?.description}</Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoViewPage;
