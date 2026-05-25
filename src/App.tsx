import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  ShieldAlert, 
  ShieldCheck, 
  Settings, 
  Info, 
  AlertOctagon, 
  Radio 
} from "lucide-react";

import { Device, Incident, LogEntry } from "./types";
import { INITIAL_DEVICES, INITIAL_INCIDENTS, INITIAL_LOGS } from "./data";

// Import custom high-fidelity layouts
import { LoginScreen } from "./components/LoginScreen";
import { Sidebar } from "./components/Sidebar";
import { DashboardTab } from "./components/DashboardTab";
import { DevicesTab } from "./components/DevicesTab";
import { AnalyticsTab } from "./components/AnalyticsTab";
import { IncidentTab } from "./components/IncidentTab";

type TabType = "DASHBOARD" | "DEVICES" | "ANALYTICS" | "INCIDENTS";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [operatorId, setOperatorId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabType>("DASHBOARD");

  // Master reactive telemetry inventories
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);

  // System emergency state
  const [emergencyState, setEmergencyState] = useState<boolean>(false);

  // Check existing operator session on load
  useEffect(() => {
    const cachedBadge = localStorage.getItem("aether_operator_badge");
    if (cachedBadge) {
      setOperatorId(cachedBadge);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (badge: string) => {
    localStorage.setItem("aether_operator_badge", badge);
    setOperatorId(badge);
    setIsLoggedIn(true);
    
    // Add custom connection log
    const now = new Date().toLocaleTimeString();
    setLogs(prev => [
      ...prev,
      { timestamp: now, level: "INFO", message: `AUTHENTICATION CLEAR: Operator badge ${badge} confirmed.` }
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem("aether_operator_badge");
    setIsLoggedIn(false);
    setOperatorId("");
  };

  // Automated telemetric live ticker simulation
  useEffect(() => {
    if (!isLoggedIn) return;

    const tickMsgs = [
      "Router interface loopback NOC-RT-402-A reporting normal bounds.",
      "Latency check APAC Gateway LB01: 28ms (Optimal status limit).",
      "Core DDoS mitigation filter profile validated: active.",
      "Primary Backbone Ring SNR index: 28.2 dB. Status: stable.",
      "Autonomous security packet sweep completed: 0 threats resolved.",
      "Wireless access interface node NOC-AP-004-K diagnostic report cached.",
      "Heartbeat ping response from Global Core cluster received (~8ms)."
    ];

    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const randomMsg = tickMsgs[Math.floor(Math.random() * tickMsgs.length)];
      
      setLogs(prev => [
        ...prev,
        { timestamp: now, level: "INFO", message: `TELEMETRY TICK: ${randomMsg}` }
      ].slice(-80)); // Limit to last 80 messages for perfect memory control
    }, 12000); // Trigger every 12 seconds for balanced visual interaction

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // Adjust alerts logging on emergency changes
  useEffect(() => {
    if (!isLoggedIn) return;
    const now = new Date().toLocaleTimeString();
    
    if (emergencyState) {
      setLogs(prev => [
        ...prev,
        { timestamp: now, level: "ERROR", message: "CRITICAL SYSTEM PROTOCOL: FORCEFUL ALARM MANUAL TRIGGERS TRACED!" }
      ]);
    } else {
      setLogs(prev => [
        ...prev,
        { timestamp: now, level: "INFO", message: "SYSTEM RESTORE: Master emergency override signal purged returned to standby." }
      ]);
    }
  }, [emergencyState, isLoggedIn]);

  // Render appropriate view tab layout
  const renderTabContent = () => {
    switch (activeTab) {
      case "DASHBOARD":
        return (
          <DashboardTab 
            devices={devices} 
            logs={logs} 
            setLogs={setLogs} 
            emergencyState={emergencyState}
            activeIncidentsCount={incidents.filter(i => i.duration === "Ongoing").length}
          />
        );
      case "DEVICES":
        return <DevicesTab devices={devices} setDevices={setDevices} />;
      case "ANALYTICS":
        return <AnalyticsTab />;
      case "INCIDENTS":
        return (
          <IncidentTab 
            incidents={incidents} 
            setIncidents={setIncidents} 
            devices={devices} 
          />
        );
      default:
        return <div>No panel viewport assigned.</div>;
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLogin} />;
  }

  return (
    <div id="command_center_layout" className="min-h-screen w-full flex bg-[#090b11] overflow-hidden text-[#e2e8f0] relative">
      <div className="scanline" />

      {/* Primary Sidebar Console Layout Frame */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        operatorId={operatorId} 
        onLogout={handleLogout}
        emergencyState={emergencyState}
        setEmergencyState={setEmergencyState}
        activeIncidentsCount={incidents.filter(i => i.duration === "Ongoing").length}
      />

      {/* Main viewport Container */}
      <main id="viewport_main" className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar p-6 relative">
        <div className="absolute inset-0 network-grid opacity-[0.03] pointer-events-none" />

        {/* Dynamic Critical Risk Warn Header banner */}
        <AnimatePresence>
          {emergencyState && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center justify-between text-xs font-mono glow-red"
            >
              <div className="flex items-center gap-2.5">
                <AlertOctagon className="w-5 h-5 text-red-400 animate-bounce" />
                <span className="font-bold tracking-wider uppercase">
                  MANUAL RED_ALARM PROTOCOLS ACTIVE. TELEMETRY CORES AND SPINE SEGMENTS ISOLATED UNDER PROTOCOL EX-20412.
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="font-extrabold text-[10px] uppercase">RISK AT MAXIMUM</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Render Tab Layout with high fidelity transitions */}
        <div className="flex-1 z-10">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {renderTabContent()}
          </motion.div>
        </div>

        {/* Bottom unified footer indicators */}
        <footer className="mt-12 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 font-mono gap-4">
          <div className="flex items-center gap-1.5 uppercase">
            {emergencyState ? (
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>
              STATUS: {emergencyState ? "EMERGENCY OVERRIDE ENFORCED" : "SECURED SEC_GRADE_A"}
            </span>
          </div>
          <div>
            <span>CO-PILOT CONTEXT: ACTIVE GROUNDING ON {devices.length} NODES SATELLITES</span>
          </div>
          <div>
            <span>AETHER COMMAND CORE © COPYRIGHT 2026</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
