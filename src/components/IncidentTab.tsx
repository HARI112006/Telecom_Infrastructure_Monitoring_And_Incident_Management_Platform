import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldAlert, 
  Clock, 
  Terminal, 
  Compass, 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  Send, 
  Search, 
  Activity, 
  Flame, 
  ActivitySquare 
} from "lucide-react";
import { Incident, Device } from "../types";

interface IncidentTabProps {
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
  devices: Device[];
}

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export const IncidentTab: React.FC<IncidentTabProps> = ({ 
  incidents, 
  setIncidents, 
  devices 
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [operatorMsg, setOperatorMsg] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiEngineSource, setAiEngineSource] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Set initial selected incident
  useEffect(() => {
    if (incidents.length > 0 && !selectedIncident) {
      setSelectedIncident(incidents[0]);
    }
  }, [incidents]);

  // Sync initial advisory summary on incident selection
  useEffect(() => {
    if (selectedIncident) {
      setChatMessages([
        {
          role: "model",
          content: `### [AETHER AI INTEL] DIAGNOSTIC CHANNEL INITIALIZED\n\nActive incident logged: **${selectedIncident.id} (${selectedIncident.title})**.\n\n* **Primary Vulnerability:** ${selectedIncident.impact}\n* **Root Cause Guess:** ${selectedIncident.aiRca}\n\nAsk me specific telemetric actions, routing queries, or request instant automated repair scripts for this node context.`
        }
      ]);
    }
  }, [selectedIncident]);

  // Auto scroll chat console
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, aiLoading]);

  // Handle cognitive chat submit with backend server router
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorMsg.trim() || !selectedIncident) return;

    const userText = operatorMsg.trim();
    setOperatorMsg("");
    
    // Append User Message
    const updatedMessages = [...chatMessages, { role: "user" as const, content: userText }];
    setChatMessages(updatedMessages);
    setAiLoading(true);

    try {
      const response = await fetch("/api/gemini/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Pass context history and nodes context
        body: JSON.stringify({
          message: userText,
          history: updatedMessages,
          incidentDetails: selectedIncident,
          contextNodes: devices.slice(0, 5) // Use a subset of nodes as telemetry context
        })
      });

      const data = await response.json();
      if (data.success) {
        setAiEngineSource(data.source || "Gemini Core");
        setChatMessages(prev => [
          ...prev, 
          { role: "model", content: data.diagnostics }
        ]);
      } else {
        throw new Error(data.error || "Unknown diagnostic error occurred.");
      }
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        { role: "model", content: `❌ **[CRITICAL SYSTEM FAULT]** Could not communicate with level-3 diagnostic routing. Details: ${err.message}` }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // Automated triage mitigation action simulator
  const executeMitigation = (incId: string) => {
    setLogsState(incId);
    alert(`DISPATCHED MITIGATION PROTOCOLS:\nApplying AS-PATH filter profile across BGP borders.\nTarget incident ${incId} status changed to RESOLVED in backup tables.`);
  };

  const setLogsState = (incId: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incId) {
        return {
          ...inc,
          duration: "Resolved with AI",
          timeline: [
            ...inc.timeline,
            { title: "Mitigation Filter Implemented", time: new Date().toLocaleTimeString(), status: "completed" as const }
          ]
        };
      }
      return inc;
    }));
    if (selectedIncident?.id === incId) {
      setSelectedIncident(prev => prev ? {
        ...prev,
        duration: "Resolved with AI",
        timeline: [
          ...prev.timeline,
          { title: "Mitigation Filter Implemented", time: new Date().toLocaleTimeString(), status: "completed" as const }
        ]
      } : null);
    }
  };

  // Precise Markdown Line Parser for visual rendering of bullets and code blocks inside UI
  const parseMarkdownLines = (text: string) => {
    const lines = text.split("\n");
    let inCodeBlock = false;
    let codeContent: string[] = [];
    const elements: React.ReactNode[] = [];

    lines.forEach((line, lineIdx) => {
      // Check for code blocks
      if (line.trim().startsWith("```")) {
        if (inCodeBlock) {
          // Close block
          elements.push(
            <pre key={`code-${lineIdx}`} className="bg-black/60 border border-white/5 rounded-lg p-3 my-2 font-mono text-[11px] text-cyan-300 overflow-x-auto text-left leading-relaxed">
              <code>{codeContent.join("\n")}</code>
            </pre>
          );
          codeContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Check for bullet lists
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        const cleaned = line.replace(/^[\s*-]+/, "").trim();
        elements.push(
          <li key={`li-${lineIdx}`} className="ml-5 list-disc text-xs text-slate-300 leading-relaxed my-1 font-sans text-left">
            {cleaned.split("**").map((part, pIdx) => (pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-semibold">{part}</strong> : part))}
          </li>
        );
        return;
      }

      // Check for Header-3 markdown
      if (line.trim().startsWith("### ")) {
        const cleaned = line.replace(/^###\s+/, "").trim();
        elements.push(
          <h4 key={`h4-${lineIdx}`} className="text-xs font-bold font-mono tracking-widest text-cyan-400 uppercase mt-4 mb-2 text-left">
            {cleaned}
          </h4>
        );
        return;
      }

      // Standard paragraphs line rendering with dual-asterisks bolding checks
      if (line.trim()) {
        const chunks = line.split("**");
        const parsedParagraph = chunks.map((part, pIdx) => {
          if (pIdx % 2 === 1) {
            return <strong key={pIdx} className="text-white font-semibold">{part}</strong>;
          }
          return part;
        });

        elements.push(
          <p key={`p-${lineIdx}`} className="text-xs text-slate-300 leading-normal my-1.5 text-left font-sans">
            {parsedParagraph}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div id="incidents_tab" className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left items-start">
      
      {/* Sidebar Alerts list (1 span) */}
      <div className="lg:col-span-1 bg-[#111420] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between h-[650px]">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase font-mono tracking-wider">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>Active Triage Feed</span>
          </div>
          <span className="bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded">
            {incidents.filter(i => i.duration === "Ongoing").length} OPEN
          </span>
        </div>

        {/* Live list block */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2 text-left">
          {incidents.map((inc) => {
            const isSelected = selectedIncident?.id === inc.id;
            let severityStyle = "border-red-500/30 text-red-400 bg-red-500/10";
            if (inc.severity === "HIGH") severityStyle = "border-amber-500/30 text-amber-400 bg-amber-500/5";
            if (inc.severity === "MEDIUM") severityStyle = "border-sky-500/30 text-sky-400 bg-sky-500/5";

            const isResolved = inc.duration !== "Ongoing";

            return (
              <button
                id={`inc_card_${inc.id.toLowerCase()}`}
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`w-full p-3 rounded-lg border text-left cursor-pointer transition-all uppercase font-sans ${
                  isSelected 
                    ? "bg-cyan-950/20 border-cyan-500/50 text-white shadow-md shadow-cyan-950/20" 
                    : "bg-transparent border-white/5 text-slate-400 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center justify-between gap-2 overflow-hidden">
                  <span className="font-mono text-[10px] text-slate-500 tracking-widest">{inc.id}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${isResolved ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : severityStyle}`}>
                    {isResolved ? "RESOLVED" : inc.severity}
                  </span>
                </div>
                
                <h4 className={`text-xs font-semibold mt-2.5 line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {inc.title}
                </h4>

                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-2 font-mono">
                  <Clock className="w-3 h-3 text-slate-600" />
                  <span>{inc.timeAgo}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Audit guide footer */}
        <div className="p-3 bg-black/35 border-t border-white/10 text-[9px] font-mono text-slate-500 leading-normal uppercase">
          * Incidents under active audit capture real-time satellite coordination telemetry.
        </div>
      </div>

      {/* Main bento split: Triage characteristics and AI copilot (3 spans) */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Incident Characteristics Audit Column (Left) */}
        {selectedIncident ? (
          <div className="bg-[#111420] border border-white/10 rounded-xl p-5 flex flex-col justify-between h-[650px] overflow-y-auto custom-scrollbar">
            <div className="space-y-5 text-left">
              <div className="flex justify-between items-start pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] text-slate-500 font-mono tracking-widest block uppercase">{selectedIncident.id}</span>
                  <h3 className="text-md font-bold text-white uppercase mt-1">{selectedIncident.title}</h3>
                </div>
                <div className="text-right font-mono">
                  <span className="text-[9px] text-slate-500 block">ELAPSED TIMER</span>
                  <span className="text-xs font-bold text-white text-red-400 animate-pulse">{selectedIncident.elapsedTime}</span>
                </div>
              </div>

              {/* Static descriptive block */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 font-mono tracking-wide uppercase block">RAW ANOMALY TELEMETRY</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-black/45 p-3.5 rounded border border-white/5 font-mono">
                  {selectedIncident.description}
                </p>
              </div>

              {/* Grid Metadata details */}
              <div className="grid grid-cols-2 gap-3.5 font-mono text-xs">
                <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-lg text-left">
                  <span className="text-[9px] text-slate-500 uppercase">Start Time</span>
                  <span className="text-white font-medium block mt-1">{selectedIncident.startTime}</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-lg text-left">
                  <span className="text-[9px] text-slate-500 uppercase">Impact Metric</span>
                  <span className="text-white font-medium block mt-1 leading-normal text-[11px]">{selectedIncident.impact}</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-lg text-left">
                  <span className="text-[9px] text-slate-500 uppercase">Active Assignee</span>
                  <span className="text-white font-medium block mt-1">{selectedIncident.operator}</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 p-2.5 rounded-lg text-left">
                  <span className="text-[9px] text-slate-500 uppercase">Confidence Ratio</span>
                  <span className="text-cyan-400 font-bold block mt-1">{selectedIncident.confidence}% matching</span>
                </div>
              </div>

              {/* Incident propagation Pipeline Timeline */}
              <div className="space-y-3.5 pt-2">
                <span className="text-[10px] text-slate-500 font-mono tracking-wide block">PROPAGATION TRACE PIPELINE</span>
                <div className="space-y-3 pl-2 border-l border-white/10 relative">
                  {selectedIncident.timeline.map((stg, sIdx) => {
                    let dotColor = "bg-emerald-500 shadow-emerald-500/20";
                    let textColor = "text-slate-300";
                    if (stg.status === 'active') {
                      dotColor = "bg-cyan-400 animate-ping shadow-cyan-400/30";
                      textColor = "text-cyan-400 font-semibold";
                    } else if (stg.status === 'pending') {
                      dotColor = "bg-slate-700";
                      textColor = "text-slate-500";
                    }

                    return (
                      <div key={sIdx} className="relative pl-5 text-left group">
                        {/* Dot Anchor */}
                        <span className={`absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full ring-4 ring-[#111420] ${dotColor}`} />
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className={textColor}>{stg.title}</span>
                          <span className="text-[10px] text-slate-500">{stg.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Segment dangers lists */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Segment Failure Predict Index</span>
                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>US CORE-D TRANS_SLICES</span>
                      <span className="text-red-400 font-bold">95.4% EXTREME</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                      <div className="h-full bg-red-400 w-[95%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>GLOBAL BACKBONE RING</span>
                      <span className="text-amber-400">22% WARNING</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                      <div className="h-full bg-amber-400 w-[22%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tactical Mitigation trigger */}
            {selectedIncident.duration === "Ongoing" && (
              <div className="border-t border-white/10 pt-4 mt-6">
                <button
                  id={`mitigate_btn_${selectedIncident.id.toLowerCase()}`}
                  onClick={() => executeMitigation(selectedIncident.id)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-mono text-xs font-bold tracking-wider py-3 rounded-md uppercase cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Execute Tactical Auto-Bypass</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#111420] border border-white/10 rounded-xl p-12 text-center text-slate-500 font-mono text-xs flex items-center justify-center h-[650px]">
            No active incident loaded for audit.
          </div>
        )}

        {/* AI Copilot Cognitive diagnostic Chat terminal (Right Column) */}
        <div id="ai_copilot_frame" className="bg-[#111420] border border-white/10 rounded-xl flex flex-col justify-between h-[650px] overflow-hidden">
          {/* Header */}
          <div className="bg-[#141828] px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="text-cyan-400 w-4.5 h-4.5 animate-pulse" />
              <h3 className="text-xs font-bold font-mono tracking-wider text-white uppercase">Aether AI Diagnostic Copilot</h3>
            </div>
            {aiEngineSource && (
              <span className="text-[10px] font-mono text-cyan-400 animate-pulse-glow">
                {aiEngineSource}
              </span>
            )}
          </div>

          {/* Chat scrolling feed view */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 bg-[#0a0c13]">
            {chatMessages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <div 
                  key={index}
                  className={`flex gap-3 text-left ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 font-mono text-xs font-semibold select-none mt-1">
                      A
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed font-mono ${
                    isUser 
                      ? "bg-cyan-950/25 border border-cyan-500/15 text-slate-200" 
                      : "bg-[#141825]/90 border border-white/5 text-slate-300"
                  }`}>
                    {parseMarkdownLines(msg.content)}
                  </div>
                </div>
              );
            })}

            {/* AI waiting loader skeleton */}
            {aiLoading && (
              <div className="flex gap-3 text-left justify-start">
                <div className="w-7 h-7 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 animate-ping" />
                <div className="bg-[#141825]/90 border border-white/5 rounded-lg p-3 text-xs text-cyan-400 font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-200" />
                  <span className="font-semibold text-[11px] uppercase tracking-wide">Syncing satellite telemetry RCA...</span>
                </div>
              </div>
            )}
            
            <div ref={chatBottomRef} />
          </div>

          {/* Interactive Form Dispatch Prompt */}
          <form onSubmit={handleSendMessage} className="bg-[#0b0c13] border-t border-white/10 p-3 flex gap-2">
            <input 
              id="ai_chat_input"
              type="text" 
              value={operatorMsg}
              onChange={(e) => setOperatorMsg(e.target.value)}
              placeholder="Ask AI Copilot for prefix-drain codes, audit AS-PATH configs..."
              className="flex-1 bg-[#151926] border border-white/5 p-2.5 text-xs text-white placeholder-slate-600 rounded-md outline-none focus:border-cyan-500/50 transition-colors font-mono"
              required
            />
            <button 
              id="send_msg_submit"
              type="submit" 
              disabled={aiLoading}
              className="px-3.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
