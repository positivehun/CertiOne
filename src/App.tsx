import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container, ThemeProvider, createTheme, Box, styled, GlobalStyles } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SubjectList from './components/SubjectList';
import Quiz from './components/Quiz';

const globalStyles = {
  'html, body': {
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    width: '100vw',
    height: '100vh'
  },
  '#root': {
    width: '100vw',
    height: '100vh',
    overflow: 'hidden'
  }
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: '100% !important',
          width: '100vw !important',
          margin: '0 !important',
          padding: '0 !important',
          overflow: 'hidden'
        }
      }
    }
  }
});

const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  width: '100vw',
  height: '100vh',
  margin: 0,
  padding: 0,
  overflow: 'hidden',
  backgroundColor: '#F8F7F4'
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        <Router>
          <StyledContainer disableGutters>
            <Routes>
              <Route path="/" element={<SubjectList />} />
              <Route path="/quiz/:subject" element={<Quiz />} />
            </Routes>
          </StyledContainer>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
