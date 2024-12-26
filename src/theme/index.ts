import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            '&:-webkit-autofill': {
              '-webkit-box-shadow': '0 0 0 100px #121212 inset !important',
              '-webkit-text-fill-color': '#fff !important',
            }
          }
        }
      }
    }
  }
});

export default theme; 