import React from 'react';
import { MapPin, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  userId: string | null;
}

export const Header: React.FC<HeaderProps> = ({ userId }) => {
  return (
    <header className="bg-gradient-to-r from-red-800 to-red-700 text-white shadow-xl pb-16 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex items-center space-x-3 bg-red-900/30 p-3 rounded-full backdrop-blur-sm border border-red-500/30">
            <ShieldCheck className="w-8 h-8 text-red-200" />
            <h2 className="text-sm font-bold tracking-widest uppercase text-red-100">KPU Kabupaten Pacitan</h2>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Rekapitulasi Perjalanan Dinas
          </h1>
          
          <div className="flex items-center space-x-2 mt-2">
            <div className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center space-x-2 shadow-inner ${userId ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30' : 'bg-slate-800/30 text-slate-300'}`}>
              <div className={`w-2 h-2 rounded-full ${userId ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>
                {userId ? `ID: ${userId.substring(0, 8)}... (Online)` : 'Mode Offline / Menghubungkan...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};