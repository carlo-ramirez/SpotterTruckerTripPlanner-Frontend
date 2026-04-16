import React, { useMemo } from 'react';
import { LogEvent } from '../types/trip';

interface ELDLogGridProps {
  events: LogEvent[];
}

const ELDLogGrid = ({ events }: ELDLogGridProps) => {
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const statuses = [
    { label: 'OFF DUTY', color: '#94a3b8' },
    { label: 'SLEEPER BERTH', color: '#64748b' },
    { label: 'DRIVING', color: '#2563eb' },
    { label: 'ON DUTY (NOT DRIVING)', color: '#475569' }
  ];
  
  const segments = useMemo(() => {
    let currentTime = 0;
    return events.map(event => {
      const start = currentTime;
      const duration = event.duration;
      currentTime += duration;
      
      let rowIndex = 0;
      if (event.type === 'OFF_DUTY') rowIndex = 0;
      else if (event.type === 'SLEEPER') rowIndex = 1;
      else if (event.type === 'DRIVING') rowIndex = 2;
      else rowIndex = 3;

      return { start, duration, rowIndex };
    });
  }, [events]);

  return (
    <div className="bg-white rounded-2xl shadow-inner border border-slate-200 overflow-x-auto p-4 md:p-6 custom-scrollbar">
      <div className="min-w-[900px] relative">
        {/* Hours Header */}
        <div className="grid grid-cols-[160px_repeat(24,1fr)_80px] text-[10px] font-black border-b-2 border-slate-900 bg-slate-50 uppercase tracking-tighter">
          <div className="border-r-2 border-slate-900 p-3 flex items-center justify-center">Status</div>
          {hours.map(h => (
            <div key={h} className="text-center border-r border-slate-200 py-3">{h}</div>
          ))}
          <div className="text-center border-l-2 border-slate-900 py-3">Total</div>
        </div>
        
        <div className="relative">
          {statuses.map((status, idx) => {
            const totalHoursForStatus = segments
              .filter(s => s.rowIndex === idx)
              .reduce((acc, curr) => acc + curr.duration, 0);

            return (
              <div key={status.label} className="grid grid-cols-[160px_repeat(24,1fr)_80px] h-14 border-b border-slate-200 items-center hover:bg-slate-50/50 transition-colors">
                <div className="text-[9px] font-black px-4 border-r-2 border-slate-900 h-full flex items-center bg-slate-50/80 text-slate-600">
                  {idx + 1}. {status.label}
                </div>
                {hours.map(h => (
                  <div key={h} className="border-r border-slate-100 h-full relative">
                    <div className="absolute left-1/2 top-0 bottom-0 border-l border-slate-100/50 border-dotted" />
                  </div>
                ))}
                <div className="text-[11px] font-black text-center border-l-2 border-slate-900 h-full flex items-center justify-center bg-slate-50 text-slate-800">
                  {totalHoursForStatus.toFixed(1)}
                </div>
              </div>
            );
          })}

          {/* SVG Drawing Layer */}
          <svg className="absolute top-0 left-[160px] w-[calc(100%-240px)] h-full pointer-events-none drop-shadow-sm">
            {segments.map((seg, i) => {
              const x1 = (seg.start / 24) * 100 + '%';
              const x2 = ((seg.start + seg.duration) / 24) * 100 + '%';
              const y = (seg.rowIndex * 56) + 28; // 56px per row (h-14), 28px is middle
              
              const nextSeg = segments[i + 1];
              const statusColor = statuses[seg.rowIndex].color;

              return (
                <g key={i}>
                  {/* Horizontal Segment */}
                  <line 
                    x1={x1} y1={y} x2={x2} y2={y} 
                    stroke={statusColor} strokeWidth="4" 
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  {/* Vertical Transition */}
                  {nextSeg && (
                    <line 
                      x1={x2} y1={y} x2={x2} y2={(nextSeg.rowIndex * 56) + 28} 
                      stroke={statusColor} strokeWidth="4" 
                      strokeLinecap="round"
                      className="transition-all duration-500 opacity-50"
                    />
                  )}
                  {/* Point markers at transitions */}
                  <circle cx={x1} cy={y} r="3" fill={statusColor} />
                  {!nextSeg && <circle cx={x2} cy={y} r="3" fill={statusColor} />}
                </g>
              );
            })}
          </svg>
        </div>
        
        {/* Remarks Section - More modern look */}
        <div className="mt-8 grid grid-cols-2 gap-8 border-t-2 border-slate-900 pt-6">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shipping Documents</p>
            <div className="bg-slate-50 rounded-xl p-4 min-h-[80px] border border-slate-100 shadow-inner group hover:bg-white hover:border-blue-100 transition-all">
              <div className="flex flex-col gap-3">
                <div className="h-px bg-slate-200 w-full group-hover:bg-blue-100" />
                <div className="h-px bg-slate-200 w-full group-hover:bg-blue-100" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location Notes / Remarks</p>
            <div className="bg-slate-50 rounded-xl p-4 min-h-[80px] border border-slate-100 shadow-inner group hover:bg-white hover:border-blue-100 transition-all">
              <div className="flex flex-col gap-3">
                <div className="h-px bg-slate-200 w-full group-hover:bg-blue-100" />
                <div className="h-px bg-slate-200 w-full group-hover:bg-blue-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ELDLogGrid);
