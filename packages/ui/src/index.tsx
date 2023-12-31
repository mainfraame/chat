import {
  createTheme,
  CssBaseline,
  GlobalStyles,
  ThemeProvider
} from '@mui/material';

import { createRoot } from 'react-dom/client';

import { Home } from './pages';

const root = createRoot(document.getElementById('root'));

const theme = createTheme({});

root.render(
  <>
    <CssBaseline />
    <GlobalStyles
      styles={{
        '#root': {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          justifyContent: 'center',
          width: '100vw',
          [theme.breakpoints.down('sm')]: {
            justifyContent: 'flex-start',
            paddingTop: theme.spacing(2)
          }
        },
        '[aria-hidden]': {
          display: 'none'
        }
      }}
    />
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>
  </>
);
