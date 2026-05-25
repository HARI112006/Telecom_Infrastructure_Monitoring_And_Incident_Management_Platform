export type DeviceStatus = 'HEALTHY' | 'WARNING' | 'DOWN' | 'MAINTENANCE';

export interface Device {
  id: string; // e.g. NOC-RT-402-A
  name: string;
  ip: string;
  region: string;
  latency: string;
  uptime: string;
  status: DeviceStatus;
  type: string; // e.g. CORE_FABRIC_L1, EDGE_ROUTER, etc.
}

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM';

export interface Incident {
  id: string; // e.g. INC-8829-X
  title: string;
  severity: Severity;
  timeAgo: string;
  description: string;
  operator: string;
  elapsedTime: string;
  startTime: string;
  duration: string;
  impact: string;
  aiRca: string;
  timeline: { title: string; time: string; status: 'completed' | 'active' | 'pending' }[];
  confidence: number;
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
}

export interface Stats {
  totalDevices: number;
  onlineNodes: number;
  activeAlerts: number;
  throughput: string;
}
