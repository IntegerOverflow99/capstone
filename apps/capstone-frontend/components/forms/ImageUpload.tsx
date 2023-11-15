import React, { useState, useMemo, useEffect } from 'react';
import { Button, Grid, TextField, Typography } from '@mui/material';
import EXIF from 'exif-js';
import exifr from 'exifr';
import dayjs from 'dayjs';
import SimpleGridItem from './SimpleGridItem';
import { IPhotoUpload } from '@capstone/utils/types';
import { useAxios } from '@capstone/utils/general';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/router';

type ImageUploadFormProps = {
  file: File | null;
  title: string;
};

export const ImageUploadForm = (props: ImageUploadFormProps) => {
  const { title, file } = props;
  const [takenAt, setTakenAt] = useState<string>('null');
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [tags, setTags] = useState<string>('');
  const axios = useAxios();
  const router = useRouter();

  useEffect(() => {
    const getEXIF = async () => {
      if (!file) {
        setTakenAt('');
      } else {
        const data = await exifr.parse(file);
        setTakenAt(
          dayjs(
            data.DateTimeOriginal || data.DateTime || data.CreateDate
          ).format('YYYY-MM-DD HH:mm:ss')
        );
        setHeight(data.XResolution);
        setWidth(data.YResolution);
      }
    };
    getEXIF();
  }, [file]);

  const handleUpload = async () => {
    let upload: IPhotoUpload = {
      description: title,
      uploaded: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      taken: takenAt,
      height: height,
      width: width,
      global_tags: tags,
    };

    axios
      .post('/photo', file, {
        params: upload,
        headers: {
          'Content-Type': file!.type,
          'File-Extension': file!.name.split('.').pop(),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          enqueueSnackbar('Upload Successful', { variant: 'success' });
          router.push('/');
        } else {
          enqueueSnackbar('Upload Failed', { variant: 'error' });
        }
      });
  };

  return (
    <>
      <SimpleGridItem>
        <TextField
          fullWidth
          label="Taken On"
          disabled
          placeholder="Taken On"
          value={takenAt}
        />
      </SimpleGridItem>
      <SimpleGridItem>
        <TextField
          fullWidth
          label="Tags"
          placeholder="Tags"
          value={tags}
          onChange={() => {
            setTags(tags);
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
        />
      </SimpleGridItem>
      <SimpleGridItem>
        <TextField
          fullWidth
          label="Width"
          placeholder="Width"
          value={width}
          disabled
        />
      </SimpleGridItem>
      <Grid item xs={12}>
        <Button
          variant="contained"
          fullWidth
          disabled={!file || !title}
          onClick={handleUpload}
        >
          Upload
        </Button>
      </Grid>
    </>
  );
};
