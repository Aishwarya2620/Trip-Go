from pydantic import BaseModel
from typing import List, Dict, Any


class Activity(BaseModel):
    name: str
    place_details: Dict[str, Any]  # e.g., {"place_id": ..., "rating": ..., "address": ...}

class ItineraryDay(BaseModel):
    day: int
    activities: List[Activity]
    food_recommendations: List[str]

class ItineraryResponse(BaseModel):
    days: List[ItineraryDay]

class TripRequest(BaseModel):
    source: str
    destination: str
    budget: str  # e.g., 'mid-range'
    duration_days: int
    interests: List[str]
    constraints: str  # e.g., 'no hiking'
    travel_style: str  # e.g., 'luxury', 'adventure'
    travelers: str  # e.g., 'solo', 'family of 4'

class ReviewSummary(BaseModel):
    pros: List[str]
    cons: List[str]