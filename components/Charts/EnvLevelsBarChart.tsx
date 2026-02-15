import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SensorReading, GAS_COLORS } from '../../types';

interface Props {
  history: SensorReading[];
}

export const EnvLevelsBarChart: React.FC<Props> = ({ history }) => {
  return (
    <div className="w-full h-full min-h-[200px] bg-[#1e293b]/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 flex flex-col shadow-lg">
      <h3 className="text-slate-200 font-bold text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
        <span className="w-1 h-4 bg-teal-500 rounded-full shadow-[0_0_10px_#14b8a6]"></span>
        Environment History
      </h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={history}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barCategoryGap="20%"
          >
            <defs>
              <linearGradient id="gradTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GAS_COLORS.env} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={GAS_COLORS.env} stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="gradHum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis 
              dataKey="timestamp" 
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} 
              axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
              tickLine={false}
              interval="preserveStartEnd"
              dy={10}
              tickFormatter={(value) => {
                // Extract time from "MM-DD-YYYY HH:mm:ss"
                const parts = value.split(' ');
                return parts.length > 1 ? parts[1] : value;
              }}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                borderColor: 'rgba(255,255,255,0.1)', 
                borderRadius: '8px', 
                color: '#fff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                fontSize: '12px'
              }}
              itemStyle={{ paddingBottom: '2px' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontFamily: 'monospace' }} 
              iconType="circle"
            />
            <Bar dataKey="temperature" name="Temp (°C)" fill="url(#gradTemp)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="humidity" name="Humidity (%)" fill="url(#gradHum)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};