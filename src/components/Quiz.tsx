import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionsFromSheet } from '../services/googleSheets';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Paper,
  useMediaQuery,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  styled
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface Question {
  question: string;
  answer: string;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  minHeight: '300px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  backgroundColor: 'white',
  boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
  zIndex: 1000
}));

const Quiz: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const isMobile = useMediaQuery('(max-width:600px)');

  const isMultipleChoice = (question: string) => {
    return /[①②③④]/.test(question);
  };

  const formatQuestion = (text: string) => {
    return text.replace(/([①②③④])/g, '\n$1');
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const fetchedQuestions = await getQuestionsFromSheet(subject || '');
      setQuestions(fetchedQuestions);
      setCurrentQuestionIndex(0);
      setSelectedAnswer('');
      setUserAnswer('');
      setShowAnswer(false);
      setIsCorrect(null);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('문제를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [subject]);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setUserAnswer('');
      setShowAnswer(false);
      setIsCorrect(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer('');
      setUserAnswer('');
      setShowAnswer(false);
      setIsCorrect(null);
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleCheckAnswer = () => {
    setShowAnswer(true);
    const currentQuestion = questions[currentQuestionIndex];
    const isAnswerCorrect = isMultipleChoice(currentQuestion.question)
      ? selectedAnswer === currentQuestion.answer
      : userAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
    setIsCorrect(isAnswerCorrect);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (questions.length === 0) {
    return (
      <Container>
        <Alert severity="info">이 과목에는 아직 문제가 없습니다.</Alert>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isMultipleChoiceQuestion = isMultipleChoice(currentQuestion.question);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, pb: 10 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleHome} sx={{ color: '#103A5A' }}>
          <HomeIcon />
        </IconButton>
        <Typography variant="h4" sx={{ color: '#103A5A' }}>
          {decodeURIComponent(subject || '')}
        </Typography>
        <Box sx={{ width: 40 }} />
      </Box>

      <Typography variant="h6" gutterBottom sx={{ color: '#103A5A' }}>
        문제 {currentQuestionIndex + 1} / {questions.length}
      </Typography>

      <StyledPaper>
        <Typography variant="body1" sx={{ 
          whiteSpace: 'pre-line', 
          mb: 3,
          fontSize: isMobile ? '1rem' : '1.1rem',
          color: '#103A5A'
        }}>
          {formatQuestion(currentQuestion.question)}
        </Typography>

        {isMultipleChoiceQuestion ? (
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            >
              {['①', '②', '③', '④'].map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                  sx={{
                    color: showAnswer && selectedAnswer === option
                      ? isCorrect ? '#1976d2' : '#d32f2f'
                      : 'inherit',
                    fontWeight: showAnswer && selectedAnswer === option ? 'bold' : 'normal'
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        ) : (
          <TextField
            fullWidth
            variant="outlined"
            label="답안"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={showAnswer}
            sx={{
              '& .MuiInputBase-input': {
                color: showAnswer
                  ? isCorrect ? '#1976d2' : '#d32f2f'
                  : 'inherit'
              }
            }}
          />
        )}

        {showAnswer && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body1" sx={{ 
              color: '#103A5A',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              {isCorrect ? (
                <>
                  <CheckCircleIcon sx={{ color: '#1976d2' }} />
                  정답입니다!
                </>
              ) : (
                <>
                  <CancelIcon sx={{ color: '#d32f2f' }} />
                  정답: {currentQuestion.answer}
                </>
              )}
            </Typography>
          </Box>
        )}
      </StyledPaper>

      <ButtonContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button
            variant="outlined"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            startIcon={<ArrowBackIcon />}
            sx={{ 
              color: '#103A5A',
              borderColor: '#103A5A',
              '&:hover': {
                borderColor: '#0a2647',
                bgcolor: 'rgba(16, 58, 90, 0.04)'
              }
            }}
          >
            이전
          </Button>
          <Button
            variant="outlined"
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              color: '#103A5A',
              borderColor: '#103A5A',
              '&:hover': {
                borderColor: '#0a2647',
                bgcolor: 'rgba(16, 58, 90, 0.04)'
              }
            }}
          >
            다음
          </Button>
        </Box>
        <Button
          fullWidth
          variant="contained"
          onClick={handleCheckAnswer}
          disabled={showAnswer || (isMultipleChoiceQuestion ? !selectedAnswer : !userAnswer.trim())}
          sx={{ 
            bgcolor: '#103A5A',
            '&:hover': {
              bgcolor: '#0a2647'
            }
          }}
        >
          정답 확인
        </Button>
      </ButtonContainer>
    </Box>
  );
};

export default Quiz; 