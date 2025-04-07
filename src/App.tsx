import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container, ThemeProvider, createTheme, Box, styled } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SubjectList from './components/SubjectList';
import Quiz from './components/Quiz';

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
          padding: '0 !important'
        }
      }
    }
  }
});

const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  width: '100%',
  margin: 0,
  padding: 0,
  maxWidth: '100% !important'
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
