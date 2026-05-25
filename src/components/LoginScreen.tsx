import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Shield, Key, Eye, EyeOff, Radio, AlertTriangle, Terminal } from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: (operatorId: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [badgeId, setBadgeId] = useState("OP-7734");
  const [accessKey, setAccessKey] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matrixText, setMatrixText] = useState("");
  const [isError, setIsError] = useState(false);

  // Generate real-time random operational matrix strings
  useEffect(() => {
    const chars = "ABCDEF0123456789XΩΨΦΞ_";
    const interval = setInterval(() => {
      let str = "";
      for (let i = 0; i < 4; i++) {
        str += Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("") + "  ";
      }
      setMatrixText(str);
    }, 180);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeId.trim()) {
      setIsError(true);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess(badgeId);
    }, 1200);
  };

  return (
    <div id="login_container" className="relative min-h-screen w-full flex items-center justify-center bg-[#07090e] overflow-hidden network-grid px-4">
      <div className="scanline" />
      
      {/* Decorative absolute components */}
      <div className="absolute top-10 left-10 hidden md:flex flex-col gap-1 font-mono text-[10px] text-cyan-500/50">
        <div>SYS_RECON: ACTIVE</div>
        <div>MATRIX_FLOW: {matrixText}</div>
        <div>GATEWAY_IP: 10.240.40.1</div>
      </div>
      <div className="absolute top-10 right-10 hidden md:flex flex-col items-end gap-1 font-mono text-[10px] text-red-400/50">
        <div>CO-PILOT_LINK: CONNECTED</div>
        <div>ENCRYPTION: SHIELD_AES_256</div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-[#131720]/90 border border-white/10 p-8 rounded-xl shadow-2xl relative"
      >
        {/* Futuristic glowing corners */}
        <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-cyan-500" />
        <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-cyan-500" />
        <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-cyan-500" />
        <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-cyan-500" />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-lg bg-cyan-500/10 text-cyan-400 mb-3 border border-cyan-500/20 glow-cyan">
            <Radio className="w-8 h-8 animate-pulse" />
          </div>
          <h1 className="text-xl font-bold tracking-widest text-white uppercase font-sans">Aether NetOps</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-mono">Operations &amp; Diagnostics Portal</p>
        </div>

        {/* Security Alert Panel */}
        <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-md p-3 flex gap-3 text-left">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] text-amber-300 leading-relaxed font-mono">
            <span>SECURE SYSTEM CONNECTION REQUIREMENT. UNSOLICITED ACCESS AUDITS PROHIBITED. ALL DISCRIMINATIVE ACTIONS SATELLITE LOGGED.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Badge ID Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-400">Operator Badge ID</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 flex items-center">
                <Shield className="w-4 h-4" />
              </span>
              <input 
                id="badge_input"
                type="text" 
                value={badgeId}
                onChange={(e) => { setBadgeId(e.target.value); setIsError(false); }}
                className="w-full bg-[#1b202e] border border-white/10 rounded-md py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
                placeholder="OP-XXXX"
                required
              />
            </div>
          </div>

          {/* Access Key Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-400">Security Encryption Key</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 flex items-center">
                <Key className="w-4 h-4" />
              </span>
              <input 
                id="key_input"
                type={showPassword ? "text" : "password"} 
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full bg-[#1b202e] border border-white/10 rounded-md py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all font-mono"
                placeholder="••••••••••••"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isError && (
            <div className="text-[12px] text-red-400 font-mono">
              * Verification failed: Badge ID cannot be empty.
            </div>
          )}

          {/* Submit Action */}
          <button 
            id="login_submit"
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-md py-3 text-sm font-semibold tracking-wider uppercase font-mono shadow-lg shadow-cyan-500/10 cursor-pointer disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 00 12 5.373 12 12H4z" />
                </svg>
                <span>Validating Signature...</span>
              </>
            ) : (
              <>
                <Terminal className="w-4 h-4" />
                <span>Establish Secure CommLink</span>
              </>
            )}
          </button>
        </form>

        {/* Bottom micro-info */}
        <div className="mt-8 pt-4 border-t border-white/5 flex justify-between text-[10px] text-slate-500 font-mono">
          <span>PORT: 3000 / TUNNEL_STABLE</span>
          <span>v2.85-RELEASE</span>
        </div>
      </motion.div>
    </div>
  );
};
