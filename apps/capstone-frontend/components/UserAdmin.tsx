import { User } from '@capstone/utils/entities';
import { camelToCapsAndSpaces } from '@capstone/utils/general';
import { IUserJSONModel } from '@capstone/utils/types';
import { Collapse, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react';
import UserEdit from './forms/UserEdit';

type UserAdminProps = {
  show: boolean;
  users: IUserJSONModel[];
};

const UserAdmin = (props: UserAdminProps) => {
  const { show, users } = props;
  const [selectedUser, setSelectedUser] = useState<IUserJSONModel | null>();
  return (
    <Collapse in={show} sx={{ mb: 6 }}>
      <Typography variant="overline">
        Click on a user to edit their data, filter and sort using the table
        headers
      </Typography>
      <DataGrid
        rows={users}
        columns={Object.keys(users[0] || {}).map((key, idx, arr) => {
          return {
            field: key,
            headerName: camelToCapsAndSpaces(key),
            width: 200,
          };
        })}
        onRowClick={({ row }) => {
          setSelectedUser(row as any);
        }}
        initialState={{
          pagination: {
            paginationModel: {
              page: 0,
              pageSize: 5,
            },
          },
        }}
      />
      <UserEdit
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        row={selectedUser as any}
      />
    </Collapse>
  );
};

export default UserAdmin;
