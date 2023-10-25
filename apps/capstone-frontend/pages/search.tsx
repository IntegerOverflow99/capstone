import { useAxios } from '@capstone/utils/general';
import {
  IAudioJSONModel,
  IMediaJSONModel,
  IPhotoJSONModel,
  IVideoJSONModel,
} from '@capstone/utils/types';
import {
  Button,
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Container,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import React, { useMemo, useState, useEffect } from 'react';
import { camelToCapsAndSpaces } from '@capstone/utils/general';
import SearchSection from '../components/theme/SearchSection';
import { useSearchParams } from 'next/navigation';

export function SearchPage() {
  const axios = useAxios();
  const searchParams = useSearchParams();
  const [videos, setVideos] = useState<IVideoJSONModel[]>([]);
  const [photos, setPhotos] = useState<IPhotoJSONModel[]>([]);
  const [audio, setAudio] = useState<IAudioJSONModel[]>([]);
  const [tab, setTab] = useState<string>('video');

  useEffect(() => {
    const fetchMedia = async () => {
      const response = await axios.get('/media');
      setVideos(
        response.data
          .filter((media: IMediaJSONModel) => !!media.video)
          .map((media: IMediaJSONModel) => {
            const { video, ...rest } = media;
            return video;
          })
      );
      setPhotos(
        response.data
          .filter((media: IMediaJSONModel) => !!media.photo)
          .map((media: IMediaJSONModel) => {
            const { photo, ...rest } = media;
            return photo;
          })
      );
      setAudio(
        response.data
          .filter((media: IMediaJSONModel) => !!media.audio)
          .map((media: IMediaJSONModel) => {
            const { audio, ...rest } = media;
            return audio;
          })
      );
    };

    fetchMedia();
  }, [axios]);

  return (
    <Box sx={{ flexGrow: 1, p: 5 }}>
      <Container>
        <Paper sx={{ p: 2 }} elevation={20}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)}>
            <Tab label="Videos" value="video" />
            <Tab label="Photos" value="photo" />
            <Tab label="Audio" value="audio" />
          </Tabs>
          <SearchSection
            data={tab === 'video' ? videos : tab === 'photo' ? photos : audio}
            navigatesTo={tab}
          />
          {/* <SearchSection data={videos} title="Videos" />
          <Divider />
          <SearchSection data={photos} title="Photos" />
          <Divider />
          <SearchSection data={audio} title="Audio" /> */}
        </Paper>
      </Container>
    </Box>
  );
}

export default SearchPage;
