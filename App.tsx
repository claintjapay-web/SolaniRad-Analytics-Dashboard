import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { Header } from './components/Header';
import { KpiCard } from './components/KpiCard';
import { GasConcentrationPie } from './components/Charts/GasConcentrationPie';
import { GasLevelsBarChart } from './components/Charts/GasLevelsBarChart';
import { LiveReadingsTable } from './components/Charts/LiveReadingsTable';
import { HighestLevelsBarChart } from './components/Charts/HighestLevelsBarChart';
import { SafetyDonut } from './components/Charts/SafetyDonut';
import { IoTStatusGrid } from './components/IoTStatusGrid';
import { getSafetyStatus } from './services/dataService';
import { SensorReading, IoTSystemState, GasType, GAS_COLORS } from './types';

// Firebase Project Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrhKHstFwZmBmz4Qd_QZWeCONJjOny9O4",
  authDomain: "solanirad-analytics-dashboard.firebaseapp.com",
  databaseURL: "https://solanirad-analytics-dashboard-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "solanirad-analytics-dashboard",
  storageBucket: "solanirad-analytics-dashboard.firebasestorage.app",
  messagingSenderId: "915597225709",
  appId: "1:915597225709:web:94ceafd1cb5423830d26e4",
  measurementId: "G-77DDBWPJ5S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const App: React.FC = () => {
  // Analytic Data State (for charts)
  const [data, setData] = useState<SensorReading>({
    id: 'loading',
    timestamp: '--:--:--',
    nh3: 0,
    co2: 0,
    nox: 0,
    so2: 0,
    temperature: 0,
    humidity: 0,
    weight: 0
  });
  
  // Hardware Status State
  const [systemState, setSystemState] = useState<IoTSystemState>({
    esp32_status: false,
    esp32_last_update: 0,
    mq137: 0,
    mq135: 0,
    scd41: { co2: 0, temperature: 0, humidity: 0 },
    loadcell: 0,
    servo: false,
    uvc: false,
    battery: 0
  });

  const [history, setHistory] = useState<SensorReading[]>([]);
  const [filter, setFilter] = useState<GasType>('All');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to the root 'iot_system' node
    const iotRef = ref(database, 'iot_system');

    const unsubscribe = onValue(iotRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setConnected(true);
        const now = new Date();
        const timestamp = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        // 1. Update System State (Raw Data)
        const newSystemState: IoTSystemState = {
          esp32_status: val.esp32_status ?? false,
          esp32_last_update: val.esp32_last_update ?? 0,
          mq137: Number(val.mq137 ?? 0),
          mq135: Number(val.mq135 ?? 0),
          scd41: {
            co2: Number(val.scd41?.co2 ?? 0),
            temperature: Number(val.scd41?.temperature ?? 0),
            humidity: Number(val.scd41?.humidity ?? 0)
          },
          loadcell: Number(val.loadcell ?? 0),
          servo: Boolean(val.servo),
          uvc: Boolean(val.uvc),
          battery: Number(val.battery ?? 0)
        };
        setSystemState(newSystemState);

        // 2. Map Raw Data to Analytics Model (SensorReading) for Charts
        const newReading: SensorReading = {
          id: now.getTime().toString(),
          timestamp: timestamp,
          nh3: newSystemState.mq137,
          co2: newSystemState.scd41.co2,
          nox: newSystemState.mq135,
          so2: 0, 
          temperature: newSystemState.scd41.temperature,
          humidity: newSystemState.scd41.humidity,
          weight: newSystemState.loadcell
        };

        setData(newReading);
        setHistory(prev => {
          const newHistory = [...prev, newReading];
          return newHistory.slice(-20); // Maintain last 20 readings for visualization
        });
      }
    }, (error) => {
      console.error("Firebase Read Error:", error);
      setConnected(false);
    });

    return () => unsubscribe();
  }, []);

  const safetyStatuses = getSafetyStatus(data);

  // FUNCTIONAL REQUIREMENT 1 & 2: Dashboard Click Logic
  const handleReset = () => {
    const confirmed = window.confirm(
      "CONFIRM REBOOT: Initiate ESP32 System Reset Sequence?"
    );

    if (confirmed) {
      // Write to specific path: iot_system/control/reboot
      // Sending 'true' triggers the listener on the ESP32
      set(ref(database, 'iot_system/control/reboot'), true)
        .then(() => {
           alert("Reboot Signal Sent. The ESP32 will restart and reset the signal.");
        })
        .catch(err => {
            console.error("Cloud sync failed:", err);
            alert("Error sending reboot signal. Check connection.");
        });
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-[#2e1065] to-slate-900 p-4 lg:p-6 overflow-x-hidden font-sans text-white">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
        
        {/* HEADER */}
        <div className="relative">
          <Header activeFilter={filter} onFilterChange={setFilter} />
          <div className="absolute top-0 right-0 mt-[-10px] flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
             <span className="text-[10px] uppercase font-bold text-white/40 tracking-tighter">
               {connected ? 'Live Sync' : 'Reconnecting...'}
             </span>
          </div>
        </div>

        {/* SECTION 1: IOT HARDWARE STATUS GRID */}
        <IoTStatusGrid systemData={systemState} onReset={handleReset} />

        {/* SECTION 2: ANALYTIC KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <KpiCard title="NH₃ Level" subtitle="Ammonia" value={data.nh3} unit="ppm" color={GAS_COLORS.nh3} />
          <KpiCard title="CO₂ Level" subtitle="Carbon Dioxide" value={data.co2} unit="ppm" color={GAS_COLORS.co2} />
          <KpiCard title="VOC level" subtitle="Nitrogen Oxides" value={data.nox} unit="ppb" color={GAS_COLORS.nox} />
          <KpiCard title="Load Weight" subtitle="Total Load" value={data.weight} unit="kg" color={GAS_COLORS.so2} />
          <KpiCard title="System Temp" subtitle="Internal" value={data.temperature} unit="°C" color={GAS_COLORS.env} />
        </div>

        {/* SECTION 3: MAIN ANALYTICS CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 auto-rows-min">
          
          {/* LEFT COLUMN (Pie + Horizontal Bar) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="h-[300px]">
              <GasConcentrationPie data={data} />
            </div>
            <div className="h-[250px] flex-1">
              <HighestLevelsBarChart data={data} />
            </div>
          </div>

          {/* CENTER COLUMN (Vertical Bar) */}
          <div className="lg:col-span-5 h-[566px]">
            <GasLevelsBarChart history={history} />
          </div>

          {/* RIGHT COLUMN (Table) */}
          <div className="lg:col-span-4 h-[566px]">
            <LiveReadingsTable history={history} />
          </div>

        </div>

        {/* SECTION 4: SAFETY SUMMARY */}
        <div className="w-full bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
            <h3 className="text-white/70 text-sm font-semibold mb-3 ml-2 uppercase tracking-widest">System Safety Status Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {safetyStatuses.map((status) => (
                <SafetyDonut key={status.gas} statusData={status} />
              ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default App;