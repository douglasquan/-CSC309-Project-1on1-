import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2EB69B', // lighter - for button
      light: '#CCFFE5'
    },
    secondary: {
      main: '#28A28A', // darker - for text
    },
    invitation: {
      main: '#D17D00', 
      light: '#FFE5CC'
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
  <ThemeProvider theme={theme}>
    <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


