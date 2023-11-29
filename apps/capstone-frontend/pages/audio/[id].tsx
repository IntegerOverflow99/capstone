import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { IAudioJSONModel, IUserSessionData } from '@capstone/utils/types';
import { useAxios } from '@capstone/utils/general';
import {
  Box,
  Button,
  CardMedia,
  Container,
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
import { getServerSidePropsSession } from '../../lib/SessionContext';
import ProfileWidget from '../../components/ProfileWidget';
import { addToFavorites } from 'apps/capstone-frontend/lib/addToFavorites';

export const getServerSideProps = getServerSidePropsSession;

const AudioViewPage = (props: { session: IUserSessionData }) => {
  const { session } = props;
  const router = useRouter();
  const axios = useAxios();
  const [audio, setAudio] = useState<IAudioJSONModel>();
  const { id } = router.query;
  const [audioURL, setAudioURL] = useState<string | undefined>();

  //add to the browser local storage to keep track of the most recently viewed media (we care about MEDIA id here)
  //this will be used to populate the "recently viewed" section on the home page
  //use audio.media.id to get the media id

  useEffect(() => {
    const fetchAudio = async () => {
      if (!id) return;
      const response = await axios.get(`/audio/${id}`);
      setAudio(response.data);
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

    fetchAudio();
  }, [axios, id]);

  const audioFile = useMemo(() => {
    async function getAudioFile() {
      if (!audio) return null;
      const res = await axios.get(`/media/${audio?.media?.id}`, {
        responseType: 'blob',
      });
      if (!res.data) return null;
      return new Blob([res.data]);
    }

    return getAudioFile();
  }, [axios, audio]);

  const handleClick = async () => {
    if (!audio) return;
    if (!audio?.media?.fileLocation || !audioFile) {
      enqueueSnackbar('No file available. Contact admin.', {
        variant: 'error',
      });
      return;
    }

    try {
      const outFile = (await audioFile) as Blob;
      const url = window.URL.createObjectURL(outFile);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${audio?.title}`;
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

  const handleStream = async () => {
    // create object url and pass to cardmedia
    if (!audio || !audioFile) return;
    const streamURL = URL.createObjectURL((await audioFile) as Blob);
    setAudioURL(streamURL);
  };

  return (
    <Box>
      <ProfileWidget session={session} />
      <Grid container spacing={2}>
        <Grid item md={3} sm={12}>
          <Box sx={{ outline: 'solid', m: 0.5 }}>
            <Stack spacing={1} sx={{ p: 2 }}>
              {audioURL && <audio src={audioURL} controls />}
              <Button
                variant="outlined"
                startIcon={<StarOutlineIcon />}
                onClick={async () => {
                  (await addToFavorites(
                    session!.user!.id,
                    audio!.media!.id!,
                    axios
                  ))
                    ? enqueueSnackbar('Added to favorites!', {
                        variant: 'success',
                      })
                    : enqueueSnackbar('Already in favorites!', {
                        variant: 'warning',
                      });
                }}
              >
                Favorite
              </Button>
              <Button
                variant="outlined"
                startIcon={<CloudDownloadIcon />}
                onClick={handleClick}
              >
                Download
              </Button>
              <Button
                variant="outlined"
                startIcon={<LiveTvIcon />}
                onClick={handleStream}
              >
                Stream
              </Button>
            </Stack>
          </Box>
        </Grid>
        <Grid item md={9} sm={12}>
          <Stack spacing={0}>
            <Box sx={{ outline: 'solid', m: 0.5, p: 1 }}>
              <Typography variant="h4">
                <em>
                  <strong>{audio?.title}</strong>
                </em>
              </Typography>
            </Box>
            <Box sx={{ outline: 'solid', m: 0.5, p: 1 }}>
              <Typography variant="h5">
                <em>Artist/Album</em> - {audio?.artist || 'None Saved'}/
                {audio?.album || 'N/A'}
              </Typography>
            </Box>
            <Stack spacing={1} sx={{ outline: 'solid', m: 0.5, p: 1 }}>
              <Typography variant="body1">Genres - {audio?.genres}</Typography>
              <Divider />
              <Typography variant="body1">
                <em>Year</em> - {audio?.releaseYear}
              </Typography>
              <Divider />
              <Typography variant="body1">
                <em>Uploaded</em> - {audio?.uploaded}
              </Typography>
              <Divider />
              <Typography variant="body1">
                {/* convert audio length from seconds total to mm:ss */}
                <em>Runtime</em> - {audio && Math.floor(audio.length / 60)}:
                {audio && Math.floor(audio.length % 60)}
              </Typography>
            </Stack>
            <Box sx={{ outline: 'solid', m: 0.5, p: 1 }}>
              <Typography variant="body1">Tags here</Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AudioViewPage;
