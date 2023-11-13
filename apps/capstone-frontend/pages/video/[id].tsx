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
  Tooltip,
  Typography,
} from '@mui/material';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import { enqueueSnackbar } from 'notistack';

const VideoViewPage = () => {
  const router = useRouter();
  const axios = useAxios();
  const [video, setVideo] = useState<IVideoJSONModel>();
  const { id } = router.query;

  //add to the browser local storage to keep track of the most recently viewed media (we care about MEDIA id here)
  //this will be used to populate the "recently viewed" section on the home page
  //use video.media.id to get the media id

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;
      const response = await axios.get(`/video/${id}`);
      setVideo(response.data);
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

    fetchVideo();
  }, [axios, id]);

  const handleClick = async () => {
    if (!video?.media.fileLocation) {
      enqueueSnackbar('No file available. Contact admin.', {
        variant: 'error',
      });
      return;
    }

    try {
      const response = await axios.get(`/media/${video?.media.id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${video?.title}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error downloading file. Please try again later.', {
        variant: 'error',
      });
    }
  };

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
              <Button
                variant="outlined"
                startIcon={<CloudDownloadIcon />}
                onClick={handleClick}
              >
                Download
              </Button>
              <Button variant="outlined" startIcon={<LiveTvIcon />} disabled>
                Stream
              </Button>
            </Stack>
          </Box>
        </Grid>
        <Grid item md={6}>
          <Stack spacing={0}>
            <Box sx={{ outline: 'solid', m: 0.5, p: 1 }}>
              <Typography variant="h4">
                <em>
                  <strong>{video?.title}</strong>
                </em>
              </Typography>
            </Box>
            <Box sx={{ outline: 'solid', m: 0.5, p: 1 }}>
              <Typography variant="h5">
                <em>Description</em> - {video?.description}
              </Typography>
            </Box>
            <Stack spacing={1} sx={{ outline: 'solid', m: 0.5, p: 1 }}>
              <Typography variant="body1">Genres - {video?.genres}</Typography>
              <Divider />
              <Typography variant="body1">
                <em>Year</em> - {video?.releaseYear}
              </Typography>
              <Divider />
              <Typography variant="body1">
                <em>Rating</em> - {video?.rating}
              </Typography>
              <Divider />
              <Typography variant="body1">
                <em>Runtime</em> - {video?.runtime} minutes
              </Typography>
              <Divider />
              <Typography variant="body1">
                <em>Resolution</em> - {video?.width}x{video?.height}
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
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoViewPage;
