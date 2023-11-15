import React, { useEffect, useState } from 'react';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { parseBlob } from 'music-metadata-browser';
import SimpleGridItem from './SimpleGridItem';
import { IAudioUpload } from '@capstone/utils/types';
import dayjs from 'dayjs';
import { useAxios } from '@capstone/utils/general';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/router';

type AudioUploadFormProps = {
  file: File | null;
  title: string;
};

export const AudioUploadForm = (props: AudioUploadFormProps) => {
  const { title, file } = props;
  const [artist, setArtist] = useState<string>('');
  const [album, setAlbum] = useState<string>('');
  const [length, setLength] = useState<number>(0);
  const [releaseYear, setReleaseYear] = useState<number>(0);
  const [genres, setGenres] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [enableUpload, setEnableUpload] = useState<boolean>(false);
  const axios = useAxios();
  const router = useRouter();

  useEffect(() => {
    const getMetadata = async () => {
      if (!file) return;
      const metadata = await parseBlob(file);
      setLength(metadata.format.duration as number);
      setReleaseYear(metadata.common.year || 0);
    };
    getMetadata();
  }, [file]);

  useEffect(() => {
    if (!file) {
      setEnableUpload(false);
      return;
    }
    if (artist && album && length && releaseYear && genres) {
      setEnableUpload(true);
    } else {
      setEnableUpload(false);
    }
  }, [artist, album, length, releaseYear, genres, file]);

  const handleUpload = async () => {
    let upload: IAudioUpload = {
      title: title,
      artist: artist,
      album: album,
      length: length,
      release_year: releaseYear,
      genres: genres,
      uploaded: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    await axios
      .post('/audio', file, {
        params: upload,
        headers: {
          'Content-Type': file!.type,
          'File-Extension': file!.name.split('.').pop(),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          enqueueSnackbar('Upload successful!', {
            variant: 'success',
          });
          router.push('/');
        } else {
          enqueueSnackbar('Upload failed!', {
            variant: 'error',
          });
        }
      });
  };

  return (
    <>
      <SimpleGridItem>
        <TextField
          fullWidth
          label="Artist"
          placeholder="Artist"
          value={artist}
          onChange={(e) => {
            setArtist(e.target.value);
          }}
        />
      </SimpleGridItem>
      <SimpleGridItem>
        <TextField
          fullWidth
          label="Album"
          placeholder="Album"
          value={album}
          onChange={(e) => {
            setAlbum(e.target.value);
          }}
        />
      </SimpleGridItem>
      <SimpleGridItem>
        <TextField
          fullWidth
          label="Length"
          placeholder="Length"
          value={length}
          disabled
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
          label="Genres"
          placeholder="Genres"
          value={genres}
          onChange={(e) => {
            setGenres(e.target.value);
          }}
        />
      </SimpleGridItem>
      <SimpleGridItem>
        <TextField
          fullWidth
          label="Tags"
          placeholder="Tags"
          value={tags}
          onChange={(e) => {
            setTags(e.target.value);
          }}
        />
      </SimpleGridItem>
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
