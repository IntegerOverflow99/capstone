import React, { useEffect, useState } from 'react';
import {
  Box,
  Modal,
  ModalProps,
  Typography,
  TextField,
  Grid,
  Button,
} from '@mui/material';
import { IAudioUpload } from '@capstone/utils/types';
import { useAxios } from '@capstone/utils/general';
import { enqueueSnackbar } from 'notistack';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

type AudioEditProps = {
  open: boolean;
  onClose: () => void;
  row?: IAudioUpload & { id: number };
};

const AudioEdit = (props: AudioEditProps) => {
  const { open, onClose, row } = props;
  const [title, setTitle] = useState<string>(row?.title || '');
  const [artist, setArtist] = useState<string>(row?.artist || '');
  const [album, setAlbum] = useState<string>(row?.album || '');
  const [length, setLength] = useState<number>(row?.length || 0);
  const [releaseYear, setReleaseYear] = useState<number>(
    (row as any)?.releaseYear || 0
  );
  const [genres, setGenres] = useState<string>(row?.genres || '');
  const axios = useAxios();
  const router = useRouter();

  useEffect(() => {
    setTitle(row?.title || '');
    setArtist(row?.artist || '');
    setAlbum(row?.album || '');
    setLength(row?.length || 0);
    setReleaseYear((row as any)?.releaseYear || 0);
    setGenres(row?.genres || '');
  }, [row]);

  const handleSave = async () => {
    if (!row) return;
    try {
      await axios.put(`/audio/${row.id}`, {
        title: title,
        artist: artist,
        album: album,
        length: length,
        release_year: releaseYear,
        genres: genres,
      });
    } catch (err) {
      enqueueSnackbar(
        `Error updating audio! HTTP: ${(err as AxiosError).status}`,
        { variant: 'error' }
      );
      return;
    }
    enqueueSnackbar('Audio updated successfully!', { variant: 'success' });
    onClose();
    router.refresh();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        margin: 0,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: '10px',
      }}
    >
      <>
        <Typography variant="h4">Edit Audio</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} lg={6}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              fullWidth
              label="Artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              fullWidth
              label="Album"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              fullWidth
              label="Length"
              value={length.toString()}
              type="number"
              onChange={(e) => setLength(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              fullWidth
              label="Release Year"
              type="number"
              value={releaseYear}
              onChange={(e) => setReleaseYear(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              fullWidth
              label="Genres"
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <Button
              variant="contained"
              fullWidth
              color="primary"
              onClick={handleSave}
            >
              Save
            </Button>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: '#ff4444' }}
              onClick={async () => {
                if (!row) return;
                await axios.delete(`/audio/${row.id}`);
                onClose();
              }}
            >
              Delete
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" fullWidth onClick={onClose}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </>
    </Modal>
  );
};

export default AudioEdit;
