import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { MuiFileInput } from 'mui-file-input';
import React, { useState, useMemo } from 'react';
import {
  ImageUploadForm,
  VideoUploadForm,
  AudioUploadForm,
} from '../components/forms';
import { getServerSidePropsSession } from '../lib/SessionContext';
import ProfileWidget from '../components/ProfileWidget';
import { IUserSessionData } from '@capstone/utils/types';
import { enqueueSnackbar } from 'notistack';

export const getServerSideProps = getServerSidePropsSession;

const UploadPage = (props: { session: IUserSessionData }) => {
  const { session } = props;
  const [file, setFile] = useState<File | null>(null);
  const fileType = useMemo(() => {
    if (!file) return '';
    return file.type.split('/')[0];
  }, [file]);
  const [title, setTitle] = useState<string>('');

  return (
    <Box sx={{ p: 2 }}>
      <ProfileWidget session={session} />
      <Typography variant="h2">Upload Media</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={fileType === 'image' ? 'Description' : 'Title'}
            placeholder={fileType === 'image' ? 'Description' : 'Title'}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MuiFileInput
            value={file}
            fullWidth
            label="Upload File"
            placeholder="Upload File"
            inputProps={{
              accept: 'image/jpg,image/jpeg,video/mp4,audio/mp3',
            }}
            onChange={(newFile: File | null) => {
              if (newFile && newFile.size > 50000000 /* 50mb */) {
                enqueueSnackbar(
                  'File size too large! Limited to 50 megabytes on the public host!',
                  {
                    variant: 'error',
                  }
                );
                return;
              }
              setFile(newFile);
            }}
          />
        </Grid>
        {
          {
            image: <ImageUploadForm file={file} title={title} />,
            video: <VideoUploadForm file={file} title={title} />,
            audio: <AudioUploadForm file={file} title={title} />,
          }[fileType]
        }
      </Grid>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        <em>Supported file types: .jpg, .jpeg, .mp4, .mp3</em>
        <br />
        <em>Max File Size (Imposed for public host): 50mb</em>
      </Typography>
    </Box>
  );
};

export default UploadPage;
