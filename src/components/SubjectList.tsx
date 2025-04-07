import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  CircularProgress, 
  Alert,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  Paper,
  styled
} from '@mui/material';
import { getSheets } from '../services/googleSheets';
import { Sheet } from '../types';

// 고정된 시트 ID
const FIXED_SHEET_ID = '1lbdwRNzG30akrgbHx-DClXH6WS28hwEv2MWVGvNHIGs';

const SubjectButton = styled(Button)(({ theme }) => ({
  width: '100%',
  height: '60px',
  marginBottom: theme.spacing(2),
  backgroundColor: '#103A5A',
  color: 'white',
  padding: '0 24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: '#0a2647',
  },
  '& .MuiButton-label': {
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: 'clamp(0.8rem, 2vw, 1rem)',
    textAlign: 'center',
    padding: '0 16px'
  }
}));

export default function SubjectList() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [availableSheets, setAvailableSheets] = useState<Sheet[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        setLoading(true);
        const sheets = await getSheets();
        setAvailableSheets(sheets);
        if (sheets.length > 0) {
          setSelectedSheet(sheets[0].title);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching sheets:', err);
        setError('시트 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSheets();
  }, []);

  const handleStartQuiz = () => {
    if (selectedSheet) {
      navigate(`/quiz/${encodeURIComponent(selectedSheet)}`);
    } else {
      setError('과목을 선택해주세요.');
    }
  };

  if (loading) {
    return (
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        py: 4,
        bgcolor: '#F8F7F4'
      }}>
        <CircularProgress sx={{ color: '#103A5A' }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4, bgcolor: '#F8F7F4' }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          fullWidth
          sx={{
            bgcolor: '#103A5A',
            '&:hover': {
              bgcolor: '#0a2647'
            }
          }}
        >
          홈으로 가기
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ 
      py: 4,
      bgcolor: '#F8F7F4',
      minHeight: '100vh'
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        mb: 6
      }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            color: '#103A5A',
            mb: 2,
            textAlign: 'center'
          }}
        >
          자격증 문제를 한번에
        </Typography>
        <Box 
          component="img"
          src="/logo.png"
          alt="로고"
          sx={{
            width: isMobile ? '120px' : '150px',
            height: 'auto',
            mb: 4
          }}
        />
      </Box>
      
      <Paper 
        elevation={3}
        sx={{ 
          maxWidth: 600,
          mx: 'auto',
          p: 4,
          borderRadius: 2,
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          component="h2" 
          gutterBottom
          sx={{ 
            mb: 3,
            textAlign: 'center',
            color: '#103A5A'
          }}
        >
          퀴즈 시트 선택
        </Typography>

        <FormControl fullWidth sx={{ mb: 3, maxWidth: '400px' }}>
          <InputLabel id="sheet-select-label" sx={{ color: '#103A5A' }}>시트 선택</InputLabel>
          <Select
            labelId="sheet-select-label"
            value={selectedSheet}
            label="시트 선택"
            onChange={(e) => setSelectedSheet(e.target.value)}
            sx={{
              color: '#103A5A',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#103A5A'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#103A5A'
              }
            }}
          >
            {availableSheets.map((sheet) => (
              <MenuItem key={sheet.id} value={sheet.title} sx={{ color: '#103A5A' }}>
                {sheet.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <SubjectButton 
          variant="contained" 
          onClick={handleStartQuiz}
          disabled={!selectedSheet}
          fullWidth
          sx={{ maxWidth: '400px' }}
        >
          퀴즈 시작
        </SubjectButton>
      </Paper>
    </Container>
  );
} 