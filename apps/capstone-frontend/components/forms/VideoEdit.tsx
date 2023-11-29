import React, { useEffect, useState } from 'react';
import {
  Modal,
  Typography,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
} from '@mui/material';
import { IVideoEditValues, IVideoRatings } from '@capstone/utils/types';
import { useAxios } from '@capstone/utils/general';
import { enqueueSnackbar } from 'notistack';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

type VideoEditProps = {
  open: boolean;
  onClose: () => void;
  row?: IVideoEditValues;
};

const VideoEdit = (props: VideoEditProps) => {
  const { open, onClose, row } = props;
  const [title, setTitle] = useState<string>(row?.title || '');
  const [description, setDescription] = useState<string>(
    row?.description || ''
  );
  const [releaseYear, setReleaseYear] = useState<number>(row?.releaseYear || 0);
  const [genres, setGenres] = useState<string>(row?.genres || '');
  const [rating, setRating] = useState<IVideoRatings>(
    (row?.rating as IVideoRatings) || 'E'
  );
  const axios = useAxios();
  const router = useRouter();

  useEffect(() => {
    setTitle(row?.title || '');
    setDescription(row?.description || '');
    setReleaseYear(row?.releaseYear || 0);
    setGenres(row?.genres || '');
    setRating((row?.rating as IVideoRatings) || 'E');
  }, [row]);

  const handleSave = async () => {
    if (!row) return;
    try {
      await axios.put(`/video/${row.id}`, {
        title: title,
        description: description,
        release_year: releaseYear,
        genres: genres,
        rating: rating,
      });
    } catch (err) {
      enqueueSnackbar(
        `Error updating video! HTTP: ${(err as AxiosError).status}`,
        { variant: 'error' }
      );
    }
    router.refresh();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        margin: 0,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: '10px',
      }}
    >
      <>
        <Typography variant="h4">Edit Video</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} lg={6}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              label="Release Year"
              value={releaseYear}
              onChange={(e) => setReleaseYear(parseInt(e.target.value))}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              label="Genres"
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              label="Rating"
              value={rating}
              onChange={(e) => setRating(e.target.value as IVideoRatings)}
              fullWidth
            >
              <MenuItem value="E">E</MenuItem>
              <MenuItem value="PG">PG</MenuItem>
              <MenuItem value="PG13">PG13</MenuItem>
              <MenuItem value="R">R</MenuItem>
              <MenuItem value="NC17">NC17</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Button variant="contained" fullWidth onClick={handleSave}>
              Save
            </Button>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Button
              variant="contained"
              fullWidth
              sx={{ bgcolor: '#ff4444' }}
              onClick={async () => {
                if (!row) return;
                try {
                  await axios.delete(`/video/${row.id}`);
                } catch (err) {
                  enqueueSnackbar(
                    `Error deleting video! HTTP: ${(err as AxiosError).status}`,
                    { variant: 'error' }
                  );
                }
                router.refresh();
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

export default VideoEdit;
