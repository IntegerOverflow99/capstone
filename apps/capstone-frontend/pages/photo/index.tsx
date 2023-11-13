import { IPhotoJSONModel } from '@capstone/utils/types';
import { Box, Container, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SearchSection from '../../components/SearchSection';
import { useAxios } from '@capstone/utils/general';

const PhotoIndex = () => {
  const [data, setData] = useState<IPhotoJSONModel[]>([]);
  const axios = useAxios();

  useEffect(() => {
    const fetchPhotos = async () => {
      const res = await axios.get('/photo');
      setData(
        res.data.map((photo: IPhotoJSONModel) => {
          const out: any = { ...photo, ...photo.media };
          delete out.media;
          return out;
        })
      );
    };

    fetchPhotos();
  }, [axios]);

  return (
    <Box sx={{ flexGrow: 1, p: 5 }}>
      <Container>
        <Paper sx={{ p: 2 }} elevation={20}>
          <Typography variant="h2">Photos</Typography>
          <SearchSection data={data} navigatesTo={'photo'} />
        </Paper>
      </Container>
    </Box>
  );
};

export default PhotoIndex;
