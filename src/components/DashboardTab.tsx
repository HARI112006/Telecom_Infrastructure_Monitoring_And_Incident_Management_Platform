import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  Network, 
  Activity, 
  ShieldAlert, 
  Terminal, 
  TrendingUp, 
  Cpu, 
  CheckCircle, 
  AlertTriangle 
} from "lucide-react";
import { Device, LogEntry } from "../types";

interface DashboardTabProps {
  devices: Device[];
  logs: LogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
  emergencyState: boolean;
  activeIncidentsCount: number;
}

interface MapNode {
  id: string;
  name: string;
  x: number;
  y: number;
  ip: string;
  load: string;
  status: 'HEALTHY' | 'WARNING' | 'DOWN';
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  devices,
  logs,
  setLogs,
  emergencyState,
  activeIncidentsCount
}) => {
  const [selectedMapNode, setSelectedMapNode] = useState<MapNode | null>(null);
  const [cliInput, setCliInput] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);

  // SVG Map Nodes data
  const MAP_NODES: MapNode[] = [
    { id: "NODE-1", name: "US-Backbone Primary Sw01", x: 180, y: 110, ip: "172.16.8.10", load: "42%", status: "HEALTHY" },
    { id: "NODE-2", name: "US-Backbone Secondary Sw02", x: 310, y: 150, ip: "172.16.8.11", load: "98%", status: emergencyState ? "DOWN" : "DOWN" },
    { id: "NODE-3", name: "EMEA-Core Edge-RT01", x: 490, y: 90, ip: "10.240.41.1", load: "55%", status: "HEALTHY" },
    { id: "NODE-4", name: "EMEA-Core Edge-RT02", x: 580, y: 160, ip: "10.240.41.2", load: "28%", status: "HEALTHY" },
    { id: "NODE-5", name: "APAC-Gateway LB01", x: 740, y: 100, ip: "192.168.12.1", load: "34%", status: "HEALTHY" },
    { id: "NODE-6", name: "APAC-Gateway LB02", x: 820, y: 180, ip: "192.168.12.2", load: "87%", status: "WARNING" },
    { id: "NODE-7", name: "LATAM-Access Gateway RT03", x: 280, y: 260, ip: "10.240.41.3", load: "12%", status: "HEALTHY" },
  ];

  // Auto scroll logs console to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Handle command-line interaction in CLI
  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;

    const cmd = cliInput.trim().toLowerCase();
    const now = new Date().toLocaleTimeString();
    
    // Add command to history logs
    const opLog: LogEntry = {
      timestamp: now,
      level: "INFO",
      message: `OPERATOR RUN: ${cliInput}`
    };

    let resultLog: LogEntry;

    if (cmd === "help") {
      resultLog = {
        timestamp: now,
        level: "INFO",
        message: "STABLE COMMANDS: help | status | ping <ip> | prune | resolve-bgp"
      };
    } else if (cmd.startsWith("ping ")) {
      const address = cliInput.substring(5).trim();
      resultLog = {
        timestamp: now,
        level: "INFO",
        message: `PING TO ${address}: RECEIVED 64 bytes. Latency ~ 18.2ms.`
      };
    } else if (cmd === "status") {
      resultLog = {
        timestamp: now,
        level: emergencyState ? "WARN" : "INFO",
        message: `CONSOLE HEALTH STATE: ${emergencyState ? "EMERGENCY SECURITY BYPASS" : "ACTIVE MONITORING TRACED"}`
      };
    } else if (cmd === "resolve-bgp") {
      resultLog = {
        timestamp: now,
        level: "INFO",
        message: "AUTO-PROTOCOL PURGE ROUTE LEAK FLUSHED SAFELY."
      };
    } else if (cmd === "prune") {
      setLogs([]);
      setCliInput("");
      return;
    } else {
      resultLog = {
        timestamp: now,
        level: "WARN",
        message: `COMMAND NOT RECOGNIZED: "${cmd}". Type "help" for layout commands.`
      };
    }

    setLogs(prev => [...prev, opLog, resultLog]);
    setCliInput("");
  };

  // Select initial node if none selected
  useEffect(() => {
    if (!selectedMapNode) {
      setSelectedMapNode(MAP_NODES[0]);
    }
  }, []);

  return (
    <div id="dashboard_tab" className="space-y-6 text-left">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white uppercase font-mono">Operations Dashboard</h2>
          <p className="text-xs text-slate-400">Main telemetric console trace of distributed system paths</p>
        </div>
        
        {/* Connection health check bar */}
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow" />
            <span>PRIMARY CORE FEED ESTABLISHED</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">RECV_RATE: 4.8 MB/S</span>
        </div>
      </div>

      {/* Primary KPI Stats Frame */}
      <div id="kpi_grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total nodes */}
        <div className="glass-panel p-4.5 rounded-xl border border-white/10 relative overflow-hidden text-left">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Total Network Slices</p>
              <h3 className="text-2xl font-bold text-white mt-1">1,402</h3>
            </div>
            <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/10">
              <Network className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-mono">
            <span className="text-emerald-400 font-bold">1,388 Active Nodes</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">14 Isolated</span>
          </div>
        </div>

        {/* System Latency */}
        <div className="glass-panel p-4.5 rounded-xl border border-white/10 relative overflow-hidden text-left">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Core Ping Latency</p>
              <h3 className="text-2xl font-bold mt-1 text-cyan-400 glow-text-cyan">18.4 ms</h3>
            </div>
            <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/10">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-mono">
            <span className="text-cyan-400 font-bold">0.05ms Jitter StdDev</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">High precision</span>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="glass-panel p-4.5 rounded-xl border border-white/10 relative overflow-hidden text-left">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Active Incidents</p>
              <h3 className="text-2xl font-bold mt-1 text-red-400 glow-text-red">{activeIncidentsCount}</h3>
            </div>
            <div className="p-2 rounded bg-red-500/10 text-red-400 border border-red-500/10">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-mono">
            <span className="text-red-400 font-bold">1 Critical BGP Hijack</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">2 Medium Triage</span>
          </div>
        </div>

        {/* Global Security Risk Index */}
        <div className="glass-panel p-4.5 rounded-xl border border-white/10 relative overflow-hidden text-left">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Risk Mitigate Score</p>
              <h3 className={`text-2xl font-bold mt-1 tracking-tight ${emergencyState ? 'text-red-400 font-extrabold glow-text-red' : 'text-amber-400 font-semibold'}`}>
                {emergencyState ? "CRITICAL RISK (98/100)" : "STABLE (12/100)"}
              </h3>
            </div>
            <div className={`p-2 rounded border ${emergencyState ? 'bg-red-500/20 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
              <Cpu className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-mono">
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${emergencyState ? 'bg-red-500 w-[98%]' : 'bg-emerald-500 w-[12%]'}`} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Interactive Grid Layout: Topology map and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Topological Interactive Map Canvas (3 spans) */}
        <div className="lg:col-span-3 bg-[#11141f] border border-white/10 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-[1px] left-[1px] w-3 h-3 border-t border-l border-cyan-500/30" />
          <div className="absolute top-[1px] right-[1px] w-3 h-3 border-t border-r border-cyan-500/30" />
          
          <div className="flex items-center justify-between mb-4 z-10">
            <div>
              <h3 className="text-sm font-bold tracking-wider text-white uppercase font-mono">Global Topology Map Projection</h3>
              <p className="text-[11px] text-slate-500 tracking-wide mt-0.5">Interactive projection nodes representing real physical spine links.</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 bg-white/[0.02] border border-white/5 py-1 px-2.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
              <span>LIVE PING ORBITALS ACTIVE</span>
            </div>
          </div>

          {/* Map canvas containing real SVG projection vectors */}
          <div className="relative bg-[#090b10] border border-white/5 rounded-lg h-72 py-2 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 network-grid opacity-30 pointer-events-none" />
            
            {/* Real SVG Connections and Map Elements */}
            <svg id="network_map_svg" className="absolute inset-0 w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid slice">
              {/* Connected Spine Paths */}
              {/* US01 to US02 (DOWN link) */}
              <line x1="180" y1="110" x2="310" y2="150" stroke={emergencyState ? "#f87171" : "#f87171"} strokeWidth="1.5" strokeDasharray="5,5" className="opacity-70" />
              {/* US01 to LATAM */}
              <line x1="180" y1="110" x2="280" y2="260" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4,4" className="opacity-50" />
              {/* US02 to LATAM */}
              <line x1="310" y1="150" x2="280" y2="260" stroke="#f87171" strokeWidth="1" className="opacity-30" />
              {/* US01 to EMEA01 */}
              <line x1="180" y1="110" x2="490" y2="90" stroke="#00f0ff" strokeWidth="1.5" />
              {/* EMEA01 to EMEA02 */}
              <line x1="490" y1="90" x2="580" y2="160" stroke="#00f0ff" strokeWidth="1" />
              {/* EMEA01 to APAC01 */}
              <line x1="490" y1="90" x2="740" y2="100" stroke="#00f0ff" strokeWidth="1" strokeDasharray="6,6" />
              {/* EMEA02 to APAC02 */}
              <line x1="580" y1="160" x2="820" y2="180" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="4,4" />
              {/* APAC01 to APAC02 */}
              <line x1="740" y1="100" x2="820" y2="180" stroke="#00f0ff" strokeWidth="1" />

              {/* Pulsing connection signal overlays */}
              <circle cx="245" cy="130" r="3" fill="#00f0ff">
                <animateMotion path="M -65 -20 L 65 20" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="335" cy="100" r="3" fill="#00f0ff">
                <animateMotion path="M -155 10 L 155 -10" dur="6s" repeatCount="indefinite" />
              </circle>

              <g id="map_interactive_nodes" className="cursor-pointer">
                {MAP_NODES.map((node) => {
                  const isSelected = selectedMapNode?.id === node.id;
                  let color = "#00f0ff";
                  if (node.status === "WARNING") color = "#fbbf24";
                  if (node.status === "DOWN" || emergencyState) color = "#f87171";
                  
                  return (
                    <g 
                      key={node.id} 
                      onClick={() => setSelectedMapNode(node)}
                      className="transition-transform duration-300 hover:scale-110"
                    >
                      {/* Active dynamic ping radiation waves */}
                      {node.status !== "DOWN" && !emergencyState && (
                        <circle 
                          cx={node.x} 
                          cy={node.y} 
                          r={isSelected ? 16 : 8} 
                          fill="none" 
                          stroke={color} 
                          strokeWidth="1" 
                          className="opacity-40"
                        >
                          <animate 
                            attributeName="r" 
                            values={`${isSelected ? 10 : 4};${isSelected ? 28 : 18}`} 
                            dur="2.5s" 
                            repeatCount="indefinite" 
                          />
                          <animate 
                            attributeName="opacity" 
                            values="0.6;0" 
                            dur="2.5s" 
                            repeatCount="indefinite" 
                          />
                        </circle>
                      )}

                      {/* Exact node center anchor */}
                      <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r={isSelected ? 6 : 4.5} 
                        fill={color} 
                        className="transition-all"
                        stroke="#090b10"
                        strokeWidth="1.5"
                      />
                      
                      {/* Label metadata */}
                      <text 
                        x={node.x} 
                        y={node.y - 10} 
                        fill={isSelected ? "#ffffff" : "#64748b"} 
                        fontSize="9" 
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="font-bold select-none"
                      >
                        {node.id}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Float HUD Instructions */}
            <div className="absolute bottom-3 left-3 bg-black/70 border border-white/10 py-1 px-2.5 rounded text-[9px] font-mono text-slate-500">
              * Click projection nodes to audit live telemetry diagnostics
            </div>
          </div>
        </div>

          {/* Node specifics Panel (1 span) */}
          <div className="lg:col-span-1 bg-[#11141f] border border-white/10 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase font-mono tracking-wider mb-4">
                <Cpu className="text-cyan-400 w-4 h-4" />
                <span>Node Telemetry</span>
              </div>

              {selectedMapNode ? (
                <div className="space-y-4 text-left">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">DEVICE ASSIGNED ID</span>
                    <h4 className="text-sm font-bold text-white font-mono">{selectedMapNode.id}</h4>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">NODE LABEL</span>
                    <p className="text-xs text-slate-300 font-medium leading-normal">{selectedMapNode.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">ASSIGNED ADDRESS IP</span>
                    <span className="text-xs text-white bg-[#1a1f2c] border border-white/10 px-2.5 py-1 rounded font-mono inline-block">
                      {selectedMapNode.ip}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">PEAK LOAD</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-cyan-400" 
                          style={{ width: selectedMapNode.load }} 
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-white whitespace-nowrap">{selectedMapNode.load}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">LINK STATUS</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono uppercase tracking-wide px-2.5 py-0.5 rounded-full mt-1.5 border ${
                      selectedMapNode.status === 'HEALTHY' && !emergencyState
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : selectedMapNode.status === 'WARNING' && !emergencyState
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        : "bg-red-500/10 border-red-500/20 text-red-400 glow-red animate-pulse"
                    }`}>
                      {emergencyState ? "EMERGENCY_DOWN" : selectedMapNode.status}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs font-mono">
                  No projection audited.
                </div>
              )}
            </div>

            {/* Core Device Health list button summary */}
            <div className="border-t border-white/10 pt-4 mt-6">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-2">Segment Health Summary</div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-white/[0.02] border border-white/5 p-2 rounded text-left">
                  <div className="text-[9px] text-slate-500 uppercase">US BACKBONE</div>
                  <div className="text-white font-bold mt-0.5 text-red-400">{emergencyState ? "0.0%" : "91.24%"}</div>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-2 rounded text-left">
                  <div className="text-[9px] text-slate-500 uppercase">EMEA TRANSIT</div>
                  <div className="text-white font-bold mt-0.5 text-emerald-400">99.98%</div>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* Primary Log Logging Terminal (Express client CLI simulation in raw FUI console aspect) */}
      <div id="sys_shell_panel" className="bg-[#111420] border border-white/10 rounded-xl overflow-hidden flex flex-col h-72">
        <div className="bg-[#131725] px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="text-cyan-400 w-4.5 h-4.5" />
            <h3 className="text-xs font-bold font-mono tracking-wider text-white uppercase">System Telemetrics CLI Terminal Feed</h3>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/50" />
          </div>
        </div>

        {/* Dynamic Log streams view with scrolling behavior */}
        <div 
          ref={terminalRef}
          className="flex-1 p-4 overflow-y-auto custom-scrollbar font-mono text-xs space-y-2 bg-[#0a0c12] text-slate-300"
        >
          {logs.map((log, index) => {
            let badgeStyle = "text-cyan-400 bg-cyan-950/40 border-cyan-500/20";
            if (log.level === 'WARN') badgeStyle = "text-amber-400 bg-amber-950/40 border-amber-500/20";
            if (log.level === 'ERROR') badgeStyle = "text-red-400 bg-red-950/40 border-red-500/20";

            return (
              <div key={index} className="flex items-start gap-4 hover:bg-white/[0.01] py-0.5 px-1 rounded">
                <span className="text-slate-600 select-none">[{log.timestamp}]</span>
                <span className={`px-2 py-0.5 text-[9px] font-bold border rounded uppercase block tracking-tight ${badgeStyle}`}>
                  {log.level}
                </span>
                <span className={`leading-relaxed text-left flex-1 ${
                  log.level === 'ERROR' ? 'text-red-200 font-bold' : log.level === 'WARN' ? 'text-amber-200' : 'text-slate-300'
                }`}>
                  {log.message}
                </span>
              </div>
            );
          })}
        </div>

        {/* CLI Prompt at details */}
        <form onSubmit={handleCliSubmit} className="bg-[#0b0d14] border-t border-white/10 px-4 py-2.5 flex items-center gap-3">
          <span className="text-cyan-400 font-mono text-xs font-semibold select-none">aether_cli_operator:~#</span>
          <input 
            id="cli_console_input"
            type="text" 
            value={cliInput}
            onChange={(e) => setCliInput(e.target.value)}
            className="flex-1 bg-transparent border-none text-white font-mono text-xs outline-none placeholder-slate-600"
            placeholder='Type command ("help", "status", "ping <ip>", "prune", "resolve-bgp")...'
          />
          <button 
            type="submit" 
            className="text-[10px] text-slate-500 hover:text-cyan-400 font-bold font-mono tracking-wider transition-colors uppercase cursor-pointer"
          >
            EXEC_CMD
          </button>
        </form>
      </div>

      {/* Cybernetic Advisories / Static AI Advice lists */}
      <div className="glass-panel p-5 rounded-xl border border-white/10 relative overflow-hidden text-left">
        <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase mb-3.5 flex items-center gap-2">
          <TrendingUp className="text-cyan-400 w-4 h-4" />
          <span>Operational Intelligent Warnings</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#151926]/40 border border-white/5 p-3 rounded-lg text-left">
            <div className="text-slate-200 font-bold font-mono mb-1 text-cyan-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>BGP Prefixes: Filter active</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-sans text-[11px]">Dynamic validation is running across external border routers to suppress leaked routes instantly.</p>
          </div>
          <div className="bg-[#151926]/40 border border-white/5 p-3 rounded-lg text-left">
            <div className="text-slate-200 font-bold font-mono mb-1 text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>BGP Switch Timeout Threshold</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-sans text-[11px]">Heartbeats are adjusted to 15s. Node US02 is suffering sustained physical loss. Dispatch router engineer.</p>
          </div>
          <div className="bg-[#151926]/40 border border-white/5 p-3 rounded-lg text-left">
            <div className="text-slate-200 font-bold font-mono mb-1 text-cyan-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mitigation Engine is online</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-sans text-[11px]">DNS amplified filters are running. 401Gbps inbounds rates drops to 12.4Gbps harmlessly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
