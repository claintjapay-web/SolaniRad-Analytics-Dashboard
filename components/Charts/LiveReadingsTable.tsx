import React from 'react';
import { SensorReading } from '../../types';

interface Props {
  history: SensorReading[];
}

export const LiveReadingsTable: React.FC<Props> = ({ history }) => {
  // Reverse to show newest first
  const reversedData = [...history].reverse();

  return (
    <div className="w-full h-full min-h-[250px] bg-[#0f172a]/40 backdrop-blur-md rounded-2xl border border-white/5 p-4 flex flex-col overflow-hidden shadow-lg">
      <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 pl-2 border-l-2 border-purple-500">
        Live Data Log
      </h3>
      <div className="flex-1 overflow-auto pr-1">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#0f172a]/90 backdrop-blur-sm z-10 shadow-sm border-b border-white/10">
            <tr>
              <th className="py-3 px-2 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Time</th>
              <th className="py-3 px-2 text-[10px] font-bold uppercase text-cyan-400 tracking-wider">NH₃</th>
              <th className="py-3 px-2 text-[10px] font-bold uppercase text-blue-400 tracking-wider">CO₂</th>
              <th className="py-3 px-2 text-[10px] font-bold uppercase text-orange-400 tracking-wider">NOx</th>
              <th className="py-3 px-2 text-[10px] font-bold uppercase text-teal-400 tracking-wider">Tmp</th>
            </tr>
          </thead>
          <tbody className="text-xs text-gray-300 font-mono">
            {reversedData.map((row, i) => (
              <tr 
                key={row.id} 
                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i === 0 ? 'bg-blue-500/10 text-blue-100 animate-pulse' : ''}`}
              >
                <td className="py-2.5 px-2 opacity-70">{row.timestamp}</td>
                <td className="py-2.5 px-2">{row.nh3.toFixed(1)}</td>
                <td className="py-2.5 px-2">{row.co2.toFixed(0)}</td>
                <td className="py-2.5 px-2">{row.nox.toFixed(1)}</td>
                <td className="py-2.5 px-2">{row.temperature.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};