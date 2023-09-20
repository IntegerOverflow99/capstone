import { createTheme, ThemeOptions } from '@mui/material';

export const themeObj: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '##6e5e8b',
    },
    secondary: {
      main: '#4672f9',
    },
    success: {
      main: '#00b500',
      contrastText: '#fff',
    },
    error: {
      main: '#CA3838',
    },
    warning: {
      main: '#E6E600',
    },
  },
};

export default createTheme(themeObj);
