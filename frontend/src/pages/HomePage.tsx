import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const backgroundImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80'; // Example image

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        textAlign: 'center',
      }}
    >
      <Typography variant="h2" fontWeight="bold" gutterBottom>
        Your Next Adventure Awaits
      </Typography>
      <Typography variant="h5" gutterBottom>
        Discover, plan, and experience the world your way.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 4, px: 6, py: 2, fontSize: '1.2rem', borderRadius: 3 }}
        onClick={() => navigate('/book')}
      >
        Plan My Trip
      </Button>
    </Box>
  );
};

export default HomePage;
