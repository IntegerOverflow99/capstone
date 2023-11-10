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
import SearchSection from '../components/SearchSection';
import { useSearchParams } from 'next/navigation';

export function SearchPage() {
  const axios = useAxios();
  const searchParams = useSearchParams();
  const [videos, setVideos] = useState<IVideoJSONModel[]>([]);
  const [photos, setPhotos] = useState<IPhotoJSONModel[]>([]);
  const [audio, setAudio] = useState<IAudioJSONModel[]>([]);
  const [tab, setTab] = useState<string>('video');

  const shownVideos = useMemo(() => {
    if (!searchParams.get('q')) return videos;
    return videos.filter(
      (video) =>
        video.title
          .toLowerCase()
          .includes(searchParams.get('q')!.toLowerCase()) ||
        video.description
          .toLowerCase()
          .includes(searchParams.get('q')!.toLowerCase())
    );
  }, [videos, searchParams.get('q')]);

  const shownPhotos = useMemo(() => {
    if (!searchParams.get('q')) return photos;
    return photos.filter((photo) =>
      photo.description
        .toLowerCase()
        .includes(searchParams.get('q')!.toLowerCase())
    );
  }, [photos, searchParams.get('q')]);

  const shownAudio = useMemo(() => {
    if (!searchParams.get('q')) return audio;
    return audio.filter(
      (audio) =>
        audio.title
          .toLowerCase()
          .includes(searchParams.get('q')!.toLowerCase()) ||
        audio.artist
          .toLowerCase()
          .includes(searchParams.get('q')!.toLowerCase()) ||
        audio.album.toLowerCase().includes(searchParams.get('q')!.toLowerCase())
    );
  }, [audio, searchParams.get('q')]);

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
            data={
              tab === 'video'
                ? shownVideos
                : tab === 'photo'
                ? shownPhotos
                : shownAudio
            }
            navigatesTo={tab}
          />
        </Paper>
      </Container>
    </Box>
  );
}

export default SearchPage;
