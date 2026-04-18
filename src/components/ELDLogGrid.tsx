import React, { useMemo } from 'react';
import { LogEvent } from '../types/trip';

interface ELDLogGridProps {
  events: LogEvent[];
}

const ELDLogGrid = ({ events }: ELDLogGridProps) => {
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const statuses = [
    { label: 'Off Duty', color: '#0f172a' },
    { label: 'Sleeper Berth', color: '#1e293b' },
    { label: 'Driving', color: '#2563eb' },
    { label: 'On Duty (Not Driving)', color: '#334155' }
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
    <div className="bg-white rounded-xl border-2 border-slate-900 overflow-x-auto p-3 md:p-4 custom-scrollbar">
      <div className="min-w-[980px] relative">
        <div className="grid grid-cols-[170px_repeat(24,1fr)_90px] text-[10px] font-black border-b-2 border-slate-900 bg-white">
          <div className="border-r-2 border-slate-900 p-2 flex items-center justify-center uppercase tracking-wider">Status</div>
          {hours.map(h => (
            <div key={h} className="text-center border-r border-slate-400 py-2">{h}</div>
          ))}
          <div className="text-center border-l-2 border-slate-900 py-2 uppercase tracking-wider">Total Hours</div>
        </div>
        
        <div className="relative">
          {statuses.map((status, idx) => {
            const totalHoursForStatus = segments
              .filter(s => s.rowIndex === idx)
              .reduce((acc, curr) => acc + curr.duration, 0);

            return (
              <div key={status.label} className="grid grid-cols-[170px_repeat(24,1fr)_90px] h-14 border-b border-slate-400 items-center">
                <div className="text-[10px] font-black px-3 border-r-2 border-slate-900 h-full flex items-center bg-white text-slate-700">
                  {status.label}
                </div>
                {hours.map(h => (
                  <div key={h} className="border-r border-slate-400 h-full relative">
                    <div className="absolute left-1/4 top-0 bottom-0 border-l border-slate-300" />
                    <div className="absolute left-1/2 top-0 bottom-0 border-l border-slate-300" />
                    <div className="absolute left-3/4 top-0 bottom-0 border-l border-slate-300" />
                  </div>
                ))}
                <div className="text-[11px] font-black text-center border-l-2 border-slate-900 h-full flex items-center justify-center bg-white text-slate-800">
                  {totalHoursForStatus.toFixed(2)}
                </div>
              </div>
            );
          })}

          <svg className="absolute top-0 left-[170px] w-[calc(100%-260px)] h-full pointer-events-none">
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
                    stroke={statusColor} strokeWidth="3.5"
                    strokeLinecap="square"
                  />
                  {/* Vertical Transition */}
                  {nextSeg && (
                    <line 
                      x1={x2} y1={y} x2={x2} y2={(nextSeg.rowIndex * 56) + 28} 
                      stroke={statusColor} strokeWidth="3.5"
                      strokeLinecap="square"
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
      </div>
    </div>
  );
};

export default React.memo(ELDLogGrid);
