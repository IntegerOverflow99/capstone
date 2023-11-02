import React, { useEffect, useState } from 'react';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { parseBlob } from 'music-metadata-browser';
import SimpleGridItem from './SimpleGridItem';

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
          onChange={(e) => {
            setLength(Number(e.target.value));
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
        <Button variant="contained" fullWidth disabled>
          Upload
        </Button>
      </Grid>
    </>
  );
};
