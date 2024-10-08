import React from 'react';
import { Typography, Box, SxProps, TableBody } from '@mui/material';
import { camelToCapsAndSpaces } from '@capstone/utils/general';
import {
  IAudioJSONModel,
  IPhotoJSONModel,
  IVideoJSONModel,
} from '@capstone/utils/types';
import { useRouter } from 'next/router';
import { DataGrid } from '@mui/x-data-grid';

/**
 * Props for the SearchSection component
 */
type SearchSectionProps = {
  title?: string;
  data: IVideoJSONModel[] | IAudioJSONModel[] | IPhotoJSONModel[];
  sx?: SxProps;
  navigatesTo: string;
};

/**
 * A section that displays a table of video/audio/photo data, and allows for them to navigate to the edit page. Built for reuse.
 * @param props SearchSectionProps
 * @returns React.FC
 */
const SearchSection = (props: SearchSectionProps) => {
  const { title, data, sx, navigatesTo, ...rest } = props;
  const router = useRouter();

  return (
    <Box sx={{ ...sx, m: 2 }}>
      {title && <Typography variant="h4">{title}</Typography>}
      {data.length === 0 && (
        <Typography variant="h4">No Results Found!</Typography>
      )}
      <DataGrid
        columns={Object.keys(data[0] || {}).map((key, idx, arr) => {
          return {
            field: key,
            headerName:
              key == 'runtime' || key == 'length'
                ? `${camelToCapsAndSpaces(key)} (SECONDS)`
                : camelToCapsAndSpaces(key),
            width: 200,
          };
        })}
        rows={data as any}
        pageSizeOptions={[10, 25, 50, 100]}
        columnVisibilityModel={{
          id: false,
          mediaId: false,
          uploaded: false,
          width: false,
          height: false,
          fileLocation: false,
        }}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 10,
            },
          },
        }}
        onRowClick={({ row }) => {
          router.push(`${navigatesTo}/${row.id}`);
        }}
      />
    </Box>
  );
};

export default SearchSection;
