import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Activity, ArrowRight, ShieldCheck, Gauge } from 'lucide-react';
import { TripData } from '../types/trip';

interface TripSummaryProps {
  data: TripData;
}

const TripSummary = ({ data }: TripSummaryProps) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 p-8 md:p-10 text-white relative overflow-hidden group"
  >
    {/* Abstract background elements */}
    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 pointer-events-none">
      <Activity size={180} />
    </div>
    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />
    
    <div className="relative z-10 space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black flex items-center gap-4 tracking-tight">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
            <Truck size={20} className="text-blue-400" />
          </div>
          Trip Analytics
        </h3>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20 backdrop-blur-sm">
          <ShieldCheck size={14} className="text-blue-400" />
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Compliant</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Gauge size={14} />
            <p className="text-[10px] font-black uppercase tracking-widest">Total Distance</p>
          </div>
          <p className="text-4xl font-black tracking-tighter">
            {data.summary.total_distance_miles.toLocaleString(undefined, { maximumFractionDigits: 1 })} 
            <span className="text-sm font-bold text-slate-500 ml-2 tracking-normal uppercase">mi</span>
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Activity size={14} />
            <p className="text-[10px] font-black uppercase tracking-widest">Drive Time</p>
          </div>
          <p className="text-4xl font-black tracking-tighter">
            {data.summary.total_driving_hours.toFixed(1)} 
            <span className="text-sm font-bold text-slate-500 ml-2 tracking-normal uppercase">hrs</span>
          </p>
        </div>

        <div className="col-span-2 pt-8 mt-4 border-t border-white/5">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estimated Duration</p>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 tracking-tighter">
                  {data.summary.estimated_days}
                </span>
                <span className="text-lg font-black text-slate-200 uppercase tracking-tight">Days</span>
              </div>
            </div>
            
            <button className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 group/btn">
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default React.memo(TripSummary);
