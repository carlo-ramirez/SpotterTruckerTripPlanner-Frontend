import React from 'react';
import { Truck } from 'lucide-react';

const Footer: React.FC = () => (
  <footer className="mt-20 bg-white border-t border-slate-200 py-16 text-center relative z-10">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col items-center gap-6">
        <div className="bg-slate-100 p-3 rounded-2xl">
          <Truck size={32} className="text-slate-400" />
        </div>
        <div className="space-y-2">
          <p className="text-slate-900 font-black text-lg tracking-tight">Spotter HOS Compliance Engine</p>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Built with precision for professional property-carrying drivers. 
            70-hour / 8-day rule compliant logic.
          </p>
        </div>
        <div className="flex gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-8 border-t border-slate-100 w-full justify-center">
          <span>HOS Rules v4.2</span>
          <span>ELD Certified</span>
          <span>OSRM Engine v1.0</span>
        </div>
        <p className="text-slate-300 text-[10px] mt-8">
          &copy; 2026 Spotter Technologies Inc. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default React.memo(Footer);
