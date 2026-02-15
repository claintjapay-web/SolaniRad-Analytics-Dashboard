import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SensorReading, GAS_COLORS } from '../../types';

interface Props {
  data: SensorReading;
}

export const GasConcentrationPie: React.FC<Props> = ({ data }) => {
  const chartData = [
    { name: 'NH₃', value: data.nh3, color: GAS_COLORS.nh3 },
    { name: 'CO₂', value: data.co2 / 10, color: GAS_COLORS.co2 },
    { name: 'VOC', value: data.nox, color: GAS_COLORS.nox },
  ];

  return (
    <div className="w-full h-full min-h-[250px] bg-[#1e293b]/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 flex flex-col shadow-lg">
      <h3 className="text-slate-200 font-bold text-xs uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
        <span className="w-1 h-4 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]"></span>
        Gas Concentration Share
      </h3>
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {chartData.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="stroke-[2px] stroke-slate-900/50"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                borderColor: 'rgba(255,255,255,0.1)', 
                borderRadius: '8px', 
                color: '#fff',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#fff' }}
              formatter={(value: number) => value.toFixed(1)}
            />
            <Legend 
              verticalAlign="middle" 
              align="right"
              layout="vertical"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-[60px] flex-col opacity-80">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total</span>
          <span className="text-xl font-mono text-white">100%</span>
        </div>
      </div>
    </div>
  );
};