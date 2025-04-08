import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SubtitleList: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Box sx={{ 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      p: 2
    }}>
      <Box sx={{ 
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4
      }}>
        <Box 
          component="img"
          src="/logo.png"
          alt="로고"
          onClick={handleLogoClick}
          sx={{
            width: isMobile ? '100px' : '120px',
            height: 'auto',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
        />
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          sx={{ 
            color: '#103A5A',
            fontWeight: 'bold',
            fontSize: isMobile ? '1rem' : '1.25rem'
          }}
        >
          자격증 문제를 한번에
        </Typography>
      </Box>
    </Box>
  );
};

export default SubtitleList; 