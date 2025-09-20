import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Divider } from '@mui/material';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import axios from 'axios';

const ItineraryPage: React.FC = () => {
  // Helper to get coordinates from place details (dummy fallback if not available)
  const getCoords = (place: any) => {
    if (place && place.geometry && place.geometry.location) {
      return {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      };
    }
    return { lat: 13.7563, lng: 100.5018 };
  };

  // State for Google Maps API key
  const [mapsApiKey, setMapsApiKey] = useState<string>('');

  useEffect(() => {
    axios.get('http://localhost:8000/config/maps-key')
      .then(res => setMapsApiKey(res.data.mapsApiKey));
  }, []);

  const location = useLocation();
  const itineraryData = location.state?.itinerary?.itinerary;

  if (!itineraryData) {
    return <Typography variant="h6" color="error">No itinerary data found.</Typography>;
  }

  // Collect all places for markers
  const allPlaces: any[] = [];
  itineraryData.days?.forEach((day: any) => {
    day.activities?.forEach((activity: any) => {
      activity.places?.forEach((place: any) => {
        allPlaces.push(place);
      });
    });
    day.food_recommendations?.forEach((food: any) => {
      food.places?.forEach((place: any) => {
        allPlaces.push(place);
      });
    });
  });

  // Center map on first place or fallback
  const center = allPlaces.length > 0 ? getCoords(allPlaces[0]) : { lat: 13.7563, lng: 100.5018 };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Trip Itinerary
      </Typography>      Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser      cd C:\Users\Aishwarya\Desktop\credits\GeminiGo\backend      cd C:\Users\Aishwarya\Desktop\credits\GeminiGo\backend
      {/* Trip summary (customize as needed) */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>Trip Summary</Typography>
          {(() => {
            let summary = location.state?.itinerary?.itinerary;
            let parsed;
            try {
              parsed = typeof summary === 'string' ? JSON.parse(summary) : summary;
            } catch (e) {
              parsed = null;
            }
            if (parsed) {
              return (
                <Box>
                  {/* Days */}
                  {parsed.days?.map((day: any, idx: number) => (
                    <Card key={idx} sx={{ mb: 4, boxShadow: 3, borderRadius: 3, background: '#f8fbff' }}>
                      <CardContent>
                        <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                          Day {day.day}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocalActivityIcon sx={{ color: '#1976d2', mr: 1 }} />
                          <Typography variant="subtitle1" fontWeight="bold">Activities</Typography>
                        </Box>
                        <ul style={{ marginLeft: 32, marginBottom: 16 }}>
                          {day.activities?.map((activity: any, i: number) => (
                            <li key={i} style={{ fontSize: '1rem', marginBottom: 8, color: '#333', lineHeight: 1.6 }}>
                              {activity}
                            </li>
                          ))}
                        </ul>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 2 }}>
                          <RestaurantIcon sx={{ color: '#43a047', mr: 1 }} />
                          <Typography variant="subtitle1" fontWeight="bold">Food Recommendations</Typography>
                        </Box>
                        <ul style={{ marginLeft: 32 }}>
                          {day.food_recommendations?.map((food: any, i: number) => (
                            <li key={i} style={{ fontSize: '1rem', marginBottom: 8, color: '#1976d2', lineHeight: 1.6 }}>
                              {food}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                  {/* Budget Breakdown */}
                  {parsed.budget_breakdown && (
                    <Box sx={{ mb: 4, p: 3, background: '#e3f2fd', borderRadius: 2, boxShadow: 1 }}>
                      <Typography variant="h6" color="secondary" fontWeight="bold" sx={{ mb: 2 }}>Budget Breakdown</Typography>
                      <ul style={{ marginLeft: 24 }}>
                        {Object.entries(parsed.budget_breakdown).map(([key, value]) => (
                          <li key={key} style={{ fontSize: '1rem', marginBottom: 6 }}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {String(value)}</li>
                        ))}
                      </ul>
                    </Box>
                  )}
                  {/* Notes */}
                  {parsed.notes && (
                    <Box sx={{ mb: 2, p: 3, background: '#fffde7', borderRadius: 2, boxShadow: 1 }}>
                      <Typography variant="h6" color="warning.main" fontWeight="bold" sx={{ mb: 2 }}>Notes</Typography>
                      <ul style={{ marginLeft: 24 }}>
                        {parsed.notes.map((note: string, i: number) => (
                          <li key={i} style={{ fontSize: '1rem', marginBottom: 6 }}>{note}</li>
                        ))}
                      </ul>
                    </Box>
                  )}
                </Box>
              );
            }
            // fallback: show as plain text
            return (
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', fontFamily: 'monospace', background: '#f5f5f5', p: 2, borderRadius: 2 }}>
                {summary || 'No summary available.'}
              </Typography>
            );
          })()}
        </CardContent>
      </Card>
      {/* Daily plans removed: now shown in styled summary above */}
      {/* Google Map with markers */}
      <Box sx={{ mt: 6, height: 400 }}>
        {mapsApiKey && (
          <APIProvider apiKey={mapsApiKey}>
            <Map center={center} zoom={12} style={{ width: '100%', height: '100%' }}>
              {allPlaces.map((place, idx) => {
                const coords = getCoords(place);
                return <Marker key={idx} position={coords} title={place.name} />;
              })}
            </Map>
          </APIProvider>
        )}
      </Box>
    </Box>
  );
};

export default ItineraryPage;
