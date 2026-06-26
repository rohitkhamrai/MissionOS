import React, { useEffect, useState } from "react";
import type { MissionAnalysis } from "@/types/mission";

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  
  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (diff === 0) return;
    const duration = 800;
    const startTime = performance.now();
    
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(start + diff * easeOutQuart));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, display]);
  
  return <>{display}</>;
}

export default function FailureAnalysis({ data }: { data: MissionAnalysis }) {
  if (data.feasible) return null;

  const deficit = data.conflict.required - data.conflict.available;
  const failureProb = Math.min(99.9, ((deficit / data.conflict.required) * 100));

  return (
    <section className="bg-[#0a0a0a] border border-white/5 p-6 rounded-lg grid md:grid-cols-2 gap-8">
      <div className="flex flex-col justify-center">
        <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-2 font-mono">Simulated Failure Probability</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-6xl md:text-7xl font-bold text-red-500 font-mono tracking-tight">
            <AnimatedNumber value={Math.round(failureProb)} />
          </span>
          <span className="text-xl md:text-2xl text-red-900 font-mono">%</span>
        </div>
        <p className="text-gray-400 mt-4 text-sm font-sans leading-relaxed">
          Current trajectory indicates critical resource exhaustion before mission objectives can be completed. Immediate structural renegotiation is required to prevent catastrophic failure.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-mono">Resource Conflict</h3>
        
        <div className="flex justify-between items-center p-3 bg-gray-900/30 rounded border border-white/5">
          <span className="text-gray-400 text-xs md:text-sm font-sans">Required Effort</span>
          <span className="text-red-400 font-bold font-mono">{data.conflict.required} hrs</span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-gray-900/30 rounded border border-white/5">
          <span className="text-gray-400 text-xs md:text-sm font-sans">Available Capacity</span>
          <span className="text-green-400 font-bold font-mono">{data.conflict.available} hrs</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-red-900/20 rounded border border-red-900/50">
          <span className="text-red-400 font-bold text-xs md:text-sm uppercase tracking-widest font-mono">Deficit</span>
          <span className="text-red-500 font-bold text-lg font-mono">-{deficit} hrs</span>
        </div>
      </div>
    </section>
  );
}
