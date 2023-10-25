import React from 'react';
import {
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Table,
  Paper,
  Typography,
  Box,
  SxProps,
  TableBody,
} from '@mui/material';
import { camelToCapsAndSpaces } from '@capstone/utils/general';
import {
  IAudioJSONModel,
  IPhotoJSONModel,
  IVideoJSONModel,
} from '@capstone/utils/types';

type SearchSectionProps = {
  title?: string;
  data: IVideoJSONModel[] | IAudioJSONModel[] | IPhotoJSONModel[];
  sx?: SxProps;
};

const SearchSection = (props: SearchSectionProps) => {
  const { title, data, sx, ...rest } = props;

  return (
    <Box sx={{ ...sx, m: 2 }}>
      {title && <Typography variant="h4">{title}</Typography>}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {Object.keys(data[0] || {}).map((key, idx, arr) => {
                return (
                  <React.Fragment key={idx}>
                    <TableCell>
                      <strong>{camelToCapsAndSpaces(key)}</strong>
                    </TableCell>
                  </React.Fragment>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => {
              return (
                <TableRow key={idx}>
                  {Object.values(row).map((value, idx) => {
                    return (
                      <React.Fragment key={idx}>
                        <TableCell>{value}</TableCell>
                      </React.Fragment>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SearchSection;
