import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { MuiFileInput } from 'mui-file-input';
import React, { useState, useMemo } from 'react';
import {
  ImageUploadForm,
  VideoUploadForm,
  AudioUploadForm,
} from '../components/forms';

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const fileType = useMemo(() => {
    if (!file) return '';
    console.log(file.type);
    return file.type.split('/')[0];
  }, [file]);
  const [title, setTitle] = useState<string>('');

  return (
    <Box sx={{ p: 2 }}>
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
            //inputprops accept images in normal formats (png, jpg, jpeg, gif), videos (mp4, mov, avi, mkv), and audio (mp3, wav, ogg)
            inputProps={{
              accept:
                'image/jpg,image/jpeg,image/png,image/gif,video/mp4,video/mov,audio/mp3,audio/wav',
            }}
            onChange={(newFile: File | null) => {
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
    </Box>
  );
};

export default UploadPage;
