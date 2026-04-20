import React, { useState, useEffect } from 'react';
import { BarChart3, Users, TrendingUp, DollarSign, PieChart } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import LiveStatusBar from '@/components/LiveStatusBar';
import StatCard from '@/components/StatCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface LotteryResult {
  game: string;
  drawTime: string;
  numbers: string;
  status: 'open' | 'closed';
}

export default function Dashboard() {
  const [lotteryResults, setLotteryResults] = useState<LotteryResult[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  useEffect(() => {
    // Mock lottery results
    const mockResults: LotteryResult[] = [
      { game: 'Thai Government', drawTime: '01:30 PM', numbers: '4567 23 45', status: 'closed' },
      { game: 'Yee-Kee', drawTime: '11:15 AM', numbers: '12 68 09', status: 'open' },
      { game: 'Hanoi', drawTime: '09:45 AM', numbers: '789 45 23', status: 'closed' },
      { game: 'Laos', drawTime: '08:00 AM', numbers: '234 67 89', status: 'closed' },
      { game: 'Stock', drawTime: '04:00 PM', numbers: '567 34 12', status: 'open' },
    ];
    setLotteryResults(mockResults);

    // Mock chart data
    const mockChartData = [
      { time: '08:00', bets: 12000, payouts: 8500 },
      { time: '10:00', bets: 18500, payouts: 12300 },
      { time: '12:00', bets: 25000, payouts: 16800 },
      { time: '14:00', bets: 32000, payouts: 21500 },
      { time: '16:00', bets: 38000, payouts: 25200 },
      { time: '18:00', bets: 42000, payouts: 28900 },
    ];
    setChartData(mockChartData);

    // Mock pie chart data
    const mockPieData = [
      { name: 'Thai Govt', value: 35, color: '#3b82f6' },
      { name: 'Yee-Kee', value: 25, color: '#10b981' },
      { name: 'Hanoi', value: 20, color: '#f59e0b' },
      { name: 'Laos', value: 12, color: '#ef4444' },
      { name: 'Stock', value: 8, color: '#8b5cf6' },
    ];
    setPieData(mockPieData);
  }, []);

  return (
    <DashboardLayout activeTab="dashboard">
      <div className="flex flex-col h-full">
        {/* Live Status Bar */}
        <LiveStatusBar />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Daily Total Bets"
              value="42,000"
              unit="฿"
              trend="up"
              trendValue="+12.5% from yesterday"
              icon={<TrendingUp size={24} />}
              color="blue"
            />
            <StatCard
              title="Total Payouts"
              value="28,900"
              unit="฿"
              trend="up"
              trendValue="+8.3% from yesterday"
              icon={<DollarSign size={24} />}
              color="amber"
            />
            <StatCard
              title="Net Profit/Loss"
              value="+13,100"
              unit="฿"
              trend="up"
              trendValue="+18.2% from yesterday"
              icon={<BarChart3 size={24} />}
              color="green"
            />
            <StatCard
              title="Online Members"
              value="834"
              trend="up"
              trendValue="+45 from 1 hour ago"
              icon={<Users size={24} />}
              color="blue"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Line Chart - Bets vs Payouts */}
            <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">Bets vs Payouts Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="bets"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6' }}
                    name="Total Bets"
                  />
                  <Line
                    type="monotone"
                    dataKey="payouts"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981' }}
                    name="Total Payouts"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Lottery Distribution */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">Bets Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Lottery Results */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-4">Recent Lottery Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Game</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Draw Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Winning Numbers</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lotteryResults.map((result, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 text-foreground font-medium">{result.game}</td>
                      <td className="py-3 px-4 text-muted-foreground">{result.drawTime}</td>
                      <td className="py-3 px-4 font-mono text-foreground font-semibold">{result.numbers}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          result.status === 'open'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {result.status === 'open' ? 'Open' : 'Closed'}
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
