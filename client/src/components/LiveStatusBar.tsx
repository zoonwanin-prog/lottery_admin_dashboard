import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface HotNumber {
  lottery: string;
  number: string;
  bets: number;
  limit: number;
  status: 'hot' | 'limit';
}

export default function LiveStatusBar() {
  const [hotNumbers, setHotNumbers] = useState<HotNumber[]>([]);

  useEffect(() => {
    // Simulate fetching hot numbers data
    const mockData: HotNumber[] = [
      { lottery: 'Thai Govt', number: '456', bets: 45000, limit: 50000, status: 'hot' },
      { lottery: 'Yee-Kee', number: '12', bets: 48000, limit: 50000, status: 'limit' },
      { lottery: 'Hanoi', number: '678', bets: 42000, limit: 50000, status: 'hot' },
      { lottery: 'Laos', number: '234', bets: 38000, limit: 50000, status: 'hot' },
      { lottery: 'Stock', number: '789', bets: 35000, limit: 50000, status: 'hot' },
    ];
    setHotNumbers(mockData);
  }, []);

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-3 shadow-lg">
      <div className="flex items-center gap-4 overflow-x-auto">
        {/* Live Status Label */}
        <div className="flex items-center gap-2 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-sm font-bold">LIVE STATUS:</span>
          </div>
          <span className="text-xs text-slate-300">Hot Numbers</span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-700"></div>

        {/* Hot Numbers Scroll */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {hotNumbers.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-700/50 border border-slate-600 whitespace-nowrap flex-shrink-0 hover:bg-slate-700 transition-colors"
            >
              <span className="text-xs font-semibold text-slate-300">{item.lottery}:</span>
              <span className="text-sm font-bold text-white">{item.number}</span>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                item.status === 'limit' ? 'bg-red-500' : 'bg-amber-500'
              }`}></div>
              <span className={`text-xs font-medium ${
                item.status === 'limit' ? 'text-red-300' : 'text-amber-300'
              }`}>
                {item.status === 'limit' ? 'LIMIT' : 'HOT'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
