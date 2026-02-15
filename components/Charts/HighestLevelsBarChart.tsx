import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SensorReading, GAS_COLORS } from '../../types';

interface Props {
  data: SensorReading;
}

export const HighestLevelsBarChart: React.FC<Props> = ({ data }) => {
  const chartData = [
    { name: 'NH₃', value: data.nh3, color: GAS_COLORS.nh3 },
    { name: 'CO₂', value: data.co2 / 20, color: GAS_COLORS.co2 },
    { name: 'VOC', value: data.nox, color: GAS_COLORS.nox },
  ].sort((a, b) => b.value - a.value);

  return (
    <div className="w-full h-full min-h-[200px] bg-[#1e293b]/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 flex flex-col shadow-lg">
      <h3 className="text-slate-200 font-bold text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"></span>
        Highest Relative Levels
      </h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            barSize={12}
          >
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }} 
              width={40}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                borderColor: 'rgba(255,255,255,0.1)', 
                color: '#fff',
                fontSize: '12px',
                borderRadius: '6px'
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} background={{ fill: 'rgba(255,255,255,0.03)', radius: [0,4,4,0] }}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};