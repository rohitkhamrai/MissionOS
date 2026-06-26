"use client";

import { useState, useCallback, useEffect } from "react";
import MissionForm from "@/components/MissionForm";
import FailureAnalysis from "@/components/FailureAnalysis";
import StrategyCards from "@/components/StrategyCards";
import MilestoneTimeline from "@/components/MilestoneTimeline";
import AgentActivity from "@/components/AgentActivity";
import AgentLoop from "@/components/AgentLoop";
import DriftMonitor from "@/components/DriftMonitor";
import { analyzeMission } from "@/lib/gemini";
import type { MissionAnalysis, RenegotiationInput } from "@/types/mission";
import { simulateLatency, getMockRenegotiation } from "@/lib/mock";

interface DriftEvent {
  title: string;
  expectedDay: number;
  actualDay: number;
  delay: number;
  previousProb: number;
  newProb: number;
}

export default function Home() {
  const [result, setResult] = useState<MissionAnalysis | null>(null);
  const [isRenegotiating, setIsRenegotiating] = useState(false);
  const [activityLog, setActivityLog] = useState<{ id: number, text: string, type: 'success' | 'warning' | 'error' }[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [lastDriftEvent, setLastDriftEvent] = useState<DriftEvent | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    let mounted = true;
    try {
      const saved = localStorage.getItem("missionState");
      if (saved && mounted) {
        const parsed = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (parsed.result) setResult(parsed.result);
        if (parsed.activityLog) setActivityLog(parsed.activityLog);
        if (parsed.isDemoMode !== undefined) setIsDemoMode(parsed.isDemoMode);
      }
    } catch (e) {
      console.warn("Failed to load mission state", e);
    } finally {
      setIsLoaded(true);
    }
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("missionState", JSON.stringify({ result, activityLog, isDemoMode }));
      } catch (e) {
        console.warn("Failed to save mission state", e);
      }
    }
  }, [result, activityLog, isLoaded, isDemoMode]);

  const addLog = useCallback((text: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setActivityLog(prev => [...prev, { id: Date.now() + Math.random(), text, type }]);
  }, []);

  const handleAnalyze = useCallback((data: MissionAnalysis) => {
    setResult(data);
  }, []);

  const handleClear = useCallback(() => {
    setResult(null);
    setActivityLog([]);
    localStorage.removeItem("missionState");
  }, []);

  const handleDrift = useCallback(async (event: DriftEvent) => {
    setIsRenegotiating(true);
    addLog(`Schedule drift detected: ${event.title} (${event.delay} days)`, "warning");

    try {
      let newMission: MissionAnalysis;
      
      if (isDemoMode) {
        addLog("Initiating simulated mission renegotiation...", "warning");
        const mockRenegotiate = getMockRenegotiation(result?.evidence_reviewed?.join(" "));
        newMission = await simulateLatency(mockRenegotiate, 800, 1500);
      } else {
        addLog("Initiating mission renegotiation...", "warning");
        const renegotiationInput: RenegotiationInput = {
          originalMission: result!,
          delayedMilestone: event.title,
          expectedDay: event.expectedDay,
          actualDay: event.actualDay
        };
        newMission = await analyzeMission(renegotiationInput);
      }
      
      setResult(newMission);
      
      const prevProb = result?.strategies.find(s => s.id === result.recommended)?.success ?? 0;
      const newProb = newMission.strategies.find(s => s.id === newMission.recommended)?.success ?? 0;
      
      setLastDriftEvent({
        ...event,
        previousProb: prevProb,
        newProb: newProb
      });
      setTimeout(() => setLastDriftEvent(null), 8000);
      
      if (newMission.feasible === false && newMission.strategies.length === 0) {
        addLog("Critical failure: No feasible recovery exists", "error");
      } else {
        addLog("Mission renegotiated successfully based on new constraints", "success");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "System error";
      console.error("Renegotiation failed:", error);
      addLog(`Renegotiation failed: ${errorMessage}`, "error");
    } finally {
      setIsRenegotiating(false);
    }
  }, [result, addLog, isDemoMode]);

  const renderStatus = () => {
    if (isRenegotiating) {
      return (
        <div className="bg-blue-900/20 border border-blue-500/50 p-6 rounded text-center transition-all duration-500">
          <h2 className="text-xl md:text-2xl font-bold text-blue-400 uppercase tracking-[0.2em] animate-pulse">
            [ REPLANNING ]
          </h2>
          <p className="text-blue-300/80 mt-2 text-xs md:text-sm uppercase tracking-widest">Recalculating Mission Trajectory...</p>
        </div>
      );
    }
    
    if (result?.feasible === false && result?.strategies.length === 0) {
      return (
        <div className="bg-red-900/20 border border-red-500/50 p-6 rounded text-center transition-all duration-500">
          <h2 className="text-xl md:text-2xl font-bold text-red-500 uppercase tracking-[0.2em]">
            [ MISSION FAILED ]
          </h2>
          <p className="text-red-400/80 mt-2 text-xs md:text-sm uppercase tracking-widest">No feasible recovery exists under current constraints</p>
        </div>
      );
    }

    if (result?.feasible) {
      return (
        <div className="bg-green-900/20 border border-green-500/50 p-6 rounded text-center transition-all duration-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
          <h2 className="text-xl md:text-2xl font-bold text-green-400 uppercase tracking-[0.2em]">
            [ FEASIBLE ]
          </h2>
          <p className="text-green-400/80 mt-2 text-xs md:text-sm uppercase tracking-widest">Mission parameters within acceptable tolerance</p>
        </div>
      );
    }

    if (result && !result.feasible) {
      return (
        <div className="bg-orange-900/20 border border-orange-500/50 p-6 rounded text-center transition-all duration-500">
          <h2 className="text-xl md:text-2xl font-bold text-orange-400 uppercase tracking-[0.2em]">
            [ NEGOTIATION REQUIRED ]
          </h2>
          <p className="text-orange-400/80 mt-2 text-xs md:text-sm uppercase tracking-widest">Severe resource constraints detected</p>
        </div>
      );
    }
    
    return null;
  };

  if (!isLoaded) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-gray-300 p-4 md:p-8 selection:bg-blue-900/50 overflow-x-hidden">
      <DriftMonitor event={lastDriftEvent} />
      
      {/* Developer Panel */}
      <div className="fixed bottom-4 right-4 bg-[#0a0a0a]/90 backdrop-blur-sm border border-white/5 p-3 rounded-lg shadow-2xl flex items-center gap-3 z-50 transition-colors hover:border-white/10">
        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold font-mono">Demo Mode</span>
        <button 
          onClick={() => setIsDemoMode(!isDemoMode)}
          className={`w-9 h-5 rounded-full relative transition-colors duration-300 ${isDemoMode ? 'bg-blue-600' : 'bg-white/10'}`}
          aria-pressed={isDemoMode}
        >
          <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${isDemoMode ? 'left-5' : 'left-1'}`} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        
        <header className="text-center pt-8 pb-4 relative">
          <h1 className="text-2xl md:text-4xl font-bold tracking-[0.2em] text-white uppercase mb-2 font-mono">
            MissionOS
          </h1>
          <p className="text-sm md:text-base text-gray-400 font-mono">
            AI Mission Control for Impossible Deadlines
          </p>
          <div className="h-[1px] w-24 bg-blue-500/50 mx-auto mt-6" />
          
          {result && (
            <button 
              onClick={handleClear}
              className="absolute right-0 top-10 text-[9px] md:text-[10px] text-gray-500 hover:text-red-400 uppercase tracking-widest transition-colors border border-white/5 hover:border-red-900/50 px-3 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-red-500 font-mono"
            >
              Reset Mission
            </button>
          )}
        </header>

        <section className="space-y-12 pb-24">
          {/* 1. Mission Input */}
          {!result && (
            <MissionForm onAnalyze={handleAnalyze} onLog={addLog} isDemoMode={isDemoMode} onLoadingChange={setIsAnalyzing} />
          )}

          {result && (
            <div className="space-y-12 transition-opacity duration-700 animate-in fade-in">
              {/* 2. Mission Status */}
              <div id="mission-status" className="scroll-m-8 font-mono">
                {renderStatus()}
              </div>

              {/* Evidence Reviewed */}
              {result.evidence_reviewed && result.evidence_reviewed.length > 0 && (
                <section className="bg-[#0a0a0a] border border-white/5 p-6 rounded-lg">
                  <h2 className="text-xs font-bold mb-4 uppercase text-gray-500 tracking-[0.2em] font-mono">Evidence Reviewed</h2>
                  <ul className="space-y-3">
                    {result.evidence_reviewed.map((ev, i) => (
                      <li key={i} className="text-gray-300 text-sm md:text-base font-sans flex items-start gap-3">
                        <span className="text-blue-500 font-bold mt-[2px] font-mono">✓</span> 
                        <span className="leading-relaxed">{ev}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* 3. Failure Analysis */}
              <FailureAnalysis data={result} />

              {/* 4. Strategy Selection */}
              {result.strategies.length > 0 && (
                <StrategyCards 
                  strategies={result.strategies} 
                  recommended={result.recommended || ""} 
                />
              )}


              {/* 5. Why This Plan */}
              {result.strategies.length > 0 && (
                <section className="border-l-2 border-blue-900/50 pl-6 py-2 transition-colors duration-300">
                  <h2 className="text-xs font-bold mb-4 uppercase text-gray-500 tracking-[0.2em] font-mono">Why This Plan</h2>
                  <div className="space-y-4">
                    <p className="text-lg md:text-xl text-gray-200 font-bold font-sans">
                      {result.strategies.find(s => s.id === result.recommended)?.label}
                    </p>
                    <p className="font-sans text-gray-300 leading-relaxed max-w-2xl text-sm md:text-base">
                      {result.rejected_alternatives_summary}
                    </p>
                  </div>
                </section>
              )}

              {/* 6. Milestone Timeline */}
              {result.strategies.length > 0 && (
                <MilestoneTimeline 
                  milestones={result.milestones}
                  currentProb={result.strategies.find(s => s.id === result.recommended)?.success ?? 0}
                  onDrift={handleDrift}
                  disabled={isRenegotiating}
                />
              )}
            </div>
          )}

          {/* Agent Loop */}
          {(isAnalyzing || isRenegotiating || result) && (
            <AgentLoop active={isAnalyzing || isRenegotiating} />
          )}

          {/* 7. Agent Activity (Always visible if logs exist, allows seeing process before result) */}
          <AgentActivity logs={activityLog} />
        </section>
        
        <footer className="pb-8 text-center opacity-50">
          <div className="h-[1px] w-12 bg-gray-800 mx-auto mb-6" />
          <p className="text-[10px] text-gray-500 tracking-[0.3em] uppercase font-mono">System Online // Secure Connection</p>
        </footer>
      </div>
    </main>
  );
}
