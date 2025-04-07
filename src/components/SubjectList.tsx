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
  Paper
} from '@mui/material';
import { getSheets } from '../services/googleSheets';
import { Sheet } from '../types';

// 고정된 시트 ID
const FIXED_SHEET_ID = '1lbdwRNzG30akrgbHx-DClXH6WS28hwEv2MWVGvNHIGs';

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
        <Alert severity="error">{error}</Alert>
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
          bgcolor: 'white'
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

        <FormControl fullWidth sx={{ mb: 3 }}>
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

        <Button 
          variant="contained" 
          onClick={handleStartQuiz}
          disabled={!selectedSheet}
          fullWidth
          sx={{ 
            py: isMobile ? 1.5 : 2,
            fontSize: isMobile ? '1rem' : '1.1rem',
            fontWeight: 'bold',
            bgcolor: '#103A5A',
            '&:hover': {
              bgcolor: '#0A2A3A'
            },
            '&:disabled': {
              bgcolor: '#103A5A80'
            }
          }}
        >
          퀴즈 시작
        </Button>
      </Paper>
    </Container>
  );
} 