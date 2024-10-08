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
import { LoadingButton } from '@mui/lab';

/**
 * Props for the ImageUploadForm component
 */
type ImageUploadFormProps = {
  file: File | null;
  title: string;
};

/**
 * Image Upload Form
 * @param props ImageUploadFormProps
 * @returns React.FC
 */
export const ImageUploadForm = (props: ImageUploadFormProps) => {
  const { title, file } = props;
  const [takenAt, setTakenAt] = useState<string>('null');
  const [height, setHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [tags, setTags] = useState<string>('');
  const axios = useAxios();
  const router = useRouter();
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    const getEXIF = async () => {
      if (!file) {
        setTakenAt(dayjs().format('YYYY-MM-DD HH:mm:ss'));
      } else {
        const data = await exifr.parse(file);
        console.log(data);
        setTakenAt(
          dayjs(
            data?.DateTimeOriginal ||
              data?.DateTime ||
              data?.CreateDate ||
              dayjs()
          ).format('YYYY-MM-DD HH:mm:ss')
        );
        setHeight(
          data?.XResolution == 72 // if the image is taken by a camera, the exif XYResolution will be defaulted to 72 - this is a hacky way to get the actual resolution, as EXIFImageWidth/Height are not always present when not taken by a camera (https://exiftool.org/forum/index.php?topic=10818.0)
            ? data?.ExifImageWidth
            : data?.XResolution || 0
        );
        setWidth(
          data?.YResolution == 72
            ? data?.ExifImageHeight
            : data?.YResolution || 0
        );
      }
    };
    getEXIF();
  }, [file]);

  const handleUpload = async () => {
    setUploading(true);
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
          router.push('/search');
        } else {
          enqueueSnackbar('Upload Failed', { variant: 'error' });
        }
      });
    setUploading(false);
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
          onChange={(e) => {
            setTags(e.target.value);
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
        <LoadingButton
          loading={uploading}
          variant="contained"
          fullWidth
          disabled={!file || !title}
          onClick={handleUpload}
        >
          Upload
        </LoadingButton>
      </Grid>
    </>
  );
};
