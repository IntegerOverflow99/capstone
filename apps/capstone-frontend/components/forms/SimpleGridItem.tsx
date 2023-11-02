import React from 'react';
import { Grid } from '@mui/material';

type SimpleGridItemProps = {
  children: React.ReactNode;
};

/**
 * Simple Grid Item Component
 * @param props just passes children
 * @returns MUI Grid Item with a breakpoint to fill the screen in xs, and half the screen in md
 */
const SimpleGridItem = (props: SimpleGridItemProps) => {
  return (
    <Grid item xs={12} md={6}>
      {props.children}
    </Grid>
  );
};

export default SimpleGridItem;
