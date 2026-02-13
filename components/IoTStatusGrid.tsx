import React from 'react';
import { IoTSystemState } from '../types';

interface Props {
  systemData: IoTSystemState;
  onReset?: () => void;
}

// Simplified SVGs with glow filters support
const Icons = {
  Chip: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
  Gas: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  Env: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
  Weight: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Servo: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Light: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Battery: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
};

const StatusCard = ({ 
  label, 
  status, 
  subtext, 
  icon: Icon 
}: { 
  label: string; 
  status: 'ON' | 'OFF'; 
  subtext?: string; 
  icon: React.FC 
}) => {
  const isActive = status === 'ON';
  return (
    <div className={`
      relative flex items-center p-4 rounded-xl border transition-all duration-500 overflow-hidden group
      ${isActive 
        ? 'bg-emerald-950/30 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
        : 'bg-[#1e293b]/50 border-white/5 opacity-80 hover:opacity-100 hover:border-white/10'}
    `}>
      {/* Background Pulse Effect for Active Cards */}
      {isActive && (
        <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
      )}

      <div className={`
        p-3 rounded-lg mr-4 transition-colors duration-300 relative z-10
        ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-500'}
      `}>
        <Icon />
      </div>
      
      <div className="flex-1 z-10">
        <div className="flex justify-between items-start">
          <div>
             <h4 className="text-sm font-bold text-gray-200 tracking-tight">{label}</h4>
             {subtext && <p className="text-[10px] text-gray-500 font-mono mt-0.5 tracking-wide">{subtext}</p>}
          </div>
          <div className="flex flex-col items-end gap-1.5">
             <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded-full ${
               isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.3)]' : 'bg-red-500/10 text-red-500 border border-red-500/10'
             }`}>
               {status}
             </span>
             {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export const IoTStatusGrid: React.FC<Props> = ({ systemData, onReset }) => {
  // Logic: ESP32 Heartbeat
  const currentTime = Math.floor(Date.now() / 1000);
  const lastUpdate = systemData.esp32_last_update;
  const isEspOnline = (currentTime - lastUpdate) <= 15 || systemData.esp32_status === true;

  // Logic: UV-C and LEDs
  const uvcActive = systemData.uvc;
  const redLedActive = uvcActive;   
  const greenLedActive = !uvcActive; 

  // Battery Segment Logic
  const segments = 10;
  const filledSegments = Math.ceil((systemData.battery / 100) * segments);
  
  const getSegmentColor = (index: number) => {
    if (index >= filledSegments) return 'bg-gray-800/50'; // Empty
    if (systemData.battery < 30) return 'bg-red-500 shadow-[0_0_8px_#ef4444]';
    if (systemData.battery < 60) return 'bg-yellow-500 shadow-[0_0_8px_#eab308]';
    return 'bg-emerald-500 shadow-[0_0_8px_#10b981]';
  };

  return (
    <div className="w-full bg-[#1e293b]/40 backdrop-blur-xl rounded-3xl border border-white/5 p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isEspOnline ? 'bg-green-500 shadow-[0_0_15px_#22c55e]' : 'bg-red-500 shadow-[0_0_15px_#ef4444]'} animate-pulse`} />
            <h3 className="text-white font-black text-xl uppercase tracking-[0.15em] drop-shadow-md">
            System Hardware
            </h3>
        </div>
        
        {/* Right Side Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          
          {/* Reset Button */}
          {onReset && (
            <button 
              onClick={onReset}
              className="group flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-xl transition-all duration-300"
            >
              <svg className="w-4 h-4 text-red-500 group-hover:rotate-180 transition-transform duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-[10px] font-black text-red-400 uppercase tracking-widest group-hover:text-red-300">
                Reboot System
              </span>
            </button>
          )}

          {/* Futuristic Battery Widget */}
          <div className="flex items-center gap-4 bg-black/40 px-6 py-3 rounded-full border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
            <Icons.Battery />
            <div className="flex gap-1.5">
              {Array.from({ length: segments }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-5 rounded-[2px] transition-all duration-300 ${getSegmentColor(i)}`}
                />
              ))}
            </div>
            <span className="text-sm font-mono font-bold text-white ml-2 border-l border-white/10 pl-4 tracking-wider">
              {systemData.battery}%
            </span>
          </div>

        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* ESP32 Controller */}
        <StatusCard 
          label="ESP32 MCU" 
          status={isEspOnline ? 'ON' : 'OFF'} 
          subtext={isEspOnline ? `Heartbeat: Active` : 'Signal Lost'}
          icon={Icons.Chip}
        />

        {/* Gas Sensors */}
        <StatusCard 
          label="MQ-137 Array" 
          status={systemData.mq137 > 0 ? 'ON' : 'OFF'} 
          subtext={systemData.mq137 > 0 ? 'Data Streaming' : 'No Signal'}
          icon={Icons.Gas}
        />
        <StatusCard 
          label="MQ-135 Array" 
          status={systemData.mq135 > 0 ? 'ON' : 'OFF'} 
          subtext={systemData.mq135 > 0 ? 'Data Streaming' : 'No Signal'}
          icon={Icons.Gas}
        />

        {/* Env Sensor */}
        <StatusCard 
          label="SCD41 Module" 
          status={(systemData.scd41?.co2 > 0) ? 'ON' : 'OFF'} 
          subtext="Env Monitoring"
          icon={Icons.Env}
        />

        {/* Actuators */}
        <StatusCard 
          label="Servo Mech" 
          status={systemData.servo ? 'ON' : 'OFF'} 
          subtext="Position Lock"
          icon={Icons.Servo}
        />
        <StatusCard 
          label="Load Cell" 
          status={systemData.loadcell !== undefined ? 'ON' : 'OFF'} 
          subtext="Calibrated"
          icon={Icons.Weight}
        />

        {/* Custom UV-C Control Panel */}
        <div className="xl:col-span-2 bg-gradient-to-r from-slate-900/80 to-slate-800/80 rounded-xl border border-white/10 p-4 flex flex-row items-center justify-between gap-6 relative overflow-hidden group hover:border-purple-500/30 transition-colors duration-500">
          {/* Background Glow */}
          {uvcActive && (
             <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay pointer-events-none animate-pulse" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none opacity-50" />

          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-xl transition-all duration-500 ${uvcActive ? 'bg-purple-600 shadow-[0_0_25px_#9333ea] text-white scale-105' : 'bg-gray-800 text-gray-500'}`}>
              <Icons.Light />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-100 uppercase tracking-wider">UV-C Sterilization</h4>
              <span className={`text-[10px] font-bold px-3 py-1 rounded-md border mt-1.5 inline-block tracking-widest ${uvcActive ? 'text-purple-300 border-purple-500/30 bg-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.2)]' : 'text-gray-500 border-gray-700'}`}>
                {uvcActive ? 'SEQUENCE ACTIVE' : 'STANDBY'}
              </span>
            </div>
          </div>

          {/* Realistic LEDs */}
          <div className="flex gap-6 z-10 bg-black/50 px-8 py-3 rounded-lg border border-white/10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
            <div className="flex flex-col items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${redLedActive ? 'bg-red-500 shadow-[0_0_20px_#ef4444] scale-110' : 'bg-red-950 border border-red-900/30 opacity-50'}`} />
                <span className={`text-[9px] font-bold ${redLedActive ? 'text-red-400' : 'text-gray-600'}`}>BUSY</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${greenLedActive ? 'bg-emerald-500 shadow-[0_0_20px_#10b981] scale-110' : 'bg-emerald-950 border border-emerald-900/30 opacity-50'}`} />
                <span className={`text-[9px] font-bold ${greenLedActive ? 'text-emerald-400' : 'text-gray-600'}`}>READY</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};