import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { Header } from './components/Header';
import { KpiCard } from './components/KpiCard';
import { GasConcentrationPie } from './components/Charts/GasConcentrationPie';
import { GasLevelsBarChart } from './components/Charts/GasLevelsBarChart';
import { EnvLevelsBarChart } from './components/Charts/EnvLevelsBarChart';
import { LiveReadingsTable } from './components/Charts/LiveReadingsTable';
import { HighestLevelsBarChart } from './components/Charts/HighestLevelsBarChart';
import { SafetyDonut } from './components/Charts/SafetyDonut';
import { IoTStatusGrid } from './components/IoTStatusGrid';
import { getSafetyStatus } from './services/dataService';
import { SensorReading, IoTSystemState, GasType, GAS_COLORS, SensorHeartbeats } from './types';

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
// Initialize Realtime Database with explicit URL for asia-southeast1 region
const database = getDatabase(app, "https://solanirad-analytics-dashboard-default-rtdb.asia-southeast1.firebasedatabase.app/");

// Helper to safely parse numbers and prevent NaN
const safeNumber = (val: any): number => {
  if (val === null || val === undefined) return 0;
  const num = Number(val);
  return isNaN(num) ? 0 : num;
};

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

  // Independent Sensor Heartbeats
  const [sensorHeartbeats, setSensorHeartbeats] = useState<SensorHeartbeats>({
    esp32: 0,
    mq137: 0,
    mq135: 0,
    scd41: 0,
    loadcell: 0,
    servo: 0,
    uvc: 0
  });

  const [history, setHistory] = useState<SensorReading[]>([]);
  const [filter, setFilter] = useState<GasType>('All');
  const [connected, setConnected] = useState(false);
  
  // Local state to track current time for heartbeat calculation (updates every second)
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    // 1. Firebase Listener
    const iotRef = ref(database, 'iot_system');
    const unsubscribe = onValue(iotRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setConnected(true);
        const arrivalTime = Date.now();
        
        const timestampDate = new Date();
        // Format: MM-DD-YYYY HH:mm:ss
        const pad = (n: number) => n.toString().padStart(2, '0');
        const timestamp = `${pad(timestampDate.getMonth() + 1)}-${pad(timestampDate.getDate())}-${timestampDate.getFullYear()} ${pad(timestampDate.getHours())}:${pad(timestampDate.getMinutes())}:${pad(timestampDate.getSeconds())}`;
        
        // Update Heartbeats if keys exist in payload
        // Checks both hyphenated (legacy/alt) and non-hyphenated keys
        const hasMq137 = val['mq-137'] !== undefined || val.mq137 !== undefined;
        const hasMq135 = val['mq-135'] !== undefined || val.mq135 !== undefined;
        const hasLoadcell = val.loadcell !== undefined;

        setSensorHeartbeats(prev => ({
          esp32: arrivalTime, // Always update ESP32 if we get data
          mq137: hasMq137 ? arrivalTime : prev.mq137,
          mq135: hasMq135 ? arrivalTime : prev.mq135,
          scd41: val.scd41 !== undefined ? arrivalTime : prev.scd41,
          loadcell: hasLoadcell ? arrivalTime : prev.loadcell,
          servo: val.servo !== undefined ? arrivalTime : prev.servo,
          uvc: val.uvc !== undefined ? arrivalTime : prev.uvc
        }));

        // RESOLVE SENSOR VALUES
        // Extracts data from { value: number } structure or direct number
        const resolveSensorValue = (entry: any): number => {
            if (entry === null || entry === undefined) return 0;
            // If it's an object with a 'value' property (e.g. { value: 12.5 })
            if (typeof entry === 'object' && 'value' in entry) {
                return safeNumber(entry.value);
            }
            // Fallback for flat structure
            return safeNumber(entry);
        };

        // Access raw nodes (handling potential key variations)
        const mq137Raw = val['mq-137'] ?? val.mq137;
        const mq135Raw = val['mq-135'] ?? val.mq135;
        const loadcellRaw = val.loadcell;

        // Update System State (Raw Data)
        const newSystemState: IoTSystemState = {
          esp32_status: val.esp32_status ?? false,
          esp32_last_update: safeNumber(val.esp32_last_update),
          mq137: resolveSensorValue(mq137Raw),    // NH3
          mq135: resolveSensorValue(mq135Raw),    // VOC
          scd41: {
            co2: safeNumber(val.scd41?.co2),
            temperature: safeNumber(val.scd41?.temperature),
            humidity: safeNumber(val.scd41?.humidity)
          },
          loadcell: resolveSensorValue(loadcellRaw), // Weight
          servo: Boolean(val.servo),
          uvc: Boolean(val.uvc),
          battery: safeNumber(val.battery)
        };
        setSystemState(newSystemState);

        // Map Raw Data to Analytics Model
        const newReading: SensorReading = {
          id: timestampDate.getTime().toString(),
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
          return newHistory.slice(-20); 
        });
      } else {
        console.log("Connected to Firebase, but 'iot_system' node is empty or missing.");
      }
    }, (error) => {
      console.error("Firebase Read Error:", error);
      setConnected(false);
    });

    // 2. Heartbeat Interval
    // Updates 'now' every second to check for stale data (disconnection)
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  const safetyStatuses = getSafetyStatus(data);

  // Connection Logic: ESP32 status based on independent heartbeat
  // This is used for the global indicator in the header, while grid uses granular heartbeats
  const isEspOnline = (now - sensorHeartbeats.esp32) < 15000;

  // Helper to determine display value
  const getDisplayValue = (val: number, sensorKey: keyof SensorHeartbeats) => {
     const isSensorOnline = (now - sensorHeartbeats[sensorKey]) < 15000;
     return isSensorOnline ? val : 'Disconnected';
  };

  // Dashboard Click Logic
  const handleReset = () => {
    const confirmed = window.confirm(
      "CONFIRM REBOOT: Initiate ESP32 System Reset Sequence?"
    );

    if (confirmed) {
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
             <div className={`w-2 h-2 rounded-full ${connected && isEspOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
             <span className="text-[10px] uppercase font-bold text-white/40 tracking-tighter">
               {connected && isEspOnline ? 'Live Sync' : 'Offline / Reconnecting'}
             </span>
          </div>
        </div>

        {/* SECTION 1: IOT HARDWARE STATUS GRID - Independent Sensors */}
        <IoTStatusGrid 
          systemData={systemState} 
          heartbeats={sensorHeartbeats}
          now={now}
          onReset={handleReset} 
        />

        {/* SECTION 2: ANALYTIC KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard title="NH₃ Level" subtitle="Ammonia" value={getDisplayValue(data.nh3, 'mq137')} unit="ppm" color={GAS_COLORS.nh3} />
          <KpiCard title="CO₂ Level" subtitle="Carbon Dioxide" value={getDisplayValue(data.co2, 'scd41')} unit="ppm" color={GAS_COLORS.co2} />
          <KpiCard title="VOC LEVEL" subtitle="volatile organic compounds" value={getDisplayValue(data.nox, 'mq135')} unit="ppb" color={GAS_COLORS.nox} />
          <KpiCard title="Load Weight" subtitle="Total Load" value={getDisplayValue(data.weight, 'loadcell')} unit="kg" color={GAS_COLORS.so2} />
          <KpiCard title="System Temp" subtitle="Internal" value={getDisplayValue(data.temperature, 'scd41')} unit="°C" color={GAS_COLORS.env} />
          <KpiCard title="Humidity" subtitle="Relative Humidity" value={getDisplayValue(data.humidity, 'scd41')} unit="%" color="#a855f7" />
        </div>

        {/* SECTION 3: MAIN ANALYTICS CHARTS - UNIFORM 2x2 GRID */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-500 ${isEspOnline ? 'opacity-100' : 'opacity-50 grayscale'}`}>
          
          <div className="h-[350px]">
            <GasConcentrationPie data={data} />
          </div>
          
          <div className="h-[350px]">
            <HighestLevelsBarChart data={data} />
          </div>

          <div className="h-[350px]">
             <GasLevelsBarChart history={history} />
          </div>

          <div className="h-[350px]">
             <EnvLevelsBarChart history={history} />
          </div>

        </div>

        {/* SECTION 4: SAFETY SUMMARY */}
        <div className={`w-full bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 transition-opacity duration-500 ${isEspOnline ? 'opacity-100' : 'opacity-50'}`}>
            <h3 className="text-white/70 text-sm font-semibold mb-3 ml-2 uppercase tracking-widest">System Safety Status Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {safetyStatuses.map((status) => (
                <SafetyDonut key={status.gas} statusData={status} />
              ))}
            </div>
        </div>

        {/* SECTION 5: LIVE DATA LOG */}
        <div className={`w-full h-[500px] transition-opacity duration-500 ${isEspOnline ? 'opacity-100' : 'opacity-50 grayscale'}`}>
             <LiveReadingsTable history={history} />
        </div>

      </div>
    </div>
  );
};

export default App;