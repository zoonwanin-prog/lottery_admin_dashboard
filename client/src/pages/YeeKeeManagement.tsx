import React, { useState } from 'react';
import { Clock, Settings, BarChart3, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import LiveStatusBar from '@/components/LiveStatusBar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function YeeKeeManagement() {
  const [profitMode, setProfitMode] = useState<'random' | 'manual' | 'profit-target'>('profit-target');
  const [targetProfit, setTargetProfit] = useState(50);
  const [manualNumber, setManualNumber] = useState('');
  const [fiveMinRounds, setFiveMinRounds] = useState<any[]>([
    { id: 1, time: '05:00 AM', status: 'closed', number: '12345', bets: 8500, payouts: 4200 },
    { id: 2, time: '05:05 AM', status: 'closed', number: '67890', bets: 9200, payouts: 4800 },
    { id: 3, time: '05:10 AM', status: 'open', number: '-', bets: 12000, payouts: 0 },
  ]);

  const riskData = [
    { bets: 0, potential: 0, target: 0 },
    { bets: 25000, potential: 50000, target: 25000 },
    { bets: 50000, potential: 100000, target: 50000 },
    { bets: 75000, potential: 150000, target: 75000 },
    { bets: 100000, potential: 200000, target: 100000 },
  ];

  const handleSetNumber = () => {
    if (manualNumber.length === 5) {
      alert(`Number ${manualNumber} set for next round`);
      setManualNumber('');
    }
  };

  return (
    <DashboardLayout activeTab="yee-kee">
      <div className="flex flex-col h-full">
        <LiveStatusBar />

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Yee-Kee Lottery Management</h1>
            <p className="text-muted-foreground">Configure rounds, profit control, and manual overrides</p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Round Settings */}
            <div className="lg:col-span-1 space-y-6">
              {/* Round Settings Card */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="text-blue-600" size={24} />
                  <h3 className="text-lg font-bold text-foreground">Round Settings</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">5-Minute Rounds</label>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-700 font-semibold">288 rounds/day</p>
                      <p className="text-xs text-blue-600 mt-1">Next: 05:15 AM</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">15-Minute Rounds</label>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-700 font-semibold">96 rounds/day</p>
                      <p className="text-xs text-green-600 mt-1">Next: 05:15 AM</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Prize Structure</p>
                    <div className="bg-slate-50 rounded-lg p-3 space-y-1">
                      <p className="text-sm text-foreground"><span className="font-mono font-bold">5 digits:</span> 12345</p>
                      <p className="text-xs text-muted-foreground ml-2">Top 3: 345 | Bottom 2: 12</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Profit Control */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profit Control Card */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="text-amber-600" size={24} />
                  <h3 className="text-lg font-bold text-foreground">Profit Control</h3>
                </div>

                <div className="space-y-4">
                  {/* Mode Selection */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-3">Mode</label>
                    <div className="space-y-2">
                      {(['random', 'manual', 'profit-target'] as const).map((mode) => (
                        <label key={mode} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                          <input
                            type="radio"
                            name="mode"
                            value={mode}
                            checked={profitMode === mode}
                            onChange={(e) => setProfitMode(e.target.value as any)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm font-medium text-foreground capitalize">
                            {mode === 'profit-target' ? 'Profit Target' : mode.charAt(0).toUpperCase() + mode.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Profit Target Slider */}
                  {profitMode === 'profit-target' && (
                    <div className="pt-4 border-t border-border">
                      <label className="text-sm font-medium text-foreground block mb-3">
                        Target Profit: <span className="text-green-600 font-bold">{targetProfit}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={targetProfit}
                        onChange={(e) => setTargetProfit(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-xs text-green-700">
                          <span className="font-semibold">Example:</span> If total bets = ฿10,000, system will ensure payouts ≤ ฿{Math.round(10000 * (100 - targetProfit) / 100)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Auto Profit Mode Toggle */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">Auto Profit Mode</label>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition ml-1"></span>
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Automatically select numbers with lowest bet amounts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Risk Analysis */}
            <div className="lg:col-span-1 space-y-6">
              {/* Risk Analysis Card */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="text-red-600" size={24} />
                  <h3 className="text-lg font-bold text-foreground">Risk Analysis</h3>
                </div>

                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={riskData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="bets" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line
                      type="monotone"
                      dataKey="potential"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Max Payout"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Target"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2">
                  <AlertCircle className="text-amber-600 flex-shrink-0" size={16} />
                  <p className="text-xs text-amber-700">
                    <span className="font-semibold">Current Risk:</span> Moderate - Monitor closely
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Manual Override Section */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-4">Manual Override - Set Next Draw Number</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Enter 5-Digit Number</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualNumber}
                    onChange={(e) => setManualNumber(e.target.value.slice(0, 5).replace(/[^0-9]/g, ''))}
                    placeholder="00000"
                    maxLength={5}
                    className="flex-1 px-4 py-2 border border-border rounded-lg font-mono text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSetNumber}
                    disabled={manualNumber.length !== 5}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Set
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">This will override the automatic number selection for the next round</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">Current Round Status</p>
                <div className="space-y-1 text-sm text-blue-800">
                  <p><span className="font-medium">Round:</span> #1234 (5-min)</p>
                  <p><span className="font-medium">Time Remaining:</span> 2 minutes 45 seconds</p>
                  <p><span className="font-medium">Total Bets:</span> ฿12,500</p>
                  <p><span className="font-medium">Mode:</span> Profit Target (50%)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Rounds Table */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-4">Recent 5-Minute Rounds</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Round</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Number</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Total Bets</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Payouts</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fiveMinRounds.map((round) => (
                    <tr key={round.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-foreground font-semibold">#{round.id}</td>
                      <td className="py-3 px-4 text-muted-foreground">{round.time}</td>
                      <td className="py-3 px-4 font-mono text-foreground font-bold text-lg">{round.number}</td>
                      <td className="py-3 px-4 text-foreground font-semibold">฿{round.bets.toLocaleString()}</td>
                      <td className="py-3 px-4 text-foreground font-semibold">฿{round.payouts.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          round.status === 'open'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {round.status === 'open' ? 'Open' : 'Closed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
