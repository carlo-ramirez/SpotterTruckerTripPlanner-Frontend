import React from 'react';
import { Truck } from 'lucide-react';

const Header: React.FC = () => (
  <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm transition-all duration-300">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-4 group cursor-pointer">
        <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <Truck size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Spotter</h1>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] font-sans leading-none">HOS Pro Elite</p>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm font-bold text-slate-600 border border-slate-200">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Service Status: Active
        </div>
      </div>
    </div>
  </header>
);

export default React.memo(Header);
