
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Stepper, Step, StepLabel, Paper } from '@mui/material';
// Removed duplicate import statement

interface FormData {
  source: string;
  destination: string;
  budget: string;
  duration: string;
  interests: string;
  constraints: string;
  travelStyle: string;
  travelers: string;
}

const BookingFormPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    source: '',
    destination: '',
    budget: '',
    duration: '',
    interests: '',
    constraints: '',
    travelStyle: '',
    travelers: '',
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentStep((prev) => prev + 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    // Transform formData to match backend TripRequest
    const payload = {
      source: formData.source,
      destination: formData.destination,
      budget: formData.budget,
      duration_days: Number(formData.duration),
      interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
      constraints: formData.constraints,
      travel_style: formData.travelStyle,
      travelers: formData.travelers,
    };
    try {
      const response = await axios.post('http://localhost:8000/itinerary/generate', payload);
      navigate('/itinerary', { state: { itinerary: response.data } });
    } catch (err: any) {
      setError('Sorry, something went wrong while planning your trip. Please try again.');
    }
  };

  let stepContent;
  const steps = [
    'Where are you traveling?',
    'Budget & Duration',
    'Interests & Constraints',
    'Travel Style & Travelers',
  ];
  switch (currentStep) {
    case 0:
      stepContent = (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>Step 1: Where are you traveling?</Typography>
          <form onSubmit={handleNext}>
            <TextField
              fullWidth
              label="Source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, width: '100%' }}>Next</Button>
          </form>
        </Paper>
      );
      break;
    case 1:
      stepContent = (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>Step 2: Budget & Duration</Typography>
          <form onSubmit={handleNext}>
            <TextField
              fullWidth
              label="Budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Duration (days)"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              type="number"
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, width: '100%' }}>Next</Button>
          </form>
        </Paper>
      );
      break;
    case 2:
      stepContent = (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>Step 3: Interests & Constraints</Typography>
          <form onSubmit={handleNext}>
            <TextField
              fullWidth
              label="Interests (comma separated)"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Constraints"
              name="constraints"
              value={formData.constraints}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, width: '100%' }}>Next</Button>
          </form>
        </Paper>
      );
      break;
    case 3:
      stepContent = (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>Step 4: Travel Style & Travelers</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Travel Style"
              name="travelStyle"
              value={formData.travelStyle}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Travelers"
              name="travelers"
              value={formData.travelers}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, width: '100%' }}>Submit</Button>
          </form>
        </Paper>
      );
      break;
    default:
      stepContent = <Typography variant="h5" color="primary" sx={{ mt: 4 }}>Thank you! Your trip is being planned.</Typography>;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', py: 6 }}>
      <Stepper activeStep={currentStep} alternativeLabel sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}>
        {steps.map((label, idx) => (
          <Step key={label} completed={currentStep > idx}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {stepContent}
      {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}
    </Box>
  );
};

export default BookingFormPage;
