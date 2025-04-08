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
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(10);  // 기본값 10문제
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
      navigate(`/quiz/${encodeURIComponent(selectedSheet)}?count=${selectedQuestionCount}`);
    } else {
      setError('과목을 선택해주세요.');
    }
  };

  if (loading) {
    return (
      <Container 
        maxWidth={false}
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          py: 4,
          bgcolor: '#F8F7F4',
          px: 2
        }}
      >
        <CircularProgress sx={{ color: '#103A5A' }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container 
        maxWidth={false}
        sx={{ 
          py: 4,
          bgcolor: '#F8F7F4',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: 2
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '600px' }}>
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
        </Box>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="lg"
      disableGutters
      sx={{ 
        py: 4,
        bgcolor: '#F8F7F4',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: 2,
        width: '100vw',
        position: 'fixed',
        left: 0,
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          position: 'relative'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              color: '#103A5A',
              mb: 1,
              textAlign: 'center',
              fontSize: isMobile ? '1rem' : '1.25rem'
            }}
          >
            자격증 문제를 한번에
          </Typography>
          <Box 
            component="img"
            src="/logo.png"
            alt="로고"
            sx={{
              width: isMobile ? '140px' : '180px',
              height: 'auto',
              clipPath: 'inset(2px 2px 2px 2px)'
            }}
          />
        </Box>
        
        <Paper 
          elevation={3}
          sx={{ 
            width: '100%',
            p: 4,
            borderRadius: 2,
            bgcolor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: 'calc(100vh - 150px)',
            height: 'calc(100vh - 150px)',
            maxHeight: 'calc(100vh - 150px)',
            overflow: 'hidden',
            mt: 2
          }}
        >
          <Box sx={{ 
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
            mt: 2
          }}>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component="h2" 
              gutterBottom
              sx={{ 
                textAlign: 'center',
                color: '#103A5A',
                fontSize: isMobile ? '1.3rem' : '1.6rem',
                fontWeight: 'bold',
                mb: 0
              }}
            >
              과목 선택
            </Typography>
          </Box>

          <Box sx={{ 
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowY: 'auto',
            pt: 2,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#103A5A',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#0a2647',
            }
          }}>
            <FormControl sx={{ width: '100%', maxWidth: '600px', mb: 3 }}>
              <Select
                value={selectedSheet}
                onChange={(e) => setSelectedSheet(e.target.value)}
                displayEmpty
                sx={{
                  width: '100%',
                  color: '#103A5A',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#103A5A',
                    top: 0,
                    legend: { display: 'none' }
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#103A5A'
                  },
                  '& .MuiSelect-select': {
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    padding: '14px'
                  }
                }}
              >
                <MenuItem value="" disabled>과목 선택</MenuItem>
                {availableSheets.map((sheet) => (
                  <MenuItem 
                    key={sheet.id} 
                    value={sheet.title} 
                    sx={{ 
                      color: '#103A5A',
                      fontSize: isMobile ? '1rem' : '1.1rem'
                    }}
                  >
                    {sheet.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ 
              width: '100%', 
              maxWidth: '600px', 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}>
              <Button
                variant="outlined"
                onClick={() => setSelectedQuestionCount(prev => Math.max(10, prev - 10))}
                sx={{
                  minWidth: '40px',
                  height: '40px',
                  color: '#103A5A',
                  borderColor: '#103A5A',
                  fontSize: '1.5rem',
                  padding: 0,
                  '&:hover': {
                    backgroundColor: 'rgba(16, 58, 90, 0.1)',
                    borderColor: '#103A5A'
                  }
                }}
              >
                -
              </Button>
              <Typography
                sx={{
                  color: '#103A5A',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  minWidth: '100px',
                  textAlign: 'center'
                }}
              >
                {selectedQuestionCount}문제
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setSelectedQuestionCount(prev => Math.min(100, prev + 10))}
                sx={{
                  minWidth: '40px',
                  height: '40px',
                  color: '#103A5A',
                  borderColor: '#103A5A',
                  fontSize: '1.5rem',
                  padding: 0,
                  '&:hover': {
                    backgroundColor: 'rgba(16, 58, 90, 0.1)',
                    borderColor: '#103A5A'
                  }
                }}
              >
                +
              </Button>
            </Box>

            <SubjectButton 
              variant="contained" 
              onClick={handleStartQuiz}
              disabled={!selectedSheet}
              sx={{ width: '100%', maxWidth: '600px' }}
            >
              문제풀기
            </SubjectButton>
            <Typography
              sx={{
                color: '#103A5A',
                fontSize: isMobile ? '1rem' : '1.1rem',
                mt: 3,
                textAlign: 'center',
                opacity: 0.8
              }}
            >
              문제 추가 및 과목추가 문의메일
            </Typography>
            <Typography
              sx={{
                color: '#103A5A',
                fontSize: isMobile ? '1.1rem' : '1.2rem',
                fontWeight: 'bold',
                mt: 1,
                textAlign: 'center'
              }}
            >
              certionequest@gmail.com
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 