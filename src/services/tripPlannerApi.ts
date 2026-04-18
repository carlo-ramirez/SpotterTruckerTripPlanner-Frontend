import axios from 'axios';
import { TripData, TripFormData } from '../types/trip';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function planTrip(formData: TripFormData): Promise<TripData> {
  const response = await axios.post<TripData>(`${API_BASE_URL}/plan-trip/`, {
    current_location: formData.current_location.trim(),
    pickup_location: formData.pickup_location.trim(),
    dropoff_location: formData.dropoff_location.trim(),
    cycle_used: formData.cycle_used
  });

  return response.data;
}
