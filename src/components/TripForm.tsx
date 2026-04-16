import React from 'react';
import { MapPin, Clock, Truck, Navigation, AlertCircle, Info } from 'lucide-react';
import { TripFormData } from '../types/trip';

interface TripFormProps {
  formData: TripFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
}

const TripForm = ({ formData, onChange, onSubmit, loading, error }: TripFormProps) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-white p-8 md:p-10 relative overflow-hidden group">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black flex items-center gap-4 text-slate-800 tracking-tight">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Navigation size={24} />
            </div>
            Trip Planner
          </h2>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Ready</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-6">
            {[
              { id: 'current_location', label: 'Current Location', placeholder: 'City, State or Zip', icon: MapPin, helper: 'Your truck\'s current position' },
              { id: 'pickup_location', label: 'Pickup Location', placeholder: 'Where is the load?', icon: MapPin, helper: 'Origin point for the shipment' },
              { id: 'dropoff_location', label: 'Dropoff Location', placeholder: 'Final destination', icon: MapPin, helper: 'Destination for the shipment' },
            ].map(({ id, label, placeholder, icon: Icon, helper }) => (
              <div key={id} className="group/field relative">
                <div className="flex items-center justify-between mb-2 px-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] transition-colors group-focus-within/field:text-blue-600">
                    {label}
                  </label>
                  <div className="opacity-0 group-hover/field:opacity-100 transition-opacity">
                    <Info size={12} className="text-slate-300 cursor-help" >{helper}</Info>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-focus-within/field:bg-blue-50 group-focus-within/field:text-blue-500 transition-all">
                    <Icon size={18} />
                  </div>
                  <input
                    type="text"
                    name={id}
                    className="w-full pl-16 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium shadow-inner group-hover/field:bg-slate-100/50"
                    placeholder={placeholder}
                    value={(formData as any)[id]}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
            ))}

            <div className="group/field relative">
              <div className="flex items-center justify-between mb-2 px-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] transition-colors group-focus-within/field:text-blue-600">
                  Current Cycle Used
                </label>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">70hr / 8day</span>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-focus-within/field:bg-blue-50 group-focus-within/field:text-blue-500 transition-all">
                  <Clock size={18} />
                </div>
                <input
                  type="number"
                  name="cycle_used"
                  className="w-full pl-16 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-[1.25rem] focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 placeholder:font-medium shadow-inner group-hover/field:bg-slate-100/50"
                  placeholder="0.0"
                  step="0.1"
                  value={formData.cycle_used}
                  onChange={onChange}
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-300 text-xs">
                  Hours
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full relative group/btn overflow-hidden rounded-[1.25rem] hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 transition-transform duration-500 group-hover/btn:scale-105" />
            <div className="relative flex items-center justify-center gap-3 py-5 px-8 text-white font-black uppercase tracking-widest text-sm transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100">
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Route...</span>
                </div>
              ) : (
                <>
                  <Truck size={20} className="group-hover/btn:animate-bounce" />
                  <span>Calculate Trip</span>
                </>
              )}
            </div>
          </button>
        </form>

        {error && (
          <div className="mt-8 p-5 bg-red-50 border border-red-100 text-red-700 text-sm rounded-[1.5rem] flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <div className="space-y-1">
              <p className="font-black uppercase tracking-widest text-[10px]">Optimization Error</p>
              <p className="font-bold text-slate-600 leading-relaxed">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TripForm);
