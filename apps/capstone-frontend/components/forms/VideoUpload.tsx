import React, { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import dayjs from 'dayjs';
import SimpleGridItem from './SimpleGridItem';
import { Video } from 'video-metadata-thumbnails';
import { useAxios } from '@capstone/utils/general';
import { IVideoRatings, IVideoUpload } from '@capstone/utils/types';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/router';

type VideoUploadFormProps = {
  file: File | null;
  title: string;
};

export const VideoUploadForm = (props: VideoUploadFormProps) => {
  const { title, file } = props;
  const [description, setDescription] = useState<string>('');
  const [releaseYear, setReleaseYear] = useState<number>(0);
  const [tags, setTags] = useState<string>('');
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [watchTime, setWatchTime] = useState<number>(0);
  const [genres, setGenres] = useState<string>('');
  const [rating, setRating] = useState<string>('E');
  const [enableUpload, setEnableUpload] = useState<boolean>(false);
  const axios = useAxios();
  const router = useRouter();

  useEffect(() => {
    const getMetadata = async () => {
      if (!file) return;
      const video = new Video(file);
      const metadata = await video.getMetadata();
      console.log(metadata);
      setHeight(metadata.height);
      setWidth(metadata.width);
      setWatchTime(metadata.duration);
    };
    getMetadata();
  }, [file]);

  useEffect(() => {
    if (
      title &&
      description &&
      releaseYear &&
      height &&
      width &&
      watchTime &&
      genres &&
      rating
    ) {
      setEnableUpload(true);
    } else {
      setEnableUpload(false);
    }
  }, [
    title,
    description,
    releaseYear,
    height,
    width,
    watchTime,
    genres,
    rating,
  ]);

  const handleUpload = async () => {
    let upload: IVideoUpload = {
      title,
      description,
      release_year: releaseYear,
      height,
      width,
      runtime: watchTime,
      genres,
      rating: rating as IVideoRatings,
      uploaded: dayjs().format('YYYY-MM-DD'),
    };

    await axios
      .post('/video', file, {
        params: upload,
        headers: {
          'Content-Type': file!.type,
          'File-Extension': file!.name.split('.').pop(),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          enqueueSnackbar('Upload Successful', { variant: 'success' });
          router.push('/search');
        } else {
          enqueueSnackbar('Upload Failed', { variant: 'error' });
        }
      });
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography variant="h6">Video Upload</Typography>
      </Grid>
      <SimpleGridItem>
        <TextField
          fullWidth
          label="Description"
          placeholder="Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </SimpleGridItem>
      <SimpleGridItem>
        <TextField
          fullWidth
          label="Release Year"
          placeholder="Release Year"
          value={releaseYear}
          onChange={(e) => {
            setReleaseYear(Number(e.target.value));
          }}
        />
      </SimpleGridItem>
      <SimpleGridItem>
        <TextField
          fullWidth
          label="Height"
          placeholder="Height"
          disabled
          value={height}
          onChange={(e) => {
            setHeight(Number(e.target.value));
          }}
        />
      </SimpleGridItem>
      <SimpleGridItem>
        <TextField
          fullWidth
          label="Width"
          placeholder="Width"
          disabled
          value={width}
          onChange={(e) => {
            setWidth(Number(e.target.value));
          }}
        />
      </SimpleGridItem>
      <SimpleGridItem>
        <TextField
          fullWidth
          label="Watch Time"
          placeholder="Watch Time"
          value={watchTime}
          disabled
          onChange={(e) => {
            setWatchTime(Number(e.target.value));
          }}
        />
      </SimpleGridItem>
      <SimpleGridItem>
        <TextField
          fullWidth
          label="Genres"
          placeholder="Genres"
          value={genres}
          onChange={(e) => {
            setGenres(e.target.value);
          }}
        />
      </SimpleGridItem>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2}>
          <Typography
            variant="h6"
            sx={{
              //vertically center in parent, horizontally right justify text
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            Rating
          </Typography>
          <Select
            fullWidth
            value={rating}
            onChange={(e) => setRating(e.target.value as string)}
            label="Rating"
          >
            <MenuItem value="E">E</MenuItem>
            <MenuItem value="PG">PG</MenuItem>
            <MenuItem value="PG-13">PG-13</MenuItem>
            <MenuItem value="R">R</MenuItem>
            <MenuItem value="NC-17">NC-17</MenuItem>
          </Select>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          fullWidth
          disabled={!enableUpload}
          onClick={handleUpload}
        >
          Upload
        </Button>
      </Grid>
    </>
  );
};
