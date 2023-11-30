import { IPhotoJSONModel, IUserSessionData } from '@capstone/utils/types';
import { Box, Container, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SearchSection from '../../components/SearchSection';
import { useAxios } from '@capstone/utils/general';
import { getServerSidePropsSession } from 'apps/capstone-frontend/lib/SessionContext';
import ProfileWidget from 'apps/capstone-frontend/components/ProfileWidget';

// get props for serverside rendering
export const getServerSideProps = getServerSidePropsSession;

/**
 * The Photo Index Page - allows for searching and filtering of photo files
 * @params props { session: IUserSessionData }
 * @returns React.FC
 */
const PhotoIndex = (props: { session: IUserSessionData }) => {
  const [data, setData] = useState<IPhotoJSONModel[]>([]);
  const axios = useAxios();

  useEffect(() => {
    const fetchPhotos = async () => {
      const res = await axios.get('/photo');
      setData(
        res.data.map((photo: IPhotoJSONModel) => {
          const out: any = { ...photo, ...photo.media, id: photo.id };
          delete out.media;
          return out;
        })
      );
    };

    fetchPhotos();
  }, [axios]);

  return (
    <Box sx={{ flexGrow: 1, p: 5 }}>
      <ProfileWidget session={props.session} />
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
