import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Filter, 
  Plus, 
  Layers, 
  Radio, 
  Cpu, 
  X, 
  Smartphone, 
  CheckCircle2, 
  AlertOctagon, 
  Wrench, 
  ExternalLink 
} from "lucide-react";
import { Device, DeviceStatus } from "../types";

interface DevicesTabProps {
  devices: Device[];
  setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
}

export const DevicesTab: React.FC<DevicesTabProps> = ({ devices, setDevices }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [regionFilter, setRegionFilter] = useState<string>("ALL");
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Node Form fields
  const [formId, setFormId] = useState("NOC-RT-402-E");
  const [formName, setFormName] = useState("Aether Edge Core RT04");
  const [formIp, setFormIp] = useState("10.240.41.4");
  const [formRegion, setFormRegion] = useState("EMEA Edge");
  const [formType, setFormType] = useState("EDGE_ROUTER");
  const [formStatus, setFormStatus] = useState<DeviceStatus>("HEALTHY");
  const [formLatency, setFormLatency] = useState("12ms");

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId || !formName || !formIp) return;

    const newDevice: Device = {
      id: formId,
      name: formName,
      ip: formIp,
      region: formRegion,
      latency: formLatency,
      uptime: "100.0%",
      status: formStatus,
      type: formType
    };

    setDevices(prev => [newDevice, ...prev]);
    
    // Auto-increment some IDs for ease of next use
    const matchGroup = formId.match(/\d+/);
    if (matchGroup) {
      const nextNum = parseInt(matchGroup[0]) + 1;
      setFormId(`NOC-RT-${nextNum}-E`);
    }

    // Reset simple values & close
    setFormName("Aether Edge Core RT");
    setFormIp("10.240.41." + (Math.floor(Math.random() * 253) + 1));
    setShowAddModal(false);
  };

  const deleteDevice = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
    if (selectedDevice?.id === id) {
      setSelectedDevice(null);
    }
  };

  // Filter nodes
  const filteredDevices = devices.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.ip.includes(searchQuery) ||
                          d.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
    const matchesRegion = regionFilter === "ALL" || d.region === regionFilter;

    return matchesSearch && matchesStatus && matchesRegion;
  });

  return (
    <div id="devices_tab" className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white uppercase font-mono">Infrastructure Node Inventory</h2>
          <p className="text-xs text-slate-400">Inventory and routing stats of network infrastructure units</p>
        </div>
        
        {/* Trigger to open Add Device Module */}
        <button
          id="add_node_trigger"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold py-2 px-3.5 rounded-lg shadow-lg shadow-cyan-500/10 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Access Layer Node</span>
        </button>
      </div>

      {/* Bento grid quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="bg-[#121522] border border-white/10 rounded-xl p-4 flex items-center gap-4 text-left">
          <div className="p-2.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 tracking-wider">HEALTHY SEGMENTS</span>
            <h4 className="text-lg font-bold text-white mt-0.5">
              {devices.filter(d => d.status === "HEALTHY").length} Nodes Online
            </h4>
          </div>
        </div>

        <div className="bg-[#121522] border border-white/10 rounded-xl p-4 flex items-center gap-4 text-left">
          <div className="p-2.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/10">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 tracking-wider">WARN / MAINTENANCE</span>
            <h4 className="text-lg font-bold text-white mt-0.5">
              {devices.filter(d => d.status === "WARNING" || d.status === "MAINTENANCE").length} Nodes Inspected
            </h4>
          </div>
        </div>

        <div className="bg-[#121522] border border-white/10 rounded-xl p-4 flex items-center gap-4 text-left">
          <div className="p-2.5 rounded bg-red-500/10 text-red-400 border border-red-500/10">
            <AlertOctagon className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 tracking-wider">ISOLATED ENHANCEMENTS</span>
            <h4 className="text-lg font-bold text-white mt-0.5">
              {devices.filter(d => d.status === "DOWN").length} Nodes Offline
            </h4>
          </div>
        </div>
      </div>

      {/* Real-time Filter tools and search metrics */}
      <div className="bg-[#111420] border border-white/10 p-4 rounded-xl space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          {/* Search bar input */}
          <div className="flex-1 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input 
              id="node_search_input"
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by IP address, Device name, UUID, Type..."
              className="w-full bg-[#171b29] border border-white/5 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 rounded-lg outline-none focus:border-cyan-500/50 transition-colors font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Status Dropdowns Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase">Status:</span>
              <select 
                id="filter_status_select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#171b29] border border-white/10 text-[11px] font-mono text-slate-300 rounded px-2.5 py-1 outline-none focus:border-cyan-500/50"
              >
                <option value="ALL">ALL STATES</option>
                <option value="HEALTHY">HEALTHY</option>
                <option value="WARNING">WARNING</option>
                <option value="DOWN">DOWN</option>
                <option value="MAINTENANCE">MAINTENANCE</option>
              </select>
            </div>

            {/* Region Dropdowns Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase">Region:</span>
              <select 
                id="filter_region_select"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="bg-[#171b29] border border-white/10 text-[11px] font-mono text-slate-300 rounded px-2.5 py-1 outline-none focus:border-cyan-500/50"
              >
                <option value="ALL">ALL REGIONS</option>
                <option value="US Backbone">US Backbone</option>
                <option value="EMEA Edge">EMEA Edge</option>
                <option value="APAC Gateway">APAC Gateway</option>
                <option value="LATAM Gateway">LATAM Gateway</option>
                <option value="GLOBAL Core">GLOBAL Core</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Table frame (3 spans or full if selectedDevice empty) */}
        <div className={`lg:col-span-3 bg-[#111420] border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-all ${selectedDevice ? '' : 'lg:col-span-4'}`}>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="bg-[#141829] border-b border-white/15 text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">UUID / ID</th>
                  <th className="py-3.5 px-4 font-semibold">Label Name</th>
                  <th className="py-3.5 px-4 font-semibold">Host IP</th>
                  <th className="py-3.5 px-4 font-semibold">Type Flag</th>
                  <th className="py-3.5 px-4 font-semibold">Region</th>
                  <th className="py-3.5 px-4 font-semibold">Ping</th>
                  <th className="py-3.5 px-4 font-semibold">Uptime</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                {filteredDevices.map((device, index) => {
                  let statusColor = "bg-emerald-500 text-emerald-400";
                  let bgPill = "bg-emerald-500/10 border-emerald-500/20";
                  if (device.status === "WARNING") {
                    statusColor = "bg-amber-500 text-amber-400";
                    bgPill = "bg-amber-500/10 border-amber-500/20";
                  } else if (device.status === "DOWN") {
                    statusColor = "bg-red-500 text-red-400";
                    bgPill = "bg-red-500/10 border-red-500/20";
                  } else if (device.status === "MAINTENANCE") {
                    statusColor = "bg-sky-500 text-sky-400";
                    bgPill = "bg-sky-500/10 border-sky-500/20";
                  }

                  const isSelected = selectedDevice?.id === device.id;

                  return (
                    <tr 
                      key={device.id} 
                      onClick={() => setSelectedDevice(device)}
                      className={`hover:bg-cyan-500/[0.03] transition-colors cursor-pointer ${isSelected ? 'bg-cyan-950/20 border-l-2 border-l-cyan-500' : ''}`}
                    >
                      <td className="py-3.5 px-4 font-mono text-white tracking-widest text-[11px] whitespace-nowrap">{device.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200 whitespace-nowrap">{device.name}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">{device.ip}</td>
                      <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500 tracking-wider whitespace-nowrap uppercase">{device.type}</td>
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">{device.region}</td>
                      <td className="py-3.5 px-4 font-mono text-cyan-400 font-semibold whitespace-nowrap">{device.latency}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">{device.uptime}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 border rounded-full text-[10px] font-bold uppercase ${bgPill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusColor} ${device.status === "DOWN" ? "animate-ping" : ""}`} />
                          <span>{device.status}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filteredDevices.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500 font-mono text-xs">
                      No matching telemetric node devices found for target filter constraints.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected device audit details sidebar (1 span) */}
        {selectedDevice && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-[#111420] border border-white/10 rounded-xl p-5 relative space-y-5 text-left"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase font-mono tracking-wider">
                <Cpu className="text-cyan-400 w-4 h-4" />
                <span>Node Core Audit</span>
              </div>
              <button 
                onClick={() => setSelectedDevice(null)}
                className="text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs text-slate-300">
              <div className="pb-3 border-b border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500 tracking-wider block">ID SUITE</span>
                <span className="text-sm font-bold text-white tracking-widest">{selectedDevice.id}</span>
              </div>
              <div className="pb-3 border-b border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500 tracking-wider block">LABEL NAME</span>
                <span className="text-slate-200 font-sans leading-normal block font-semibold">{selectedDevice.name}</span>
              </div>
              <div className="pb-3 border-b border-white/5 space-y-2">
                <span className="text-[10px] text-slate-500 tracking-wider block">INTERFACE PROPERTIES</span>
                <div className="grid grid-cols-2 gap-2 text-[10px] bg-black/45 p-2 rounded border border-white/5">
                  <div>
                    <span className="text-slate-500">MTU:</span> <span className="text-slate-300">1518 bytes</span>
                  </div>
                  <div>
                    <span className="text-slate-500">DUPLEX:</span> <span className="text-slate-300">Full</span>
                  </div>
                  <div>
                    <span className="text-slate-500">TRANSCEIVE:</span> <span className="text-slate-300">Optical L1</span>
                  </div>
                  <div>
                    <span className="text-slate-500">SPEED:</span> <span className="text-slate-300">100 Gbps</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 tracking-wider block">SYSTEM MANAGEMENT ACTIONS</span>
                <div className="space-y-2 pt-1.5">
                  <button 
                    onClick={() => {
                      alert(`Initiated diagnostic self-test suite on router node ${selectedDevice.id}. Real latency response tracked below 1ms.`);
                    }}
                    className="w-full text-center text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 text-[10px] font-bold tracking-wider py-1.5 rounded uppercase hover:bg-cyan-950/40 cursor-pointer block"
                  >
                    TRIGGER SELF_TEST_DIAG
                  </button>
                  <button 
                    onClick={() => deleteDevice(selectedDevice.id)}
                    className="w-full text-center text-red-400 bg-red-950/10 border border-red-500/20 text-[10px] font-bold tracking-wider py-1.5 rounded uppercase hover:bg-red-950/30 cursor-pointer block"
                  >
                    REMOVE NODE PROTOCOL
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Dynamic Drawer Modal for Adding Device */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg bg-[#131722] border border-white/10 p-6 rounded-xl shadow-2xl relative text-left"
            >
              {/* Corner brackets */}
              <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-cyan-500" />
              <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t-2 border-r-2 border-cyan-500" />
              <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b-2 border-l-2 border-cyan-500" />
              <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-cyan-500" />

              <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2">
                  <Radio className="text-cyan-400 w-5 h-5 animate-pulse" />
                  <h3 className="text-sm font-bold tracking-widest text-white uppercase font-sans">Provision New Access Node</h3>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddDevice} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-2 gap-4">
                  {/* UUID */}
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest">Device Node ID</label>
                    <input 
                      id="form_node_id"
                      type="text" 
                      value={formId}
                      onChange={(e) => setFormId(e.target.value)}
                      className="w-full bg-[#1b1f2e] border border-white/10 text-white rounded p-2 focus:border-cyan-500 outline-none"
                      required
                    />
                  </div>
                  {/* Model type */}
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest">Router Type</label>
                    <select 
                      id="form_node_type"
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full bg-[#1b1f2e] border border-white/10 text-white rounded p-2 focus:border-cyan-500 outline-none"
                    >
                      <option value="EDGE_ROUTER">EDGE_ROUTER</option>
                      <option value="SPINE_SWITCH">SPINE_SWITCH</option>
                      <option value="LOAD_BALANCER">LOAD_BALANCER</option>
                      <option value="MITIGATION_FABRIC">MITIGATION_FABRIC</option>
                      <option value="FIREWALL">FIREWALL</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-widest">Node User Label</label>
                  <input 
                    id="form_node_name"
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#1b1f2e] border border-white/10 text-white rounded p-2 focus:border-cyan-500 outline-none"
                    placeholder="e.g. Spine Switch Core US-03"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* IP Address */}
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest">IPv4 Address allocation</label>
                    <input 
                      id="form_node_ip"
                      type="text" 
                      value={formIp}
                      onChange={(e) => setFormIp(e.target.value)}
                      className="w-full bg-[#1b1f2e] border border-white/10 text-white rounded p-2 focus:border-cyan-500 outline-none"
                      placeholder="e.g. 10.240.41.98"
                      required
                    />
                  </div>
                  {/* Region selection */}
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest">Physical Region</label>
                    <select 
                      id="form_node_region"
                      value={formRegion}
                      onChange={(e) => setFormRegion(e.target.value)}
                      className="w-full bg-[#1b1f2e] border border-white/10 text-white rounded p-2 focus:border-cyan-500 outline-none"
                    >
                      <option value="US Backbone">US Backbone</option>
                      <option value="EMEA Edge">EMEA Edge</option>
                      <option value="APAC Gateway">APAC Gateway</option>
                      <option value="LATAM Gateway">LATAM Gateway</option>
                      <option value="GLOBAL Core">GLOBAL Core</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Latency initial */}
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest">Initial Latency index</label>
                    <input 
                      id="form_node_latency"
                      type="text" 
                      value={formLatency}
                      onChange={(e) => setFormLatency(e.target.value)}
                      className="w-full bg-[#1b1f2e] border border-white/10 text-white rounded p-2 focus:border-cyan-500 outline-none"
                      placeholder="e.g. 15ms"
                      required
                    />
                  </div>
                  {/* Initial Status dropdown */}
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest">Lifecycle Status</label>
                    <select 
                      id="form_node_status"
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as DeviceStatus)}
                      className="w-full bg-[#1b1f2e] border border-white/10 text-white rounded p-2 focus:border-cyan-500 outline-none"
                    >
                      <option value="HEALTHY">HEALTHY</option>
                      <option value="WARNING">WARNING</option>
                      <option value="DOWN">DOWN</option>
                      <option value="MAINTENANCE">MAINTENANCE</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-end gap-3 font-sans">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    id="submit_node_btn"
                    type="submit" 
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white text-xs font-semibold rounded hover:from-cyan-500 hover:to-cyan-400 transition-all cursor-pointer glow-cyan font-mono tracking-wider text-center"
                  >
                    DEPLOY NODE
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
