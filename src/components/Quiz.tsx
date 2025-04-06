import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  CircularProgress, 
  Alert,
  useTheme,
  useMediaQuery,
  IconButton,
  Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import { getQuestionsFromSheet } from '../services/googleSheets';
import { Question } from '../types';

export default function Quiz() {
  const { sheetName } = useParams<{ sheetName: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatQuestion = (text: string) => {
    // ①, ②, ③, ④ 형식의 선지를 찾아서 앞에 줄바꿈 추가
    return text.replace(/([①②③④])/g, '\n$1');
  };

  const loadQuestions = async () => {
    if (!sheetName) {
      setError('시트 이름이 지정되지 않았습니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedQuestions = await getQuestionsFromSheet(sheetName);
      // 문제 순서를 랜덤으로 섞기
      const shuffledQuestions = [...fetchedQuestions].sort(() => Math.random() - 0.5);
      setQuestions(shuffledQuestions);
      setCurrentQuestionIndex(0);
      setShowAnswer(false);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('문제를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [sheetName]);

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => (prev > 0 ? prev - 1 : questions.length - 1));
    setShowAnswer(false);
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => (prev < questions.length - 1 ? prev + 1 : 0));
    setShowAnswer(false);
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleRefresh = () => {
    loadQuestions();
  };

  const handleHome = () => {
    navigate('/');
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
        <Button 
          variant="contained" 
          onClick={handleHome}
          startIcon={<HomeIcon />}
          sx={{ 
            mt: 2,
            bgcolor: '#103A5A',
            '&:hover': {
              bgcolor: '#0A2A3A'
            }
          }}
        >
          홈으로 가기
        </Button>
      </Container>
    );
  }

  if (questions.length === 0) {
    return (
      <Container sx={{ py: 4, bgcolor: '#F8F7F4' }}>
        <Alert severity="info">문제가 없습니다.</Alert>
        <Button 
          variant="contained" 
          onClick={handleHome}
          startIcon={<HomeIcon />}
          sx={{ 
            mt: 2,
            bgcolor: '#103A5A',
            '&:hover': {
              bgcolor: '#0A2A3A'
            }
          }}
        >
          홈으로 가기
        </Button>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Container sx={{ 
      py: 4,
      bgcolor: '#F8F7F4',
      minHeight: '100vh'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            color: '#103A5A'
          }}
        >
          {decodeURIComponent(sheetName || '')}
        </Typography>
        <IconButton 
          onClick={handleHome}
          sx={{ 
            color: '#103A5A',
            '&:hover': {
              bgcolor: '#103A5A20'
            }
          }}
        >
          <HomeIcon />
        </IconButton>
      </Box>

      <Paper 
        elevation={3}
        sx={{ 
          p: 3,
          borderRadius: 2,
          bgcolor: 'white',
          mb: 3
        }}
      >
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 2,
            whiteSpace: 'pre-line',
            fontSize: isMobile ? '1rem' : '1.1rem',
            color: '#103A5A'
          }}
        >
          {formatQuestion(currentQuestion.question)}
        </Typography>
        {showAnswer && (
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 'bold',
              whiteSpace: 'pre-line',
              fontSize: isMobile ? '1rem' : '1.1rem',
              color: '#103A5A',
              bgcolor: '#103A5A10',
              p: 2,
              borderRadius: 1
            }}
          >
            {currentQuestion.answer}
          </Typography>
        )}
      </Paper>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap'
      }}>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          startIcon={<ArrowBackIcon />}
          sx={{ 
            flex: isMobile ? '1 1 40%' : '0 1 auto',
            minWidth: isMobile ? '120px' : 'auto',
            color: '#103A5A',
            borderColor: '#103A5A',
            '&:hover': {
              borderColor: '#103A5A',
              bgcolor: '#103A5A10'
            }
          }}
        >
          이전
        </Button>
        <Typography 
          variant="body2" 
          sx={{ 
            flex: '0 1 auto',
            textAlign: 'center',
            color: '#103A5A'
          }}
        >
          {currentQuestionIndex + 1} / {questions.length}
        </Typography>
        <Button
          variant="outlined"
          onClick={handleNext}
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            flex: isMobile ? '1 1 40%' : '0 1 auto',
            minWidth: isMobile ? '120px' : 'auto',
            color: '#103A5A',
            borderColor: '#103A5A',
            '&:hover': {
              borderColor: '#103A5A',
              bgcolor: '#103A5A10'
            }
          }}
        >
          다음
        </Button>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: 2,
        mt: 3
      }}>
        <Button
          variant="contained"
          onClick={handleShowAnswer}
          disabled={showAnswer}
          sx={{ 
            minWidth: isMobile ? '120px' : '150px',
            bgcolor: '#103A5A',
            '&:hover': {
              bgcolor: '#0A2A3A'
            },
            '&:disabled': {
              bgcolor: '#103A5A80'
            }
          }}
        >
          답 보기
        </Button>
        <IconButton 
          onClick={handleRefresh}
          sx={{ 
            color: '#103A5A',
            bgcolor: 'white',
            boxShadow: 1,
            '&:hover': {
              bgcolor: '#103A5A10'
            }
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>
    </Container>
  );
} 