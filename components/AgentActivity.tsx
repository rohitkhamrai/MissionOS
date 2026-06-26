import React, { useRef, useEffect } from 'react';

interface LogEntry {
  id: number;
  text: string;
  type: 'success' | 'warning' | 'error';
}

function AgentActivity({ logs }: { logs: LogEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  if (logs.length === 0) return null;

  return (
    <section className="bg-[#050505] border border-white/5 rounded-lg p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-900/50 via-cyan-900/50 to-blue-900/50" />
      <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-4 font-mono">Agent Activity Log</h3>
      <div 
        ref={containerRef}
        className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-800"
      >
        {logs.map((log) => {
          let colorClass = "text-gray-400";
          let badgeClass = "bg-gray-900 text-gray-500 border-gray-800";
          let label = "INFO";
          
          if (log.type === 'success') {
            colorClass = "text-green-400";
            badgeClass = "bg-green-950/30 text-green-500 border-green-900/50";
            label = "OK";
          } else if (log.type === 'warning') {
            colorClass = "text-orange-400";
            badgeClass = "bg-orange-950/30 text-orange-500 border-orange-900/50";
            label = "WARN";
          } else if (log.type === 'error') {
            colorClass = "text-red-400";
            badgeClass = "bg-red-950/30 text-red-500 border-red-900/50";
            label = "ERR";
          }

          return (
            <div key={log.id} className="flex gap-3 items-start animate-in slide-in-from-bottom-2 fade-in duration-300">
              <span className={`text-[9px] px-1.5 py-0.5 rounded border ${badgeClass} font-mono mt-0.5`}>
                {label}
              </span>
              <span className={`text-sm font-sans leading-relaxed ${colorClass}`}>
                {log.text}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default React.memo(AgentActivity);
