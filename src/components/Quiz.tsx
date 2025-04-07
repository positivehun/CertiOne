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
  options?: string[];
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  minHeight: 'calc(100vh - 250px)',
  height: 'calc(100vh - 250px)',
  overflow: 'auto',
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
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  backgroundColor: 'white',
  boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  zIndex: 1000,
  [theme.breakpoints.up('sm')]: {
    maxWidth: '600px',
    margin: '0 auto',
    left: '50%',
    transform: 'translateX(-50%)',
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  flex: 1,
  height: '48px',
  fontSize: '1rem',
  fontWeight: 'bold',
  borderRadius: '8px',
  textTransform: 'none',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '180px',
  }
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
      setError(null);
      
      if (!subject) {
        setError('과목이 선택되지 않았습니다.');
        return;
      }

      console.log('Loading questions for subject:', subject);
      const fetchedQuestions = await getQuestionsFromSheet(subject);
      
      if (fetchedQuestions.length === 0) {
        setError('이 과목에는 아직 문제가 없습니다.');
        return;
      }

      console.log('Loaded questions:', fetchedQuestions);
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
    if (showAnswer) {
      // 이미 답을 확인한 상태라면 다음 문제로 이동
      handleNext();
    } else {
      // 답을 처음 확인하는 경우
      setShowAnswer(true);
      const currentQuestion = questions[currentQuestionIndex];
      const isAnswerCorrect = isMultipleChoice(currentQuestion.question)
        ? selectedAnswer === currentQuestion.answer
        : userAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
      setIsCorrect(isAnswerCorrect);
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(e.target.value);
  };

  const getOptionColor = (option: string) => {
    if (selectedAnswer === option) {
      return '#103A5A';
    } else if (showAnswer && option === questions[currentQuestionIndex].answer) {
      return '#d32f2f';
    } else {
      return 'inherit';
    }
  };

  const isAnswerChecked = selectedAnswer !== '';

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
      <Box 
        sx={{ 
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%',
          pb: '80px'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4
        }}>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              color: '#103A5A',
              mb: 2,
              textAlign: 'center',
              fontSize: isMobile ? '1rem' : '1.25rem'
            }}
          >
            {subject}
          </Typography>
          <Box 
            component="img"
            src="/logo.png"
            alt="로고"
            sx={{
              width: isMobile ? '100px' : '120px',
              height: 'auto'
            }}
          />
        </Box>

        <StyledPaper elevation={3} sx={{ width: '100%' }}>
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h6" 
              component="h2" 
              gutterBottom
              sx={{ 
                color: '#103A5A',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: isMobile ? '1rem' : '1.25rem'
              }}
            >
              문제 {currentQuestionIndex + 1} / {questions.length}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3,
                whiteSpace: 'pre-line',
                fontSize: isMobile ? '1rem' : '1.1rem',
                lineHeight: 1.6
              }}
            >
              {formatQuestion(currentQuestion.question)}
            </Typography>

            {isMultipleChoiceQuestion ? (
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup
                  value={selectedAnswer}
                  onChange={handleAnswerChange}
                >
                  {currentQuestion.options?.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={
                        <Radio 
                          sx={{
                            color: '#103A5A',
                            '&.Mui-checked': {
                              color: '#103A5A',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ 
                          color: getOptionColor(option),
                          fontWeight: isAnswerChecked && (option === currentQuestion.answer || option === selectedAnswer) ? 'bold' : 'normal',
                          fontSize: isMobile ? '1rem' : '1.1rem'
                        }}>
                          {option}
                        </Typography>
                      }
                      sx={{
                        mb: 2,
                        '&:last-child': {
                          mb: 0
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                variant="outlined"
                value={selectedAnswer}
                onChange={handleAnswerChange}
                placeholder="답을 입력하세요"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#103A5A',
                    },
                    '&:hover fieldset': {
                      borderColor: '#103A5A',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#103A5A',
                    },
                    '& input': {
                      fontSize: isMobile ? '1rem' : '1.1rem'
                    }
                  },
                }}
              />
            )}
          </Box>
        </StyledPaper>
      </Box>

      <ButtonContainer>
        <ActionButton
          variant="contained"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          sx={{ 
            bgcolor: '#103A5A',
            '&:hover': {
              bgcolor: '#0a2647'
            },
            '&:disabled': {
              bgcolor: '#103A5A80'
            }
          }}
        >
          이전
        </ActionButton>
        <ActionButton
          variant="contained"
          onClick={handleCheckAnswer}
          disabled={!selectedAnswer}
          sx={{ 
            bgcolor: '#103A5A',
            '&:hover': {
              bgcolor: '#0a2647'
            },
            '&:disabled': {
              bgcolor: '#103A5A80'
            }
          }}
        >
          정답 확인
        </ActionButton>
        <ActionButton
          variant="contained"
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
          sx={{ 
            bgcolor: '#103A5A',
            '&:hover': {
              bgcolor: '#0a2647'
            },
            '&:disabled': {
              bgcolor: '#103A5A80'
            }
          }}
        >
          다음
        </ActionButton>
      </ButtonContainer>
    </Container>
  );
};

export default Quiz; 