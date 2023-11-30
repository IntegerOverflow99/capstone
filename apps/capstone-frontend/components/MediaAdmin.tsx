import { camelToCapsAndSpaces, useAxios } from '@capstone/utils/general';
import {
  IAudioJSONModel,
  IAudioUpload,
  IMediaJSONModel,
  IPhotoJSONModel,
  IPhotoUpload,
  IVideoJSONModel,
  IVideoUpload,
} from '@capstone/utils/types';
import { Box, Collapse, Tab, Tabs, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import AudioEdit from './forms/AudioEdit';
import PhotoEdit from './forms/PhotoEdit';
import VideoEdit from './forms/VideoEdit';

/**
 * Props for the MediaAdmin component
 */
type MediaAdminProps = {
  show: boolean;
};

/**
 * Media Administration Component - is a collapse component that shows a table of all media, and allows for editing of media
 * @param props MediaAdminProps
 * @returns React.FC
 */
const MediaAdmin = (props: MediaAdminProps) => {
  const { show } = props;
  const axios = useAxios();
  const searchParams = useSearchParams();
  const [videos, setVideos] = useState<IVideoJSONModel[]>([]);
  const [photos, setPhotos] = useState<IPhotoJSONModel[]>([]);
  const [audio, setAudio] = useState<IAudioJSONModel[]>([]);
  const [tab, setTab] = useState<string>('video');
  const [selectedPhoto, setSelectedPhoto] = useState<
    | (IPhotoUpload & {
        id: number;
      })
    | null
  >();
  const [selectedVideo, setSelectedVideo] = useState<
    | (IVideoUpload & {
        id: number;
      })
    | null
  >();
  const [selectedAudio, setSelectedAudio] = useState<
    (IAudioUpload & { id: number }) | null
  >();

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

  const data = useMemo(() => {
    switch (tab) {
      case 'video':
        return shownVideos;
      case 'photo':
        return shownPhotos;
      case 'audio':
        return shownAudio;
      default:
        return [];
    }
  }, [tab, shownVideos, shownPhotos, shownAudio]);

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

  const router = useRouter();

  return (
    <Collapse in={show}>
      <Typography variant="overline">
        Click on a piece of media to edit its data, filter and sort using the
        table headers
      </Typography>
      <Tabs value={tab} onChange={(e, v) => setTab(v)}>
        <Tab label="Videos" value="video" />
        <Tab label="Photos" value="photo" />
        <Tab label="Audio" value="audio" />
      </Tabs>
      <Box sx={{ m: 2 }}>
        {data && data.length === 0 && (
          <Typography variant="h4">No Results Found!</Typography>
        )}
        <DataGrid
          columns={Object.keys(data[0] || {}).map((key, idx, arr) => {
            return {
              field: key,
              headerName: camelToCapsAndSpaces(key),
              width: 200,
            };
          })}
          rows={data as any}
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize: 5,
              },
            },
          }}
          onRowClick={({ row }) => {
            switch (tab) {
              case 'video':
                setSelectedVideo(row as any);
                break;
              case 'photo':
                setSelectedPhoto(row as any);
                break;
              case 'audio':
                setSelectedAudio(row as any);
                break;
            }
          }}
        />
      </Box>
      <AudioEdit
        open={!!selectedAudio}
        onClose={() => {
          setSelectedAudio(null);
        }}
        row={
          (tab !== 'audio'
            ? tab !== 'video'
              ? selectedPhoto
              : selectedVideo
            : selectedAudio) as any
        }
      />
      <PhotoEdit
        open={!!selectedPhoto}
        onClose={() => {
          setSelectedPhoto(null);
        }}
        row={
          (tab !== 'photo'
            ? tab !== 'video'
              ? selectedAudio
              : selectedVideo
            : selectedPhoto) as any
        }
      />
      <VideoEdit
        open={!!selectedVideo}
        onClose={() => {
          setSelectedVideo(null);
        }}
        row={
          (tab !== 'video'
            ? tab !== 'photo'
              ? selectedAudio
              : selectedPhoto
            : selectedVideo) as any
        }
      />
    </Collapse>
  );
};

export default MediaAdmin;
