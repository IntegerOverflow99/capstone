import {
  CssBaseline,
  Toolbar,
  TextField,
  Box,
  Divider,
  Stack,
  IconButton,
  InputAdornment,
  Typography,
  styled,
  Drawer,
  Slide,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  Snackbar,
  Button,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import HomeIcon from '@mui/icons-material/Home';
import CameraIcon from '@mui/icons-material/Camera';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import SearchIcon from '@mui/icons-material/Search';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { AccountCircle } from '@mui/icons-material';
import Image from 'next/image';
import logo from '../assets/logo.png';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { SnackbarProvider } from 'notistack';
import { useAxios } from '@capstone/utils/general';
interface EasyListItemProps {
  text: string;
  icon?: ReactNode;
  onClick?: () => void;
}

const EasyListItem = (props: EasyListItemProps) => {
  const { icon, text, onClick } = props;
  return (
    <ListItem>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

//drawer example from - https://mui.com/material-ui/react-drawer/#persistent-drawer

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

function CustomApp({ Component, pageProps }: AppProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  const axios = useAxios();

  useEffect(() => {});

  return (
    <>
      <SnackbarProvider maxSnack={3}>
        <Head>
          <title>Capstone Media Server</title>
        </Head>
        <CssBaseline />
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: '#a7c',
            width: '100%',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Stack
            direction="row"
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Stack direction="row" sx={{ alignItems: 'center' }}>
              <IconButton onClick={toggleDrawer}>
                {drawerOpen ? (
                  <CloseIcon fontSize="large" />
                ) : (
                  <MenuIcon fontSize="large" />
                )}
              </IconButton>
              <Image
                src={logo}
                alt="Logo"
                width={50}
                height={50}
                style={{ marginLeft: '10px' }}
                onClick={(e) => {
                  router.push('/search');
                }}
              />
              <Divider orientation="vertical" sx={{ m: 2 }} />
              <TextField
                placeholder="Search"
                variant="outlined"
                sx={{ m: 1 }}
                value={searchParams.get('q') ?? ''}
                onChange={(e) => {
                  //update search params in the browser router without reloading the page
                  //https://nextjs.org/docs/routing/dynamic-routes#nextjs-router-object
                  router.replace({
                    pathname: router.pathname,
                    query: { ...router.query, q: e.target.value },
                  });
                }}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    router.push({
                      pathname: '/search',
                      query: { ...router.query },
                    });
                  }
                }}
                InputProps={{
                  onKeyDown: (e) => {
                    if (e.key === 'Enter') {
                      router.push({
                        pathname: '/search',
                        query: { ...router.query },
                      });
                    }
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Tooltip title="Upload">
                <IconButton
                  onClick={() => {
                    router.push('/upload');
                  }}
                >
                  <CloudUploadIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={drawerOpen}
        >
          <Toolbar />
          <List dense sx={{ mt: 2 }}>
            <EasyListItem
              icon={<HomeIcon />}
              text="Home"
              onClick={() => {
                router.push('/search');
              }}
            />
            <EasyListItem
              text="Favorites"
              onClick={() => router.push('/favorites')}
            />
            <EasyListItem
              text="Recents"
              onClick={() => router.push('/recents')}
            />
            <Divider />
            <EasyListItem
              icon={<LibraryMusicIcon />}
              text="Music"
              onClick={() => router.push('/audio')}
            />
            <EasyListItem
              text="Favorites"
              onClick={() => router.push('/favorites?tab=audio')}
            />
            {/* TODO: add generated genre subcategories */}
            <Divider />
            <EasyListItem
              icon={<CameraIcon />}
              text="Photos"
              onClick={() => router.push('/photo')}
            />
            <EasyListItem
              text="Favorites"
              onClick={() => router.push('/favorites?tab=photo')}
            />
            {/* <EasyListItem text="Albums" /> */}
            <Divider />
            <EasyListItem
              icon={<VideoLibraryIcon />}
              text="Videos"
              onClick={() => router.push('/video')}
            />
            <EasyListItem
              text="Favorites"
              onClick={() => router.push('/favorites?tab=video')}
            />
            {/* <EasyListItem text="Movies" />
          <EasyListItem text="TV" />
          <EasyListItem text="Home Video" /> */}
          </List>
        </Drawer>
        {/* //margin left should add the width of the drawer if its open */}
        <Box
          sx={{
            marginLeft: drawerOpen ? `${drawerWidth}px` : 'default',
            transition: (theme) =>
              theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }}
        >
          <Paper
            elevation={12}
            sx={{
              backgroundColor: 'action.disabled',
            }}
            style={{ maxHeight: 'max(100vh, 100%)' }}
          >
            <Component {...pageProps} />
          </Paper>
        </Box>
      </SnackbarProvider>
    </>
  );
}

export default CustomApp;
