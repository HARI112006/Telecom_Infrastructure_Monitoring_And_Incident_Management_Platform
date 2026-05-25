import React, { useState } from "react";
import { 
  BarChart3, 
  Download, 
  Activity, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  FileSpreadsheet, 
  FileDown 
} from "lucide-react";

export const AnalyticsTab: React.FC = () => {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: string; time: string } | null>(null);

  // Network metrics line chart points
  const PING_TIMELINE = [
    { time: "05:00", value: 14, label: "14.2ms" },
    { time: "05:10", value: 16, label: "16.1ms" },
    { time: "05:20", value: 25, label: "25.0ms" },
    { time: "05:30", value: 68, label: "68.4ms (BGP leak start)" },
    { time: "05:40", value: 184, label: "184.2ms (Peak peak)" },
    { time: "05:50", value: 42, label: "42.1ms (Route bypass active)" },
    { time: "06:00", value: 18, label: "18.4ms (Stabilized)" },
    { time: "06:10", value: 15, label: "15.0ms (Current)" },
  ];

  // SVG dimensions for chart
  const width = 800;
  const height = 200;
  const padding = 40;

  // Convert points to SVG coordinates
  const points = PING_TIMELINE.map((item, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (PING_TIMELINE.length - 1);
    // Value range 10 - 200
    const y = height - padding - ((item.value - 10) * (height - padding * 2)) / 190;
    return { ...item, x, y };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ")
    : "";

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : "";

  // Dynamic CSV Download generation simulation
  const triggerCsvDownload = () => {
    const headers = "Timestamp,Metric,Average_Latency,Uptime_Ratio,Status\n";
    const dataRows = PING_TIMELINE.map(t => `${t.time},Ping_Latency,${t.value}ms,99.98%,ACTIVE`).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + dataRows);
    
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `Aether_NOC_Telemetry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dynamic simulated PDF action logger
  const triggerPdfSimulation = () => {
    alert("GENERATING HIGH-RES CRYPTO-SECURED CONSOLE REPORT PDF...\nCompiling telemetry points...\nSignature op-7734 key integrated.\nPDF generation succeeded! Buffered download generated.");
  };

  return (
    <div id="analytics_tab" className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white uppercase font-mono">Telemetry Analytics Core</h2>
          <p className="text-xs text-slate-400">High precision performance reports and network metrics correlation</p>
        </div>
        
        {/* Reports Download Actions */}
        <div className="flex items-center gap-3">
          <button 
            id="export_csv_btn"
            onClick={triggerCsvDownload}
            className="flex items-center gap-2 bg-[#171b29] border border-white/15 text-slate-300 hover:text-white transition-colors py-2 px-3.5 rounded-lg text-xs font-mono font-semibold cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Telemetry CSV</span>
          </button>
          
          <button 
            id="export_pdf_btn"
            onClick={triggerPdfSimulation}
            className="flex items-center gap-2 bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/35 transition-colors border border-cyan-500/30 py-2 px-3.5 rounded-lg text-xs font-mono font-semibold cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>PDF Report</span>
          </button>
        </div>
      </div>

      {/* Main interactive chart */}
      <div className="bg-[#111420] border border-white/10 p-5 rounded-xl space-y-4 relative">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">1-Hour Latency Spike Correlation</span>
            <h3 className="text-sm font-bold text-white uppercase font-sans mt-0.5">Spine Segment US_BACKBONE_D (ms)</h3>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-1 bg-cyan-500 rounded" />
              <span>Ping Latency (ms)</span>
            </span>
          </div>
        </div>

        {/* Core SVG chart block */}
        <div className="relative overflow-x-auto custom-scrollbar pt-2">
          <div className="min-w-[760px] relative">
            <svg id="latency_vector_chart" className="w-full h-[200px]" viewBox={`0 0 ${width} ${height}`}>
              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.03)" />
              <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.03)" />
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.08)" />

              {/* Area path behind line chart */}
              <path d={areaD} fill="url(#chartGrad)" opacity="0.12" />

              {/* Glowing Line Path curve */}
              <path 
                d={pathD} 
                fill="none" 
                stroke="#00f0ff" 
                strokeWidth="2.5" 
                className="glow-cyan"
              />

              {/* Interactive Anchor points */}
              {points.map((pt, idx) => (
                <rect
                  key={idx}
                  x={pt.x - 4} 
                  y={pt.y - 4} 
                  width="8" 
                  height="8" 
                  fill={hoveredPoint?.time === pt.time ? "#ffffff" : "#00f0ff"} 
                  stroke="#0b0e14"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredPoint({ x: pt.x, y: pt.y, val: pt.label, time: pt.time })}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}

              {/* Axis Labels Time */}
              {points.map((pt, idx) => (
                <text 
                  key={idx}
                  x={pt.x} 
                  y={height - 15} 
                  fill="#64748b" 
                  fontSize="9" 
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {pt.time}
                </text>
              ))}

              {/* Axis Labels Latency Range */}
              <text x={padding - 10} y={padding} fill="#475569" fontSize="9" fontFamily="monospace" textAnchor="end">200ms</text>
              <text x={padding - 10} y={height / 2} fill="#475569" fontSize="9" fontFamily="monospace" textAnchor="end">100ms</text>
              <text x={padding - 10} y={height - padding} fill="#475569" fontSize="9" fontFamily="monospace" textAnchor="end">10ms</text>

              {/* SVG Gradients definitions */}
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Hover tooltip metadata */}
            {hoveredPoint && (
              <div 
                className="absolute bg-[#181d2c] border border-cyan-500/40 px-3 py-2 rounded shadow-2xl z-40 text-[10px] font-mono whitespace-nowrap"
                style={{ left: hoveredPoint.x - 40, top: hoveredPoint.y - 50 }}
              >
                <div className="text-white font-bold">LATENCY: {hoveredPoint.val}</div>
                <div className="text-slate-400 mt-0.5">TIME TRACE: {hoveredPoint.time}</div>
              </div>
            )}
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-500 text-center uppercase">
          * Hover metric graph intersection anchors to inspect diagnostic peak coordinates.
        </div>
      </div>

      {/* Latency Dynamics satellite ping orbits and Report listings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* High-tech Concentration radar visualization */}
        <div className="bg-[#111420] border border-white/10 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="mb-4">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Live Orbit Satellites</span>
            <h3 className="text-sm font-bold text-white uppercase font-sans mt-0.5">Ping Dynamics Radar orbital</h3>
          </div>

          <div className="bg-[#090b10] border border-white/5 rounded-lg h-56 flex items-center justify-center relative overflow-hidden">
            {/* Radar concentric circular grid rings */}
            <div className="absolute w-[200px] h-[200px] border border-white/[0.02] rounded-full" />
            <div className="absolute w-[140px] h-[140px] border border-white/[0.04] rounded-full" />
            <div className="absolute w-[80px] h-[80px] border border-white/[0.06] rounded-full" />
            <div className="absolute w-[20px] h-[20px] border border-white/[0.1] rounded-full" />

            {/* Radar diagnostic sweeping line */}
            <div className="absolute inset-0 bg-conic-grad from-cyan-500/10 via-transparent to-transparent animate-spin duration-10000 opacity-60 pointer-events-none" 
                 style={{ borderRadius: '50%', transformOrigin: 'center' }} 
            />

            {/* Active orbiting satellite telemetry labels representing regional nodes */}
            {/* Pulse 1: US */}
            <div className="absolute top-[40%] left-[20%] text-[9px] font-mono text-cyan-400 flex items-center gap-1 scale-90">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>US-EAST (18ms)</span>
            </div>
            {/* Pulse 2: APAC */}
            <div className="absolute top-[20%] left-[65%] text-[9px] font-mono text-amber-500 flex items-center gap-1 scale-90">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>APAC-SING (165ms)</span>
            </div>
            {/* Pulse 3: EMEA */}
            <div className="absolute bottom-[25%] right-[25%] text-[9px] font-mono text-cyan-400 flex items-center gap-1 scale-90">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>EMEA-FR (14ms)</span>
            </div>

            <span className="text-[9px] text-slate-500 font-mono absolute bottom-2 select-none">SCAN RESOLVE: ACCURATE</span>
          </div>
        </div>

        {/* Monthly Historical Uptime Reports tabular data */}
        <div id="uptime_reports_list" className="bg-[#111420] border border-white/10 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Archive Metrics Logs</span>
                <h3 className="text-sm font-bold text-white uppercase font-sans mt-0.5">Monthly Core Availability</h3>
              </div>
              <Clock className="w-4.5 h-4.5 text-cyan-400" />
            </div>

            <div className="space-y-2 text-left">
              {[
                { month: "May 2026 (Active)", process: "1,418.5 TB processed", ratio: "99.98% Uptime", state: "OPTIMAL" },
                { month: "April 2026", process: "3,892.4 TB processed", ratio: "99.94% Uptime", state: "STABLE" },
                { month: "March 2026", process: "2,401.9 TB processed", ratio: "99.85% Uptime", state: "REMEDIED" },
                { month: "February 2026", process: "1,988.2 TB processed", ratio: "99.99% Uptime", state: "OPTIMAL" },
              ].map((rep, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/[0.03] rounded-lg border border-white/5 transition-colors font-mono text-xs">
                  <div>
                    <div className="text-white font-semibold">{rep.month}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{rep.process}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-cyan-400 font-bold block">{rep.ratio}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded inline-block mt-1 ${
                      rep.state === 'OPTIMAL' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'
                    }`}>
                      {rep.state}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
