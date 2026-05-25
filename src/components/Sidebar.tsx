import React from "react";
import { 
  BarChart3, 
  Layers, 
  Activity, 
  AlertOctagon, 
  Power, 
  Terminal, 
  User, 
  Disc, 
  ShieldAlert, 
  Network 
} from "lucide-react";

type TabType = "DASHBOARD" | "DEVICES" | "ANALYTICS" | "INCIDENTS";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  operatorId: string;
  onLogout: () => void;
  emergencyState: boolean;
  setEmergencyState: (state: boolean) => void;
  activeIncidentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  operatorId,
  onLogout,
  emergencyState,
  setEmergencyState,
  activeIncidentsCount
}) => {
  const tabs = [
    { id: "DASHBOARD" as TabType, name: "NOC Dashboard", icon: Activity, detail: "Core Telemetry" },
    { id: "DEVICES" as TabType, name: "Node Grid", icon: Layers, detail: "Infrastructure State" },
    { id: "ANALYTICS" as TabType, name: "Analytics Hub", icon: BarChart3, detail: "Telemetry Metrics" },
    { id: "INCIDENTS" as TabType, name: "Anomalies", icon: AlertOctagon, detail: "Root-Cause Chat", badgeCount: activeIncidentsCount },
  ];

  return (
    <aside id="sidebar_container" className="w-72 bg-[#10131d]/95 border-r border-white/10 flex flex-col justify-between h-screen sticky top-0 flex-shrink-0 z-20">
      {/* Brand logo bar */}
      <div className="p-5 border-b border-white/15 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 glow-cyan">
            <Network className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest text-white uppercase font-sans">Aether NOC</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">NetOps Command</p>
          </div>
        </div>

        {/* Console Operator Profile */}
        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 p-2.5 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-cyan-950 flex items-center justify-center border border-cyan-500/30">
            <User className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-left font-mono">
            <div className="text-[10px] text-slate-500 uppercase">IDENTIFIER</div>
            <div className="text-xs text-slate-200 font-semibold">{operatorId}</div>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[9px] text-emerald-400 font-mono font-bold tracking-tight">SECURE</span>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar text-left">
        <div className="text-[10px] text-slate-500 font-semibold px-2 uppercase tracking-widest mb-2 font-mono">SYSTEM VIEWS</div>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              id={`tab_${tab.id.toLowerCase()}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg border transition-all text-left group cursor-pointer ${
                isActive
                  ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-400 font-medium"
                  : "bg-transparent border-transparent text-slate-400 hover:bg-white/[0.03] hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                <div>
                  <div className="text-xs tracking-wide uppercase font-sans">{tab.name}</div>
                  <div className="text-[9px] text-slate-500 font-mono tracking-wider">{tab.detail}</div>
                </div>
              </div>
              
              {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md glow-red">
                  {tab.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Extreme System Override Protocol */}
      <div className="p-4 border-t border-white/10 space-y-4">
        <div className="bg-red-500/[0.02] border border-red-500/20 p-3 rounded-lg text-left">
          <div className="flex items-center gap-2 text-red-400 uppercase font-bold text-[10px] font-mono mb-1.5 tracking-wider">
            <ShieldAlert className="w-4 h-4 animate-bounce" />
            <span>OVERRIDE PROTOCOL</span>
          </div>
          <button
            id="emergency_toggle"
            onClick={() => setEmergencyState(!emergencyState)}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded text-xs font-mono font-bold tracking-widest uppercase transition-all duration-300 border cursor-pointer ${
              emergencyState
                ? "bg-red-600 border-red-700 text-white shadow-lg shadow-red-500/20 animate-pulse"
                : "bg-[#1c1214] border-red-900/40 text-red-500 hover:bg-red-950/40 hover:text-red-400"
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{emergencyState ? "STANDBY FORCEFUL ACTIVE_ALARM" : "FORCEFUL RED_ALARM"}</span>
          </button>
        </div>

        {/* Logout action */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Disc className="w-3 h-3 text-cyan-500 animate-spin" />
            <span>CONNECT: {window.location.port || "3000"}</span>
          </div>
          <button 
            id="logout_btn"
            onClick={onLogout} 
            className="hover:text-cyan-400 transition-colors uppercase font-bold cursor-pointer"
          >
            DISCONNECT
          </button>
        </div>
      </div>
    </aside>
  );
};
