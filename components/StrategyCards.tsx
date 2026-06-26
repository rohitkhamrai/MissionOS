import { MissionAnalysis } from '@/types/mission';

export default function StrategyCards({ 
  strategies, 
  recommended 
}: { 
  strategies: MissionAnalysis['strategies'], 
  recommended: string 
}) {
  if (strategies.length === 0) return null;

  return (
    <section className="py-4">
      <h2 className="text-xs font-bold mb-8 uppercase text-gray-500 tracking-[0.2em] text-center font-mono">Available Strategies</h2>
      
      {/* Recommended Strategy Full Width */}
      <div className="mb-8 animate-in slide-in-from-bottom-4 duration-700">
        {strategies.filter(s => s.id === recommended).map(strategy => (
          <div 
            key={strategy.id}
            className="bg-[#050505] border border-blue-500/20 p-6 md:p-8 rounded-lg shadow-[0_0_25px_rgba(59,130,246,0.05)] transition-colors duration-300 relative overflow-hidden group hover:border-blue-400/40"
          >
            <div className="absolute top-0 right-0 bg-blue-600/90 text-white text-[9px] md:text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-bl-lg font-bold font-mono">
              AI Recommended
            </div>
            
            <div className="mb-8 mt-2">
              <span className="uppercase text-[10px] tracking-[0.2em] text-blue-500 block mb-3 font-mono">
                Primary Option // {strategy.id}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-100 uppercase tracking-widest font-mono">{strategy.label}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-white/5 pb-3">
                  <span className="uppercase tracking-widest text-xs text-gray-500 font-mono">Success Rate</span>
                  <span className="font-bold text-xl text-blue-400 leading-none font-mono">{strategy.success}%</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-3">
                  <span className="uppercase tracking-widest text-xs text-gray-500 font-mono">Sacrifice Score</span>
                  <span className="font-bold text-xl text-orange-400 leading-none font-mono">{strategy.sacrifice_score}/10</span>
                </div>
                <div className="pt-2">
                  <span className="block mb-3 uppercase tracking-widest text-xs text-gray-600 font-mono">Rationale</span>
                  <p className="leading-relaxed text-sm md:text-base text-gray-300 font-sans">{strategy.reason}</p>
                </div>
              </div>
              
              <div className="bg-[#0a0a0a] p-6 border border-white/5 rounded-lg">
                <span className="block mb-4 uppercase tracking-widest text-xs text-gray-600 font-mono">Required Cuts</span>
                <ul className="space-y-3">
                  {strategy.cuts.length > 0 ? (
                    strategy.cuts.map((cut, idx) => (
                      <li key={idx} className="text-gray-300 text-sm md:text-base font-sans flex gap-3 items-start">
                        <span className="text-red-500/80 mt-[1px] font-mono">⨯</span> 
                        <span className="leading-relaxed">{cut}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 text-sm font-sans italic">No scope cuts required.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alternative Strategies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-1000 delay-300 fill-mode-both">
        {strategies.filter(s => s.id !== recommended).map(strategy => (
          <div 
            key={strategy.id}
            className="bg-[#050505] border border-white/5 p-6 rounded-lg transition-colors duration-300 hover:border-white/10 flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="uppercase text-[9px] tracking-[0.2em] text-gray-500 block mb-2 font-mono">
                  Alt // {strategy.id}
                </span>
                <h3 className="font-bold text-gray-300 uppercase tracking-wider font-mono">{strategy.label}</h3>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-400 font-mono">{strategy.success}%</div>
              </div>
            </div>

            <div className="space-y-4 mb-6 flex-grow">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-600 uppercase tracking-widest">Sacrifice</span>
                <span className="text-gray-400">{strategy.sacrifice_score}/10</span>
              </div>
              <div>
                <p className="text-sm text-gray-400 leading-relaxed font-sans line-clamp-3">{strategy.reason}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <span className="block mb-2 uppercase tracking-widest text-[9px] text-gray-600 font-mono">Cuts ({strategy.cuts.length})</span>
              <ul className="space-y-1">
                {strategy.cuts.slice(0, 2).map((cut, idx) => (
                  <li key={idx} className="text-gray-500 text-xs font-sans truncate">
                    <span className="mr-2 font-mono text-[9px]">⨯</span>{cut}
                  </li>
                ))}
                {strategy.cuts.length > 2 && (
                  <li className="text-gray-600 text-[10px] uppercase tracking-widest font-mono pt-1">
                    + {strategy.cuts.length - 2} more
                  </li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
