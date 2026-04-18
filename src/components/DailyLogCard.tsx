import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Clock, Navigation, MapPin, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { DailyLog } from '../types/trip';
import ELDLogGrid from './ELDLogGrid';

interface DailyLogCardProps {
  log: DailyLog;
  index: number;
}

const STATUS_LABELS: Record<string, string> = {
  OFF_DUTY: 'Off Duty',
  SLEEPER: 'Sleeper Berth',
  DRIVING: 'Driving',
  ON_DUTY_NOT_DRIVING: 'On Duty (Not Driving)'
};

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const CollapsibleSection = ({ title, subtitle, defaultOpen = false, children }: CollapsibleSectionProps) => {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="relative z-10 overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-8 py-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between text-left hover:bg-slate-100/60 transition-colors"
      >
        <div>
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">{title}</h4>
          {subtitle && <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{subtitle}</p>}
        </div>
        {open ? <ChevronDown size={16} className="text-slate-500" /> : <ChevronUp size={16} className="text-slate-500" />}
      </button>
      <div className={`transition-all duration-300 ${open ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {open && children}
      </div>
    </div>
  );
};

function toHourMinute(hoursSinceMidnight: number) {
  const safeHours = Math.max(0, Math.min(24, hoursSinceMidnight));
  const wholeHours = Math.floor(safeHours);
  const minutes = Math.round((safeHours - wholeHours) * 60);
  const normalizedMinutes = minutes === 60 ? 0 : minutes;
  const normalizedHours = minutes === 60 ? wholeHours + 1 : wholeHours;
  return `${String(normalizedHours % 24).padStart(2, '0')}:${String(normalizedMinutes).padStart(2, '0')}`;
}

const DailyLogCard = React.forwardRef<HTMLDivElement, DailyLogCardProps>(({ log, index }, ref) => {
  const date = new Date(Date.now() + (log.day - 1) * 86400000);
  const totalsByStatus = log.events.reduce<Record<string, number>>((acc, event) => {
    acc[event.type] = (acc[event.type] || 0) + event.duration;
    return acc;
  }, {});

  let elapsedHours = 0;
  const remarks = log.events.map((event) => {
    const status = STATUS_LABELS[event.type] || event.type;
    const remark = {
      time: toHourMinute(elapsedHours),
      detail: `${status} - ${event.desc}`
    };
    elapsedHours += event.duration;
    return remark;
  });

  const totalHours = log.events.reduce((sum, event) => sum + event.duration, 0);
  const is24HourComplete = Math.abs(totalHours - 24) < 0.05;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 md:p-10 space-y-10 group hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-blue-100/40 transition-colors duration-500" />
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-500">
              <span className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">Day</span>
              <span className="text-2xl font-black leading-none">{log.day}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-sm">
              <CheckCircle2 size={12} className="text-white" />
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {format(date, 'EEEE, MMM dd')}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Electronic Driver Log</span>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className={`text-xs font-semibold ${is24HourComplete ? 'text-blue-600' : 'text-amber-600'}`}>
                {is24HourComplete ? '24-Hour Sheet Complete' : 'Review Needed'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 w-full lg:w-auto">
          <div className="flex-1 lg:flex-none bg-slate-50 border border-slate-100 px-6 py-4 rounded-[1.25rem] text-center group-hover:bg-white group-hover:border-blue-100 transition-all duration-500 shadow-sm group-hover:shadow-md">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Navigation size={12} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-400 transition-colors">Total Distance</p>
            </div>
            <p className="text-xl font-black text-slate-700 group-hover:text-blue-700 transition-colors">
              {log.total_miles.toFixed(1)} <span className="text-xs font-normal opacity-50">mi</span>
            </p>
          </div>
          
          <div className="flex-1 lg:flex-none bg-slate-50 border border-slate-100 px-6 py-4 rounded-[1.25rem] text-center group-hover:bg-white group-hover:border-green-100 transition-all duration-500 shadow-sm group-hover:shadow-md">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock size={12} className="text-slate-400 group-hover:text-green-500 transition-colors" />
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-green-400 transition-colors">Driving Time</p>
            </div>
            <p className="text-xl font-black text-slate-700 group-hover:text-green-700 transition-colors">
              {log.total_driving.toFixed(1)} <span className="text-xs font-normal opacity-50">hr</span>
            </p>
          </div>
        </div>
      </div>

      <CollapsibleSection title="Driver Daily Log Sheet" subtitle="FMCSA-style output" defaultOpen={false}>
        <div className="p-6">
          <div className="border-2 border-slate-900 rounded-lg p-4 space-y-3 bg-white">
            <div className="grid grid-cols-12 gap-3 text-[10px] font-black uppercase tracking-wider text-slate-700">
              <div className="col-span-2 border-b border-slate-500 pb-1">
                <p className="text-slate-400 text-[9px]">Month / Day / Year</p>
                <p className="mt-1">{format(date, 'MM/dd/yyyy')}</p>
              </div>
              <div className="col-span-2 border-b border-slate-500 pb-1">
                <p className="text-slate-400 text-[9px]">Total Miles Driving Today</p>
                <p className="mt-1">{log.total_miles.toFixed(1)}</p>
              </div>
              <div className="col-span-4 border-b border-slate-500 pb-1 text-center">
                <p className="text-[12px] text-slate-900">Driver's Daily Log</p>
                <p className="text-[9px]">One Calendar Day - 24 Hours</p>
              </div>
              <div className="col-span-2 border-b border-slate-500 pb-1">
                <p className="text-slate-400 text-[9px]">Truck / Tractor</p>
                <p className="mt-1">N/A</p>
              </div>
              <div className="col-span-2 border-b border-slate-500 pb-1">
                <p className="text-slate-400 text-[9px]">Trailer</p>
                <p className="mt-1">N/A</p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-3 text-[10px] font-black uppercase tracking-wider text-slate-700">
              <div className="col-span-5 border-b border-slate-500 pb-1">
                <p className="text-slate-400 text-[9px]">Name of Carrier</p>
                <p className="mt-1">Spotter Trip Planner</p>
              </div>
              <div className="col-span-3 border-b border-slate-500 pb-1">
                <p className="text-slate-400 text-[9px]">Main Office Address</p>
                <p className="mt-1">N/A (Demo)</p>
              </div>
              <div className="col-span-2 border-b border-slate-500 pb-1">
                <p className="text-slate-400 text-[9px]">Co-driver</p>
                <p className="mt-1">N/A</p>
              </div>
              <div className="col-span-2 border-b border-slate-500 pb-1">
                <p className="text-slate-400 text-[9px]">Total Hours</p>
                <p className="mt-1">{totalHours.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-3 text-[10px] font-black uppercase tracking-wider text-slate-700">
              <div className="col-span-6 border-b border-slate-500 pb-1">
                <p className="text-slate-400 text-[9px]">Shipping Document / Commodity</p>
                <p className="mt-1">Pickup to dropoff route</p>
              </div>
              <div className="col-span-4 border-b border-slate-500 pb-1">
                <p className="text-slate-400 text-[9px]">Driver Signature / Certification</p>
                <p className="mt-1">Generated by system</p>
              </div>
              <div className="col-span-2 border-b border-slate-500 pb-1">
                <p className="text-slate-400 text-[9px]">24-hr Start</p>
                <p className="mt-1">Midnight</p>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Visual Log Grid */}
      <CollapsibleSection title="24-Hour Graph Grid" defaultOpen={true}>
        <div className="p-1 bg-slate-50/30">
          <ELDLogGrid events={log.events} />
        </div>
      </CollapsibleSection>

      {/* Totals + Remarks */}
      <CollapsibleSection title="Status Totals & Remarks" defaultOpen={false}>
        <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Status Totals</h4>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4 text-sm">
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <div key={key} className="rounded-xl border border-slate-100 p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="font-bold text-slate-700 mt-1">{(totalsByStatus[key] || 0).toFixed(2)} hrs</p>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Remarks (Duty Changes)</h4>
          </div>
          <div className="p-4 max-h-64 overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 uppercase tracking-widest">
                  <th className="text-left px-3 py-2">Time</th>
                  <th className="text-left px-3 py-2">Entry</th>
                </tr>
              </thead>
              <tbody>
                {remarks.map((remark, i) => (
                  <tr key={`${remark.time}-${i}`} className="border-t border-slate-50">
                    <td className="px-3 py-2 font-black text-slate-500">{remark.time}</td>
                    <td className="px-3 py-2 text-slate-600">{remark.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="xl:col-span-2 overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Shipping Documents / Shipper / Commodity</h4>
          </div>
          <div className="p-6">
            <div className="min-h-20 border-2 border-dashed border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-500">
              Pickup to dropoff route manifest (auto-generated)
            </div>
          </div>
        </div>
      </div>
      </CollapsibleSection>

      {/* Events Table */}
      <CollapsibleSection
        title="Activity Breakdown"
        subtitle={`${log.events.length} segments recorded`}
        defaultOpen={false}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase tracking-widest bg-white border-b border-slate-50">
                <th className="px-8 py-5 font-black">#</th>
                <th className="px-8 py-5 font-black">Duty Status</th>
                <th className="px-8 py-5 font-black">Duration</th>
                <th className="px-8 py-5 font-black">Event Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {log.events.map((event, i) => (
                <tr key={i} className="group/row hover:bg-blue-50/30 transition-all duration-300">
                  <td className="px-8 py-5">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 group-hover/row:bg-blue-100 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover/row:text-blue-600 transition-colors">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        event.type === 'DRIVING' ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'
                      }`} />
                      <span className={`inline-flex px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        event.type === 'DRIVING'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {event.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-700">
                    <span className="text-base">{event.duration.toFixed(1)}</span>
                    <span className="text-[10px] font-medium opacity-40 ml-1.5">hrs</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-slate-300 mt-0.5 shrink-0" />
                      <p className="text-slate-500 font-medium leading-relaxed italic text-xs">
                        {event.desc}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleSection>
    </motion.div>
  );
});

export default React.memo(DailyLogCard);
