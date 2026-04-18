import { useState, useCallback } from 'react';
import axios from 'axios';
import { TripData, TripFormData } from '../types/trip';
import { planTrip } from '../services/tripPlannerApi';

const DEFAULT_FORM_DATA: TripFormData = {
  current_location: '',
  pickup_location: '',
  dropoff_location: '',
  cycle_used: '0'
};

export function useTripPlanner() {
  const [formData, setFormData] = useState<TripFormData>(DEFAULT_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [error, setError] = useState('');

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePlanTrip = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await planTrip(formData);
      setTripData(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to calculate trip. Please check your inputs and try again.');
      } else {
        setError('Failed to calculate trip. Please check your inputs and try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return {
    formData,
    loading,
    tripData,
    error,
    handleInputChange,
    handlePlanTrip
  };
}
