import { Device, Incident, LogEntry } from "./types";

export const INITIAL_DEVICES: Device[] = [
  { id: "NOC-RT-402-A", name: "Aether Edge Core RT01", ip: "10.240.41.1", region: "EMEA Edge", latency: "14ms", uptime: "99.98%", status: "HEALTHY", type: "EDGE_ROUTER" },
  { id: "NOC-RT-402-B", name: "Aether Edge Core RT02", ip: "10.240.41.2", region: "EMEA Edge", latency: "18ms", uptime: "99.95%", status: "HEALTHY", type: "EDGE_ROUTER" },
  { id: "NOC-SW-101-C", name: "Spine Fabric SW01", ip: "172.16.8.10", region: "US Backbone", latency: "42ms", uptime: "99.90%", status: "WARNING", type: "SPINE_SWITCH" },
  { id: "NOC-SW-101-D", name: "Spine Fabric SW02", ip: "172.16.8.11", region: "US Backbone", latency: "250ms", uptime: "91.43%", status: "DOWN", type: "SPINE_SWITCH" },
  { id: "NOC-LB-880-F", name: "Global Ingress LB01", ip: "192.168.12.1", region: "APAC Gateway", latency: "28ms", uptime: "99.99%", status: "HEALTHY", type: "LOAD_BALANCER" },
  { id: "NOC-LB-880-G", name: "Global Ingress LB02", ip: "192.168.12.2", region: "APAC Gateway", latency: "165ms", uptime: "98.11%", status: "WARNING", type: "LOAD_BALANCER" },
  { id: "NOC-VM-901-H", name: "DDoS mitigation cluster 1", ip: "172.24.1.15", region: "GLOBAL Core", latency: "8ms", uptime: "99.99%", status: "HEALTHY", type: "MITIGATION_FABRIC" },
  { id: "NOC-VM-901-I", name: "DDoS mitigation cluster 2", ip: "172.24.1.16", region: "GLOBAL Core", latency: "11ms", uptime: "100.0%", status: "HEALTHY", type: "MITIGATION_FABRIC" },
  { id: "NOC-AP-004-K", name: "Wireless Access PT04", ip: "10.150.2.1", region: "LATAM Gateway", latency: "82ms", uptime: "97.45%", status: "MAINTENANCE", type: "EDGE_AP" },
  { id: "NOC-RT-112-L", name: "Aether Edge Core RT03", ip: "10.240.41.3", region: "LATAM Gateway", latency: "95ms", uptime: "99.85%", status: "HEALTHY", type: "EDGE_ROUTER" },
  { id: "NOC-FW-301-O", name: "Border Firewall FW01", ip: "192.168.1.254", region: "US Backbone", latency: "5ms", uptime: "99.99%", status: "HEALTHY", type: "FIREWALL" },
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "INC-8829-X",
    title: "BGP Route Leak Detected",
    severity: "CRITICAL",
    timeAgo: "4m ago",
    description: "Multi-layered prefix announcement anomaly routing critical financial segments through unauthenticated AS path peers. Packet loss spiking on EMEA backbone-02.",
    operator: "Operator: SYSTEM_BOT_3",
    elapsedTime: "00:04:12",
    startTime: "2026-05-25 06:18:29 UTC",
    duration: "Ongoing",
    impact: "Total disruption to 14.5% of transatlantic transit tunnels",
    aiRca: "Likely anomalous route leaked from AS-9003 neighbor path. Latency spike and loss rate indicate buffer congestion on neighboring nodes. Threat vectors suggest targeted prefix manipulation check.",
    timeline: [
      { title: "BGP Prefix Hijack Detected", time: "06:18:29", status: "completed" },
      { title: "Transatlantic Path Slices Spiked to 250ms", time: "06:19:10", status: "completed" },
      { title: "Auto-Containment Script Invoked", time: "06:20:45", status: "completed" },
      { title: "AI Root Cause Inference Request", time: "06:21:05", status: "active" },
      { title: "Manual Route Reflector Purge", time: "Pending", status: "pending" },
    ],
    confidence: 94,
  },
  {
    id: "INC-8744-Y",
    title: "DDoS Amplification Target",
    severity: "HIGH",
    timeAgo: "42m ago",
    description: "Sustained DNS Amplification attack flooding Gateway-AP-02 cluster. Peak ingressing UDP traffic exceed 450Gbps. Target VIP: 104.22.41.88.",
    operator: "Operator: J. CARTER (Level 2)",
    elapsedTime: "00:42:35",
    startTime: "2026-05-25 05:40:02 UTC",
    duration: "Ongoing",
    impact: "Saturated latencies in APAC, minor packet dropouts globally",
    aiRca: "Amplified reflection leveraging open resolving recursive DNS hosts. IP source spoof detected. Flow filter mitigation active.",
    timeline: [
      { title: "UDP Threshold Alarm Triggered", time: "05:40:02", status: "completed" },
      { title: "Mitigation Fabric Rate Limiting Enabled", time: "05:42:15", status: "completed" },
      { title: "Traffic Filter Profile Pushed", time: "05:45:00", status: "completed" },
      { title: "Remediation Validation Check", time: "05:55:00", status: "active" }
    ],
    confidence: 81,
  },
  {
    id: "INC-8110-Z",
    title: "Fiber Degradation Alarm",
    severity: "MEDIUM",
    timeAgo: "2.4h ago",
    description: "Optical transceiver loss of light (LOL) on US Core Trunk 09. Signal-to-noise ratio decreased from 28dB to 14.2dB.",
    operator: "Operator: K. PATEL (Level 1)",
    elapsedTime: "02:24:16",
    startTime: "2026-05-25 03:58:12 UTC",
    duration: "Ongoing",
    impact: "None - traffic redirected to passive fiber leg",
    aiRca: "Physical strain or aging transceivers on transceiver interface Eth-2/1/10. Fiber bend or optic coupling dust suspected.",
    timeline: [
      { title: "Physical Layer Low SNR Warning", time: "03:58:12", status: "completed" },
      { title: "Automated Resiliency Protection Switch", time: "03:58:45", status: "completed" },
      { title: "Fibre Integrity Dispatch Scheduled", time: "04:30:00", status: "completed" }
    ],
    confidence: 98,
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  { timestamp: "06:22:15", level: "INFO", message: "BGP Session established: Peer AS-20412 (US_Core_Spine)" },
  { timestamp: "06:22:18", level: "INFO", message: "Mitigation Engine reporting normal bounds for APAC-VLAN-15" },
  { timestamp: "06:22:25", level: "WARN", message: "Latency check NOC-SW-101-C: Latency spiked above warn threshold (42ms)" },
  { timestamp: "06:22:34", level: "INFO", message: "Health check scheduled on 14 access nodes in LATAM Gateway" },
  { timestamp: "06:22:42", level: "ERROR", message: "BGP Prefix announcement anomaly on prefix: 184.22.100.0/22" },
  { timestamp: "06:22:50", level: "ERROR", message: "Node NOC-SW-101-D heartbeat timeout. System reporting DOWN." },
  { timestamp: "06:23:01", level: "INFO", message: "Initiating live routing bypass for transit tunnels NOC-SW-101-D" },
  { timestamp: "06:23:12", level: "INFO", message: "Local security sandbox successfully parsed system capabilities." },
];
