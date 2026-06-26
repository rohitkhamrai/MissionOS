export default function DriftMonitor({ 
  event 
}: { 
  event: { title: string; expectedDay: number; actualDay: number; delay: number; previousProb: number; newProb: number } | null 
}) {
  if (!event) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-red-950/90 border-2 border-red-800 text-red-100 p-6 rounded shadow-2xl z-50 min-w-[320px] animate-pulse backdrop-blur-sm">
      <h2 className="text-xl font-bold uppercase tracking-widest flex items-center gap-2 mb-4 border-b border-red-800 pb-2">
        <span>⚠</span> SCHEDULE DRIFT
      </h2>
      <div className="space-y-2 font-mono text-sm uppercase tracking-wider">
        <p className="flex justify-between"><span className="text-red-400">Milestone:</span> <span className="text-right ml-4">{event.title}</span></p>
        <p className="flex justify-between"><span className="text-red-400">Expected:</span> <span>Day {event.expectedDay}</span></p>
        <p className="flex justify-between"><span className="text-red-400">Actual:</span> <span>Day {event.actualDay}</span></p>
        <p className="flex justify-between"><span className="text-red-400">Delay:</span> <span className="text-orange-400 font-bold">{event.delay} Days</span></p>
        <div className="border-t border-red-800 pt-3 mt-3">
          <p className="flex justify-between text-gray-300"><span className="text-gray-400">Prev Prob:</span> <span>{event.previousProb}%</span></p>
          <p className="flex justify-between font-bold mt-1 text-lg"><span className="text-red-400">New Prob:</span> <span className="text-red-500">{event.newProb}%</span></p>
        </div>
      </div>
    </div>
  );
}
