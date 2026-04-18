import React from 'react';
import { AnimatePresence } from 'framer-motion';
import TripForm from './components/TripForm';
import MapView from './components/MapView';
import TripSummary from './components/TripSummary';
import LogList from './components/LogList';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { useTripPlanner } from './hooks/useTripPlanner';
import { useStickySidebar } from './hooks/useStickySidebar';

export default function App() {
  const { formData, loading, tripData, error, handleInputChange, handlePlanTrip } = useTripPlanner();
  const { sidebarRef, stickyOffset } = useStickySidebar(tripData);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100/40 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <Header />

      <main className="max-w-screen-2xl mx-auto p-4 md:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
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
