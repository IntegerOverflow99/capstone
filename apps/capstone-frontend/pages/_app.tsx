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
import logo from '../assets/logo.jpg';
import { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';

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
  const [drawerOpen, setDrawerOpen] = useState(true);
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <>
      <Head>
        <title>Media Server Site</title>
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
            />
            <Divider orientation="vertical" sx={{ m: 2 }} />
            <TextField
              placeholder="Search"
              variant="outlined"
              sx={{ m: 1 }}
              InputProps={{
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
          <Stack
            direction="row"
            sx={{ alignItems: 'center' }}
            onClick={() => {
              console.log('Open profile not implemented');
            }}
          >
            <Typography variant="h6" sx={{ m: 1 }} color="text.secondary">
              Username
            </Typography>
            <IconButton>
              <AccountCircle fontSize="large" />
            </IconButton>
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
              router.push('/');
            }}
          />
          <EasyListItem text="Favorites" />
          <EasyListItem text="Recents" />
          <Divider />
          <EasyListItem
            icon={<LibraryMusicIcon />}
            text="Music"
            onClick={() => router.push('/audio')}
          />
          <EasyListItem text="Favorites" />
          {/* TODO: add generated genre subcategories */}
          <Divider />
          <EasyListItem
            icon={<CameraIcon />}
            text="Photos"
            onClick={() => router.push('/photo')}
          />
          <EasyListItem text="Favorites" />
          {/* <EasyListItem text="Albums" /> */}
          <Divider />
          <EasyListItem
            icon={<VideoLibraryIcon />}
            text="Videos"
            onClick={() => router.push('/video')}
          />
          <EasyListItem text="Favorites" />
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
    </>
  );
}

export default CustomApp;
