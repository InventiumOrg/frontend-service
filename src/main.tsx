import React from 'react';
import ReactDOM from 'react-dom/client';
import router from 'routes/router';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { theme } from 'theme/theme.ts';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <CssBaseline />
      <RouterProvider router={router} />
      </ClerkProvider>
    </ThemeProvider>
  </React.StrictMode>,
);