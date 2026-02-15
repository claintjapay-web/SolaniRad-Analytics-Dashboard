import React from 'react';

interface KpiCardProps {
  title: string;
  subtitle?: string;
  value: number | string;
  unit: string;
  color: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, subtitle, value, unit, color }) => {
  const isDisconnected = value === 'Disconnected';

  return (
    <div 
      className={`relative flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl border shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] ${
        isDisconnected ? 'border-red-500/20 grayscale-[0.5] opacity-80' : 'border-white/10 hover:border-white/20'
      }`}
    >
      {/* Dynamic Ambient Glow - Hidden if disconnected */}
      {!isDisconnected && (
        <div 
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[80px] opacity-15 transition-all duration-700 group-hover:opacity-30 group-hover:scale-125"
          style={{ backgroundColor: color }}
        />
      )}
      
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-sm ${isDisconnected ? 'bg-red-500' : ''}`} style={!isDisconnected ? { backgroundColor: color } : {}}></span>
            {title}
          </span>
          {subtitle && (
            <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider ml-3.5 mt-1">
              {subtitle}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/20 border border-white/5 shadow-inner">
           <div 
             className={`w-1.5 h-1.5 rounded-full ${isDisconnected ? 'bg-red-500' : 'animate-pulse'}`} 
             style={!isDisconnected ? { backgroundColor: color, color: color, boxShadow: '0 0 8px currentColor' } : {}} 
           />
        </div>
      </div>
      
      <div className="relative z-10 flex items-baseline gap-2">
        <span 
          className={`font-mono font-medium tracking-tight text-white drop-shadow-lg ${isDisconnected ? 'text-xl text-red-400' : 'text-5xl'}`}
        >
          {typeof value === 'number' 
            ? value.toLocaleString(undefined, { maximumFractionDigits: 1, minimumFractionDigits: 0 }) 
            : value}
        </span>
        {!isDisconnected && (
          <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">
            {unit}
          </span>
        )}
      </div>
      
      {/* Decorative High-Tech Progress Bar */}
      <div className="mt-6 relative h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
        {/* Animated striped background for empty part */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1)_100%)] bg-[length:10px_10px]" />
        
        <div 
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: isDisconnected ? '0%' : '60%', 
              backgroundColor: isDisconnected ? 'transparent' : color, 
              boxShadow: isDisconnected ? 'none' : `0 0 15px ${color}`,
            }} 
        >
          {!isDisconnected && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50" />} {/* Tip shine */}
        </div>
      </div>
    </div>
  );
};