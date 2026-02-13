import React from 'react';
import { GasType } from '../types';

interface HeaderProps {
  activeFilter: GasType;
  onFilterChange: (filter: GasType) => void;
}

const filters: { label: string; value: GasType }[] = [
  { label: 'Overview', value: 'All' },
  { label: 'NH₃', value: 'NH3' },
  { label: 'CO₂', value: 'CO2' },
  { label: 'NOx', value: 'NOx' },
  { label: 'SO₂', value: 'SO2' },
  { label: 'Env', value: 'Env' },
];

export const Header: React.FC<HeaderProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <header className="flex flex-col lg:flex-row justify-between items-end lg:items-center mb-8 gap-6 border-b border-white/5 pb-6">
      
      <div className="flex items-center gap-5">
        {/* Logo Container */}
        <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-br from-white/20 to-transparent shadow-[0_0_25px_rgba(255,99,71,0.15)]">
          <div className="w-full h-full rounded-full overflow-hidden bg-black/50 backdrop-blur-sm border border-white/10 relative group">
             <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent pointer-events-none z-10" />
             <img 
              src="https://raw.githubusercontent.com/claintjapay-web/SolaniRad-Analytics-Dashboard/aa23a3f1532431b989ca322a9eafd44698731564/Tomato.jpg" 
              alt="SolaniRad Tomato Logo"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
             />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black tracking-tight uppercase text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-200 to-blue-500 drop-shadow-sm">
            SolaniRad <span className="text-white/30 font-thin">Analytics</span>
          </h1>
          <p className="text-sm text-blue-200/50 font-mono tracking-widest uppercase">
            Real-Time Environmental Monitoring System
          </p>
        </div>
      </div>
      
      <div className="flex p-1 bg-black/20 backdrop-blur-md rounded-xl border border-white/5 gap-1 overflow-x-auto max-w-full">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`
              relative px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300
              ${
                activeFilter === f.value
                  ? 'text-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/10'
                  : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>
    </header>
  );
};