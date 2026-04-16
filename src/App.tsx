import React, { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

import { TripData, TripFormData } from './types/trip';
import TripForm from './components/TripForm';
import MapView from './components/MapView';
import TripSummary from './components/TripSummary';
import LogList from './components/LogList';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

const API_BASE_URL = 'http://localhost:8000/api';

export default function App() {
  const [formData, setFormData] = useState<TripFormData>({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    cycle_used: '0'
  });

  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [error, setError] = useState('');

  const sidebarRef = useRef<HTMLDivElement>(null);
  const [stickyOffset, setStickyOffset] = useState(112); // Default to top-28 (112px)
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current) return;

      const sidebarHeight = sidebarRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;
      
      const topOffset = 112; // top-28
      const bottomPadding = 40;
      
      // Only apply special sticky logic if sidebar is taller than viewport
      if (sidebarHeight > viewportHeight - topOffset) {
        const bottomOffset = viewportHeight - sidebarHeight - bottomPadding;
        
        if (isScrollingDown) {
          // When scrolling down, the sidebar can move up until its bottom is visible
          setStickyOffset(prev => Math.max(bottomOffset, prev - (currentScrollY - lastScrollY.current)));
        } else {
          // When scrolling up, the sidebar can move down until its top is visible
          setStickyOffset(prev => Math.min(topOffset, prev + (lastScrollY.current - currentScrollY)));
        }
      } else {
        setStickyOffset(topOffset);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tripData]); // Re-calculate when tripData (and thus sidebar height) changes

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handlePlanTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/plan-trip/`, {
        current_location: formData.current_location,
        pickup_location: formData.pickup_location,
        dropoff_location: formData.dropoff_location,
        cycle_used: formData.cycle_used
      });
      setTripData(response.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to calculate trip. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100/40 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <Header />

      <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        {/* Left Column: Input & Summary */}
        <aside className="lg:col-span-4">
          <div 
            ref={sidebarRef}
            style={{ top: stickyOffset }}
            className="sticky space-y-8"
          >
            <TripForm
              formData={formData}
              onChange={handleInputChange}
              onSubmit={handlePlanTrip}
              loading={loading}
              error={error}
            />

            <AnimatePresence mode="wait">
              {tripData && (
                <TripSummary data={tripData} />
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Right Column: Visualization & Logs */}
        <div className="lg:col-span-8 space-y-12">
          {/* Map Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-sm font-black flex items-center gap-3 text-slate-400 uppercase tracking-[0.2em]">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                Live Route Overview
              </h2>
            </div>
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5 border border-white">
              <MapView tripData={tripData} />
            </div>
          </section>

          {/* Logs Section */}
          <LogList tripData={tripData} loading={loading} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
