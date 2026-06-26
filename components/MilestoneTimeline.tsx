import React, { useState } from "react";
import type { MissionAnalysis } from "@/types/mission";

function MilestoneTimeline({ 
  milestones, 
  currentProb,
  onDrift,
  disabled
}: { 
  milestones: MissionAnalysis['milestones']; 
  currentProb: number;
  onDrift: (event: { title: string; expectedDay: number; actualDay: number; delay: number; previousProb: number; newProb: number }) => void;
  disabled: boolean;
}) {
  const [completions, setCompletions] = useState<Record<number, { day: number; late: boolean }>>({});
  const [activeInput, setActiveInput] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");

  const handleComplete = (idx: number, expected: number, title: string) => {
    const day = parseInt(inputValue, 10);
    if (isNaN(day)) return;

    const delay = day - expected;
    const isLate = delay > 0;
    
    setCompletions(prev => ({ ...prev, [idx]: { day, late: isLate } }));
    setActiveInput(null);
    setInputValue("");

    if (isLate) {
      onDrift({
        title,
        expectedDay: expected,
        actualDay: day,
        delay,
        previousProb: currentProb,
        newProb: currentProb
      });
    }
  };

  return (
    <section className="py-8">
      <h2 className="text-xs font-bold mb-10 uppercase text-gray-500 tracking-[0.2em] text-center">Execution Timeline</h2>
      <div className="relative space-y-6">
        {/* Vertical Line */}
        <div className="absolute left-[5.5px] md:left-2 top-4 bottom-4 w-px bg-white/5" />

        {milestones.map((m, idx) => {
          const comp = completions[idx];
          const isPending = !comp;
          
          const dotColor = isPending ? 'bg-gray-800' : comp.late ? 'bg-orange-500' : 'bg-green-500';
          const ringColor = isPending ? 'ring-gray-900' : comp.late ? 'ring-orange-500/20' : 'ring-green-500/20';

          return (
            <div key={idx} className="relative group transition-colors duration-300 animate-in slide-in-from-left-4 fade-in" style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}>
              {/* Timeline Dot */}
              <div className={`absolute left-0 top-4 w-3 h-3 rounded-full ${dotColor} ring-4 ${ringColor} transition-colors duration-300 z-10`} />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0a0a0a] border border-white/5 p-6 rounded-lg group-hover:border-white/10 transition-colors ml-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500 bg-[#050505] px-2 py-1 rounded border border-white/5 font-bold font-mono">
                      Day {m.expected_day}
                    </span>
                    {m.critical && (
                      <span className="text-[9px] uppercase tracking-[0.2em] text-red-400 bg-red-950/30 px-2 py-1 rounded border border-red-900/50 font-bold font-mono">
                        Critical
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-gray-200 font-sans">{m.title}</h3>
                </div>

                <div className="flex items-center gap-4 mt-2 md:mt-0">
                  <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] min-w-[120px] text-left md:text-right">
                    {isPending ? (
                      <span className="text-gray-600">AWAITING</span>
                    ) : comp.late ? (
                      <span className="text-orange-400">DELAYED (+{comp.day - m.expected_day}D)</span>
                    ) : (
                      <span className="text-green-500">SECURED (D{comp.day})</span>
                    )}
                  </div>
                  
                  {isPending && activeInput !== idx && (
                    <button 
                      onClick={() => setActiveInput(idx)}
                      disabled={disabled}
                      className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-blue-400 hover:text-blue-300 px-4 py-2 border border-blue-900/50 hover:border-blue-700 bg-blue-950/10 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                    >
                      Log Status
                    </button>
                  )}

                  {activeInput === idx && (
                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-300">
                      <span className="text-[9px] uppercase text-gray-600 tracking-widest">Day:</span>
                      <input 
                        type="number" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="#"
                        disabled={disabled}
                        className="bg-[#050505] border border-gray-800 w-16 px-2 py-1.5 text-xs text-gray-200 outline-none focus:border-blue-500 text-center uppercase tracking-widest"
                        autoFocus
                      />
                      <button 
                        onClick={() => handleComplete(idx, m.expected_day, m.title)}
                        disabled={disabled}
                        className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-blue-600/80 hover:bg-blue-500 px-4 py-2 rounded transition-all disabled:opacity-30"
                      >
                        Commit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default React.memo(MilestoneTimeline);
