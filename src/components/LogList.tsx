import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Inbox, LayoutGrid } from 'lucide-react';
import { TripData } from '../types/trip';
import DailyLogCard from './DailyLogCard';

interface LogListProps {
  tripData: TripData | null;
  loading: boolean;
}

const LogList = ({ tripData, loading }: LogListProps) => {
  if (!tripData) {
    return (
      <div className="text-center py-40 bg-white/40 rounded-[3rem] border-4 border-dashed border-slate-200/50 text-slate-400 backdrop-blur-md relative overflow-hidden group">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-blue-50/20 rounded-full blur-[120px] -z-10 group-hover:bg-blue-100/30 transition-colors duration-1000" />
        <div className="w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-white group-hover:scale-110 transition-transform duration-700">
          <Calendar size={40} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">No Trip Data Yet</h3>
        <p className="text-slate-500 max-w-xs mx-auto font-medium leading-relaxed">
          Complete the trip planner form to generate your professional daily ELD logs automatically.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100" />
          <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce delay-200" />
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      {loading ? (
        <div className="space-y-8 animate-pulse">
          <div className="h-12 w-48 bg-slate-200 rounded-xl mb-12" />
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-[2rem] h-auto border border-slate-100 p-10 space-y-8">
              <div className="flex justify-between">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl" />
                  <div className="space-y-2 py-2">
                    <div className="h-6 w-40 bg-slate-100 rounded-lg" />
                    <div className="h-4 w-24 bg-slate-100 rounded-lg" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-24 h-16 bg-slate-100 rounded-2xl" />
                  <div className="w-24 h-16 bg-slate-100 rounded-2xl" />
                </div>
              </div>
              <div className="h-48 w-full bg-slate-50 rounded-2xl" />
              <div className="h-40 w-full bg-slate-50 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between px-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                  <Calendar size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                    Compliance Logs
                  </h2>
                  <p className="text-sm font-semibold text-slate-400 mt-2 uppercase tracking-widest">Electronic Logging Device Output</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <LayoutGrid size={16} className="text-blue-500" />
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">
                  {tripData.daily_logs.length} Days Generated
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-12 relative">
            {/* Timeline connector line */}
            <div className="absolute top-0 bottom-0 left-[2.75rem] md:left-[3.75rem] w-1 bg-gradient-to-b from-blue-100 via-slate-100 to-transparent rounded-full -z-10 hidden lg:block" />

            <AnimatePresence mode="popLayout">
              {tripData.daily_logs.map((log, index) => (
                <DailyLogCard
                  key={`${log.day}-${index}`}
                  log={log}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* End of list indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col items-center justify-center py-10 gap-4"
          >
            <div className="w-px h-16 bg-gradient-to-b from-slate-200 to-transparent" />
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
              <Inbox size={20} className="text-slate-300" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">End of Trip Logs</span>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default React.memo(LogList);
