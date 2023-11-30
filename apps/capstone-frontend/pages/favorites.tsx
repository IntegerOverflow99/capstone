import { useAxios } from '@capstone/utils/general';
import {
  IAudioJSONModel,
  IMediaJSONModel,
  IPhotoJSONModel,
  IUserSessionData,
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
import { useRouter } from 'next/router';
import { getServerSidePropsSession } from '../lib/SessionContext';
import ProfileWidget from '../components/ProfileWidget';

// get props for serverside rendering
export const getServerSideProps = getServerSidePropsSession;

/**
 * Favorites Page - allows for searching and filtering of favorited media, same as the search page
 * @param props { session: IUserSessionData }
 * @returns React.FC
 */
export function FavoritesPage(props: { session: IUserSessionData }) {
  const { session } = props;
  const axios = useAxios();
  const searchParams = useSearchParams();
  const [videos, setVideos] = useState<IVideoJSONModel[]>([]);
  const [photos, setPhotos] = useState<IPhotoJSONModel[]>([]);
  const [audio, setAudio] = useState<IAudioJSONModel[]>([]);
  const router = useRouter();
  const tab = useMemo(() => {
    return searchParams.get('tab') || 'video';
  }, [searchParams.get('tab')]);

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
      const response = await axios.get(`/media/favorites/${session!.user!.id}`);
      setVideos(response.data.video);
      setPhotos(response.data.photo);
      setAudio(response.data.audio);
    };

    fetchMedia();
  }, [axios]);

  return (
    <>
      <ProfileWidget session={session} />
      <Box sx={{ flexGrow: 1, p: 5 }}>
        <Container>
          <Paper sx={{ p: 2 }} elevation={20}>
            <Tabs
              value={searchParams.get('tab') || 'video'}
              onChange={(e, v) =>
                router.replace({
                  pathname: router.pathname,
                  query: { ...router.query, tab: v },
                })
              }
            >
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
    </>
  );
}

export default FavoritesPage;
