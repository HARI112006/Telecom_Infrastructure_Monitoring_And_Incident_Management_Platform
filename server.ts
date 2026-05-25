import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily if key is available
let genai: GoogleGenAI | null = null;
const getGenAI = (): GoogleGenAI | null => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genai) {
    genai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genai;
};

// API Endpoint for AI Diagnostics (Root Cause Analysis + Operational Chat)
app.post("/api/gemini/diagnose", async (req, res) => {
  try {
    const { message, history, incidentDetails, contextNodes } = req.body;
    
    const client = getGenAI();
    
    // System instruction to prime the model as an high-tech NetOps cyber security and telecommunication specialist
    const systemInstruction = `You are "AETHER-NOC CO-PILOT", an expert Level-3 Network Operations Command cybersecurity & telecom engineer.
You help operators evaluate network anomalies, interpret raw telemetry data, analyze incident propagation, and propose targeted tactical fixes.
Your tone is highly technical, concise, cooperative, and direct. Avoid generic, fluffy definitions. Use specific terminologies (e.g., BGP flapping, optical link degradation, SYN flood, MTU mismatch, bufferbloat).
If you propose commands, format them clearly as shell/config code blocks.
When discussing the current active incident, ground your evaluation in the details supplied.`;

    const modelToUse = "gemini-3.5-flash";

    let reply = "";

    if (client) {
      // Build proper prompts or utilize Chat API
      const chatHistory = history ? history.map((h: { role: string; content: string }) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      })) : [];

      // Supplement history with context prompt on the first turn
      const incidentCtx = incidentDetails ? `[CURRENT ACTIVE INCIDENT]
ID: ${incidentDetails.id}
Title: ${incidentDetails.title}
Severity: ${incidentDetails.severity}
Impact: ${incidentDetails.impact}
Raw logs: ${incidentDetails.description}
Timeline state: ${JSON.stringify(incidentDetails.timeline)}
` : '';

      const nodeCtx = contextNodes ? `[TELEMETRY INVENTORY CONTEXT]
Active Nodes under observation:
${contextNodes.map((n: any) => `- Device ID: ${n.id}, Type: ${n.type}, Region: ${n.region}, Status: ${n.status}, Latency: ${n.latency}`).join("\n")}
` : '';

      const userText = `${incidentCtx}\n${nodeCtx}\n\n[Operator Directive]: ${message || "Perform comprehensive analytical triage on this incident and suggest instant recovery codes."}`;

      if (chatHistory.length === 0) {
        // Single text generation
        const response = await client.models.generateContent({
          model: modelToUse,
          contents: userText,
          config: {
            systemInstruction
          }
        });
        reply = response.text || "No diagnostics yielded by primary network engine.";
      } else {
        // Inject or append to active chat stream session
        const chat = client.chats.create({
          model: modelToUse,
          config: { systemInstruction },
          history: chatHistory
        });
        
        const response = await chat.sendMessage({
          message: userText
        });
        reply = response.text || "No reply produced.";
      }

      res.json({
        success: true,
        source: "Gemini AI Live Engine",
        diagnostics: reply
      });
    } else {
      // Mock / fallback response if GEMINI_API_KEY is not configured
      const fallbackReplies = [
        `### [OFFLINE RECON CONSOLE] LOCAL CORE TELEMETRY PARSER\n\n**Incident Evaluation:** ID ${incidentDetails?.id || "INC-X"}\n* **Root Cause Assessment:** BGP routes flapping across EMEA infrastructure Edge segment due to a localized subsea fiber shear check failure.\n* **Telemetry Packet Correlation:** Packet loss is spike-aligned with high peak load ratios in the Core-Slices.\n* **Tactical Remediation Plan:**\n  1. Withdraw damaged Route-Reflectors selectively:\n     \`\`\`bash\n     netops-control peer emea-core-01 down --drain=15s\n     \`\`\`\n  2. Re-route high priority telemetric slices through the Western Hemisphere backup link.\n\n*Note: Setup the **GEMINI_API_KEY** secret in Settings > Secrets to activate real-time cognitive AI root-cause synthesis!*`
      ];

      res.json({
        success: true,
        source: "Local Fallback Engine (No API Key)",
        diagnostics: fallbackReplies[0],
        warning: "Secure Local Sandbox Engine is running. Setup GEMINI_API_KEY in Settings > Secrets to activate real-time Gemini analysis."
      });
    }
  } catch (error: any) {
    console.error("Gemini diagnostics router error:", error);
    res.status(500).json({ error: error.message || "Internal failure in NetOps AI core router." });
  }
});

// Configure Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AETHER NOC] Live console accessible on port ${PORT}`);
  });
}

startServer();
