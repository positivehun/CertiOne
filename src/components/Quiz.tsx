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
  maxHeight: 'calc(100vh - 250px)',
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
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
    // 문제 텍스트에서 선택지 부분을 분리
    const [questionText, ...optionTexts] = text.split(/([①②③④])/g).filter(Boolean);
    
    // options 배열을 현재 문제 객체에 저장
    if (isMultipleChoice(text) && optionTexts.length > 0) {
      const options: string[] = [];
      for (let i = 0; i < optionTexts.length; i += 2) {
        if (optionTexts[i] && optionTexts[i + 1]) {
          options.push(optionTexts[i] + optionTexts[i + 1].trim());
        }
      }
      currentQuestion.options = options;
    }
    
    return questionText.trim();
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
      // 선택한 답에서 번호(①②③④)만 추출하여 비교
      const selectedMarker = selectedAnswer.match(/[①②③④]/)?.[0] || '';
      const correctMarker = currentQuestion.answer.match(/[①②③④]/)?.[0] || '';
      const isAnswerCorrect = selectedMarker === correctMarker;
      setIsCorrect(isAnswerCorrect);
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(e.target.value);
    setShowAnswer(false); // 답을 변경하면 정답 확인 상태 초기화
    setIsCorrect(null);
  };

  const getOptionColor = (option: string) => {
    if (!showAnswer) {
      return 'inherit';
    }
    const optionMarker = option.match(/[①②③④]/)?.[0] || '';
    const correctMarker = questions[currentQuestionIndex].answer.match(/[①②③④]/)?.[0] || '';
    const selectedMarker = selectedAnswer.match(/[①②③④]/)?.[0] || '';

    if (optionMarker === correctMarker) {
      return '#1976d2'; // 정답은 파란색
    }
    if (optionMarker === selectedMarker && optionMarker !== correctMarker) {
      return '#d32f2f'; // 선택한 오답은 빨간색
    }
    return 'inherit';
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
      maxWidth="lg"
      disableGutters
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
          <Box sx={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <IconButton 
              onClick={handleHome}
              sx={{ 
                color: '#103A5A',
                '&:hover': {
                  bgcolor: 'rgba(16, 58, 90, 0.04)'
                }
              }}
            >
              <HomeIcon />
            </IconButton>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                color: '#103A5A',
                textAlign: 'center',
                fontSize: isMobile ? '1rem' : '1.25rem',
                flex: 1
              }}
            >
              {subject}
            </Typography>
            <Box sx={{ width: 40 }} /> {/* 좌우 대칭을 위한 빈 공간 */}
          </Box>
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

            <Box sx={{ 
              minHeight: '300px',  // 최소 높이 설정
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}>
              {isMultipleChoiceQuestion ? (
                <FormControl component="fieldset" sx={{ width: '100%' }}>
                  <RadioGroup
                    value={selectedAnswer}
                    onChange={handleAnswerChange}
                  >
                    {['①', '②', '③', '④'].map((marker, index) => {
                      const option = currentQuestion.options?.[index] || `${marker}`;
                      return (
                        <FormControlLabel
                          key={index}
                          value={option}
                          control={
                            <Radio 
                              sx={{
                                color: '#103A5A',
                                '&.Mui-checked': {
                                  color: showAnswer ? 
                                    (selectedAnswer === option ? 
                                      ((selectedAnswer.match(/[①②③④]/)?.[0] || '') === (currentQuestion.answer.match(/[①②③④]/)?.[0] || '') ? '#1976d2' : '#d32f2f')
                                      : '#103A5A')
                                    : '#103A5A',
                              },
                            }}
                          />
                          }
                          label={
                            <Typography sx={{ 
                              color: showAnswer && selectedAnswer === option ? 
                                ((selectedAnswer.match(/[①②③④]/)?.[0] || '') === (currentQuestion.answer.match(/[①②③④]/)?.[0] || '') ? '#1976d2' : '#d32f2f')
                                : '#103A5A',
                              fontWeight: showAnswer && selectedAnswer === option ? 'bold' : 'normal',
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
                      );
                    })}
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
                        fontSize: isMobile ? '1rem' : '1.1rem',
                        color: showAnswer ? 
                          (selectedAnswer === currentQuestion.answer ? '#1976d2' : '#d32f2f')
                          : 'inherit'
                      }
                    },
                  }}
                />
              )}

              {showAnswer && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(16, 58, 90, 0.05)', borderRadius: 1 }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: isCorrect ? '#1976d2' : '#d32f2f',
                      fontWeight: 'bold'
                    }}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircleIcon />
                        정답입니다!
                      </>
                    ) : (
                      <>
                        <CancelIcon />
                        오답입니다. 정답: {currentQuestion.answer}
                      </>
                    )}
                  </Typography>
                </Box>
              )}
            </Box>
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
          {showAnswer ? '다음 문제' : '정답 확인'}
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