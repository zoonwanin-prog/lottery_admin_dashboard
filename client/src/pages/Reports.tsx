import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Calendar, Download, Filter } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import LiveStatusBar from '@/components/LiveStatusBar';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DailyReport {
  date: string;
  totalBets: number;
  totalPayouts: number;
  profit: number;
  transactions: number;
}

interface LotteryStats {
  name: string;
  bets: number;
  payouts: number;
  profit: number;
  percentage: number;
}

interface PopularNumber {
  number: string;
  count: number;
  totalBets: number;
}

export default function Reports() {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedLottery, setSelectedLottery] = useState('all');

  const dailyReports: DailyReport[] = [
    { date: '2026-04-14', totalBets: 125000, totalPayouts: 85000, profit: 40000, transactions: 1250 },
    { date: '2026-04-15', totalBets: 138000, totalPayouts: 92000, profit: 46000, transactions: 1380 },
    { date: '2026-04-16', totalBets: 142000, totalPayouts: 95000, profit: 47000, transactions: 1420 },
    { date: '2026-04-17', totalBets: 155000, totalPayouts: 105000, profit: 50000, transactions: 1550 },
    { date: '2026-04-18', totalBets: 168000, totalPayouts: 112000, profit: 56000, transactions: 1680 },
    { date: '2026-04-19', totalBets: 172000, totalPayouts: 115000, profit: 57000, transactions: 1720 },
    { date: '2026-04-20', totalBets: 185000, totalPayouts: 125000, profit: 60000, transactions: 1850 },
  ];

  const lotteryStats: LotteryStats[] = [
    { name: 'Thai Govt', bets: 425000, payouts: 285000, profit: 140000, percentage: 35 },
    { name: 'Yee-Kee', bets: 325000, payouts: 215000, profit: 110000, percentage: 25 },
    { name: 'Hanoi', bets: 285000, payouts: 190000, profit: 95000, percentage: 20 },
    { name: 'Laos', bets: 215000, payouts: 145000, profit: 70000, percentage: 12 },
    { name: 'Stock', bets: 150000, payouts: 100000, profit: 50000, percentage: 8 },
  ];

  const popularNumbers: PopularNumber[] = [
    { number: '123', count: 456, totalBets: 45600 },
    { number: '456', count: 432, totalBets: 43200 },
    { number: '789', count: 398, totalBets: 39800 },
    { number: '012', count: 387, totalBets: 38700 },
    { number: '345', count: 365, totalBets: 36500 },
    { number: '678', count: 352, totalBets: 35200 },
    { number: '234', count: 341, totalBets: 34100 },
    { number: '567', count: 328, totalBets: 32800 },
  ];

  const totalBets = dailyReports.reduce((sum, r) => sum + r.totalBets, 0);
  const totalPayouts = dailyReports.reduce((sum, r) => sum + r.totalPayouts, 0);
  const totalProfit = dailyReports.reduce((sum, r) => sum + r.profit, 0);
  const avgDailyProfit = Math.round(totalProfit / dailyReports.length);

  const chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <DashboardLayout activeTab="reports">
      <div className="flex flex-col h-full">
        <LiveStatusBar />

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
              <p className="text-muted-foreground">ดูรายงานยอดแทง กำไร-ขาดทุน และสถิติเลขยอดนิยม</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <Filter size={18} />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download size={18} />
                Export
              </button>
            </div>
          </div>

          {/* Date Range & Lottery Filter */}
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm flex gap-4 flex-wrap">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Lottery Type</label>
              <select
                value={selectedLottery}
                onChange={(e) => setSelectedLottery(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Lotteries</option>
                <option value="thai">Thai Govt</option>
                <option value="yee-kee">Yee-Kee</option>
                <option value="hanoi">Hanoi</option>
                <option value="laos">Laos</option>
                <option value="stock">Stock</option>
              </select>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground mb-2">Total Bets</p>
              <h3 className="text-3xl font-bold text-foreground mb-2">฿{(totalBets / 1000000).toFixed(2)}M</h3>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp size={14} /> +12.5% from last week
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground mb-2">Total Payouts</p>
              <h3 className="text-3xl font-bold text-foreground mb-2">฿{(totalPayouts / 1000000).toFixed(2)}M</h3>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp size={14} /> +8.3% from last week
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground mb-2">Total Profit</p>
              <h3 className="text-3xl font-bold text-green-600 mb-2">฿{(totalProfit / 1000000).toFixed(2)}M</h3>
              <p className="text-xs text-green-600 flex items-center gap-1">
                <TrendingUp size={14} /> +18.2% from last week
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground mb-2">Avg Daily Profit</p>
              <h3 className="text-3xl font-bold text-foreground mb-2">฿{avgDailyProfit.toLocaleString()}</h3>
              <p className="text-xs text-slate-600">Per day average</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Profit Trend */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">Daily Profit Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyReports}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981' }}
                    name="Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bets vs Payouts */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">Bets vs Payouts</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyReports}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="totalBets" fill="#3b82f6" name="Total Bets" />
                  <Bar dataKey="totalPayouts" fill="#10b981" name="Total Payouts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lottery Stats & Popular Numbers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lottery Statistics */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">Lottery Statistics</h3>
              <div className="space-y-3">
                {lotteryStats.map((stat, idx) => (
                  <div key={stat.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: chartColors[idx] }}
                      ></div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{stat.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ฿{(stat.bets / 1000).toFixed(0)}K bets
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">฿{(stat.profit / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-muted-foreground">{stat.percentage}% of total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Numbers */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-4">Most Popular Numbers</h3>
              <div className="space-y-2">
                {popularNumbers.map((num, idx) => (
                  <div key={num.number} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">#{idx + 1}</span>
                      </div>
                      <div>
                        <p className="font-mono font-bold text-foreground text-lg">{num.number}</p>
                        <p className="text-xs text-muted-foreground">{num.count} times</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">฿{(num.totalBets / 1000).toFixed(0)}K</p>
                      <div className="w-24 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${(num.count / popularNumbers[0].count) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Daily Report Table */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-4">Daily Report Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Total Bets</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Total Payouts</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Profit/Loss</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Transactions</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Margin %</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyReports.map((report) => {
                    const margin = ((report.profit / report.totalBets) * 100).toFixed(1);
                    return (
                      <tr key={report.date} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">{report.date}</td>
                        <td className="py-3 px-4 text-foreground">฿{report.totalBets.toLocaleString()}</td>
                        <td className="py-3 px-4 text-foreground">฿{report.totalPayouts.toLocaleString()}</td>
                        <td className="py-3 px-4 font-semibold text-green-600">+฿{report.profit.toLocaleString()}</td>
                        <td className="py-3 px-4 text-muted-foreground">{report.transactions.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                            {margin}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
