import { useAxios } from '@capstone/utils/general';
import { IPhotoUpload } from '@capstone/utils/types';
import { Button, Grid, Modal, TextField, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

/**
 * Props for the PhotoEdit component
 */
type PhotoEditProps = {
  open: boolean;
  onClose: () => void;
  row?: IPhotoUpload & { id: number };
};

/**
 * Photo Editing Form
 * @param props PhotoEditProps
 * @returns React.FC
 */
const PhotoEdit = (props: PhotoEditProps) => {
  const { open, onClose, row } = props;
  const [description, setDescription] = useState<string>(
    row?.description || ''
  );
  const axios = useAxios();
  const router = useRouter();

  useEffect(() => {
    setDescription(row?.description || '');
  }, [row]);

  const handleSave = async () => {
    if (!row) return;
    try {
      await axios.put(`/photo/${row.id}`, {
        description: description,
      });
    } catch (err) {
      enqueueSnackbar(
        `Error updating photo! HTTP: ${(err as AxiosError).status}`,
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
        <Typography variant="h4">Edit Photo</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
            />
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
                  await axios.delete(`/photo/${row.id}`);
                } catch (err) {
                  enqueueSnackbar(
                    `Error deleting photo! HTTP: ${(err as AxiosError).status}`,
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

export default PhotoEdit;
