export default function AgentLoop({ active }: { active: boolean }) {
  const stages = ["OBSERVE", "PREDICT", "NEGOTIATE", "REBUILD", "MONITOR"];

  return (
    <section className="bg-gray-900 border border-gray-800 p-6 rounded shadow-lg overflow-hidden relative">
      <h2 className="text-xs font-bold uppercase text-gray-500 tracking-widest mb-6">Autonomous Agent Loop</h2>
      <div className="flex justify-between items-center relative px-2">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-gray-800 -z-10 -translate-y-1/2"></div>
        
        {stages.map((stage, idx) => {
          const delay = idx * 0.6;
          return (
            <div 
              key={stage} 
              className="flex flex-col items-center bg-gray-900 px-3 z-10"
              style={{
                animation: active ? `pulseNode 0.6s ease-in-out ${delay}s forwards` : 'none'
              }}
            >
              <div 
                className={`w-3 h-3 rounded-full border-2 mb-3 transition-colors ${active ? 'border-gray-600 bg-gray-800' : 'border-gray-700 bg-gray-950'}`}
                style={{
                  animation: active ? `highlightNode 0.6s ease-in-out ${delay}s forwards` : 'none'
                }}
              />
              <span 
                className="text-[10px] uppercase tracking-widest font-bold text-gray-600"
                style={{
                  animation: active ? `highlightText 0.6s ease-in-out ${delay}s forwards` : 'none'
                }}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes highlightNode {
          0% { border-color: #4b5563; background-color: #1f2937; transform: scale(1); box-shadow: none; }
          50% { border-color: #3b82f6; background-color: #60a5fa; transform: scale(1.8); box-shadow: 0 0 12px #3b82f6; }
          100% { border-color: #10b981; background-color: #34d399; transform: scale(1); box-shadow: 0 0 4px #10b981; }
        }
        @keyframes highlightText {
          0% { color: #4b5563; }
          50% { color: #bfdbfe; text-shadow: 0 0 8px #60a5fa; }
          100% { color: #6ee7b7; }
        }
      `}} />
    </section>
  );
}
