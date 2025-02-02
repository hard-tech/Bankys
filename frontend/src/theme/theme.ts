import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f39f6', // Indigo-600
      light: '#818CF8', // Indigo-400
      dark: '#3730A3', // Indigo-800
    },
    secondary: {
      main: '#8B5CF6', // Violet-500
      light: '#A78BFA', // Violet-400
      dark: '#6D28D9', // Violet-700
    },
    error: {
      main: '#EF4444', // Red-500
    },
    warning: {
      main: '#F59E0B', // Amber-500
    },
    info: {
      main: '#3B82F6', // Blue-500
    },
    success: {
      main: '#10B981', // Emerald-500
    },
    background: {
      default: '#F3F4F6', // Gray-100
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937', // Gray-800
      secondary: '#4B5563', // Gray-600
    },
  },
});

export default theme;