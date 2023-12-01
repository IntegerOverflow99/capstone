import { User } from '@capstone/utils/entities';
import { camelToCapsAndSpaces } from '@capstone/utils/general';
import { IUserJSONModel } from '@capstone/utils/types';
import { Button, Collapse, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react';
import UserEdit from './forms/UserEdit';
import AddUser from './forms/AddUser';

/**
 * Props for the UserAdmin component
 */
type UserAdminProps = {
  show: boolean;
  users: IUserJSONModel[];
};

/**
 * User Administration Component - is a collapse component that shows a table of all users, and allows for editing of users
 * @param props UserAdminProps
 * @returns React.FC
 */
const UserAdmin = (props: UserAdminProps) => {
  const { show, users } = props;
  const [selectedUser, setSelectedUser] = useState<IUserJSONModel | null>();
  const [addingUser, setAddingUser] = useState(false);
  return (
    <Collapse in={show} sx={{ mb: 12 }}>
      <Typography variant="overline">
        Click on a user to edit their data, filter and sort using the table
        headers
      </Typography>
      <Button
        fullWidth
        variant="contained"
        onClick={() => setAddingUser(true)}
        sx={{ mb: 2 }}
      >
        Add User
      </Button>
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
        columnVisibilityModel={{
          id: false,
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
      <AddUser show={addingUser} onClose={() => setAddingUser(false)} />
    </Collapse>
  );
};

export default UserAdmin;
