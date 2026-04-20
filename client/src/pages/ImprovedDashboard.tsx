import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardData {
  dailyBets: number;
  totalPayouts: number;
  netProfit: number;
  onlineMembers: number;
  hotNumbers: Array<{
    type: string;
    number: string;
    bets: number;
    limit: number;
    status: 'hot' | 'ok' | 'warning';
  }>;
  chartData: Array<{
    time: string;
    bets: number;
    payouts: number;
  }>;
}

const ImprovedDashboard: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const dashboardData: DashboardData = {
    dailyBets: 42000,
    totalPayouts: 28900,
    netProfit: 13100,
    onlineMembers: 834,
    hotNumbers: [
      { type: 'Yee-Kee', number: '456', bets: 45200, limit: 50000, status: 'hot' },
      { type: 'Thai Govt', number: '678', bets: 32100, limit: 100000, status: 'ok' },
      { type: 'Hanoi', number: '234', bets: 28900, limit: 80000, status: 'warning' },
    ],
    chartData: [
      { time: '00:00', bets: 2400, payouts: 1600 },
      { time: '04:00', bets: 3200, payouts: 2100 },
      { time: '08:00', bets: 4100, payouts: 2800 },
      { time: '12:00', bets: 5200, payouts: 3600 },
      { time: '16:00', bets: 6100, payouts: 4200 },
      { time: '20:00', bets: 7200, payouts: 5100 },
    ],
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'lottery', label: 'Lottery', icon: '🎰' },
    { id: 'yeekee', label: 'Yee-Kee', icon: '⏱️' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'members', label: 'Members', icon: '👥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'ok': return '#10b981';
      default: return '#64748b';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'hot': return '🔴 HOT';
      case 'warning': return '🟡 WARN';
      case 'ok': return '🟢 OK';
      default: return '⚪ UNKNOWN';
    }
  };

  return (
    <div className="improved-dashboard">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --navy-950: #070d2e;
          --navy-900: #0b1444;
          --navy-800: #0f1f5c;
          --navy-700: #172e80;
          --navy-600: #2b3d82;
          --navy-500: #3d52a5;
          --gold-300: #fce08a;
          --gold-400: #f5c518;
          --gold-500: #eab308;
          --gold-600: #ca9a07;
          --ink: #1a1f36;
          --ink-muted: #64748b;
          --ink-soft: #94a3b8;
          --ink-faint: #cbd5e1;
          --bg: #f5f6fb;
          --bg-card: #ffffff;
          --bg-subtle: #eef1f9;
          --border: #e2e8f0;
          --border-soft: #eef2f7;
          --success: #10b981;
          --warning: #f59e0b;
          --danger: #ef4444;
          --purple: #8b5cf6;
          --cyan: #06b6d4;
          --shadow-sm: 0 1px 2px rgba(15, 31, 92, 0.06);
          --shadow: 0 4px 16px rgba(15, 31, 92, 0.08);
          --shadow-lg: 0 10px 32px rgba(15, 31, 92, 0.12);
          --shadow-xl: 0 20px 48px rgba(15, 31, 92, 0.16);
        }

        [data-theme="dark"] {
          --navy-950: #0a0e1a;
          --navy-900: #0f1629;
          --navy-800: #1a2847;
          --navy-700: #2a3f6f;
          --navy-600: #3d52a5;
          --ink: #f0f4f8;
          --ink-muted: #94a3b8;
          --ink-soft: #64748b;
          --ink-faint: #475569;
          --bg: #0f1419;
          --bg-card: #1a1f2e;
          --bg-subtle: #252d3d;
          --border: #334155;
          --border-soft: #2d3748;
        }

        .improved-dashboard {
          font-family: 'Prompt', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: var(--bg);
          color: var(--ink);
          min-height: 100vh;
          transition: background-color 0.3s, color 0.3s;
        }

        .app-container {
          display: grid;
          grid-template-columns: 240px 1fr;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .app-container {
            grid-template-columns: 1fr;
          }
        }

        /* Sidebar */
        .sidebar {
          background: var(--navy-900);
          color: #fff;
          padding: 28px 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          transition: transform 0.3s ease;
          z-index: 100;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: 0;
            width: 240px;
            transform: translateX(-100%);
            height: 100vh;
          }

          .sidebar.open {
            transform: translateX(0);
            box-shadow: var(--shadow-xl);
          }
        }

        .brand {
          padding: 0 24px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .brand-mark {
          width: 34px;
          height: 34px;
          background: var(--gold-400);
          border-radius: 6px;
          display: grid;
          place-items: center;
          font-family: 'Fraunces', serif;
          font-weight: 800;
          color: var(--navy-900);
          font-size: 19px;
          flex-shrink: 0;
        }

        .brand-name {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: -0.02em;
        }

        .nav-section {
          padding: 20px 16px 8px;
        }

        .nav-label {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0 8px 10px;
          font-weight: 600;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.15s;
          margin-bottom: 2px;
          position: relative;
          user-select: none;
          border: none;
          background: none;
          font-family: inherit;
          text-align: left;
          width: 100%;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: #fff;
        }

        .nav-item.active {
          background: linear-gradient(90deg, rgba(245,197,24,0.12) 0%, transparent 100%);
          color: var(--gold-400);
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          left: -16px;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: var(--gold-400);
          border-radius: 0 3px 3px 0;
        }

        /* Topbar */
        .topbar {
          background: var(--bg-card);
          border-bottom: 1px solid var(--border);
          padding: 14px 32px;
          display: flex;
          align-items: center;
          gap: 24px;
          position: sticky;
          top: 0;
          z-index: 10;
          transition: background-color 0.3s, border-color 0.3s;
        }

        @media (max-width: 768px) {
          .topbar {
            padding: 14px 16px;
            gap: 12px;
          }
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--ink);
          font-size: 24px;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background-color 0.2s;
        }

        .menu-toggle:hover {
          background: var(--bg-subtle);
        }

        @media (max-width: 768px) {
          .menu-toggle {
            display: block;
          }
        }

        .page-title {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--navy-800);
        }

        [data-theme="dark"] .page-title {
          color: var(--gold-400);
        }

        .topbar-right {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .theme-toggle {
          background: var(--bg);
          border: 1px solid var(--border);
          width: 38px;
          height: 38px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .theme-toggle:hover {
          background: var(--bg-subtle);
          border-color: var(--gold-400);
        }

        /* Main content */
        .main {
          padding: 28px 32px 40px;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .main {
            padding: 20px 16px 32px;
          }
        }

        /* Metrics */
        .metric-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        @media (max-width: 1024px) {
          .metric-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .metric-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }

        .metric {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 18px 20px;
          position: relative;
          overflow: hidden;
          transition: all 0.2s;
          border-left: 3px solid var(--navy-800);
        }

        .metric:hover {
          border-color: var(--gold-400);
          box-shadow: var(--shadow);
        }

        .metric[data-accent="gold"] {
          border-left-color: var(--gold-400);
        }

        .metric[data-accent="success"] {
          border-left-color: var(--success);
        }

        .metric[data-accent="danger"] {
          border-left-color: var(--danger);
        }

        .metric-label {
          font-size: 11px;
          color: var(--ink-muted);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-weight: 600;
        }

        .metric-value {
          font-family: 'Fraunces', serif;
          font-size: 32px;
          font-weight: 600;
          color: var(--navy-800);
          margin-top: 4px;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        [data-theme="dark"] .metric-value {
          color: var(--gold-400);
        }

        .metric-trend {
          font-size: 12px;
          color: var(--success);
          margin-top: 6px;
          font-weight: 500;
        }

        .metric-trend.down {
          color: var(--danger);
        }

        /* Cards */
        .card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s;
          margin-bottom: 20px;
        }

        .card:hover {
          border-color: var(--gold-400);
        }

        .card-header {
          padding: 18px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-soft);
        }

        .card-title {
          font-family: 'Fraunces', serif;
          font-size: 18px;
          font-weight: 600;
          color: var(--navy-800);
        }

        [data-theme="dark"] .card-title {
          color: var(--gold-400);
        }

        /* Table */
        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th {
          text-align: left;
          font-size: 10px;
          color: var(--ink-muted);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 600;
          padding: 12px 22px;
          background: var(--bg-subtle);
          border-bottom: 1px solid var(--border);
        }

        .table td {
          padding: 14px 22px;
          font-size: 13px;
          border-bottom: 1px solid var(--border-soft);
          vertical-align: middle;
        }

        .table tr:hover td {
          background: var(--bg-subtle);
        }

        .tag {
          display: inline-block;
          padding: 3px 9px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          background: var(--bg-subtle);
          color: var(--ink);
        }

        .tag.yeekee {
          background: rgba(245,197,24,0.15);
          color: var(--gold-600);
        }

        .tag.govt {
          background: rgba(15,31,92,0.1);
          color: var(--navy-800);
        }

        .tag.hanoi {
          background: rgba(239,68,68,0.1);
          color: var(--danger);
        }

        .num-badge {
          display: inline-block;
          min-width: 42px;
          padding: 4px 10px;
          background: var(--navy-800);
          color: var(--gold-400);
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          font-size: 14px;
          border-radius: 6px;
          text-align: center;
          letter-spacing: 0.05em;
        }

        .status-badge {
          font-weight: 600;
        }

        .grid-main {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }

        @media (max-width: 1024px) {
          .grid-main {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="app-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="brand">
            <div className="brand-mark">S</div>
            <div className="brand-name">SuperLotto</div>
          </div>

          <nav className="nav-section">
            <div className="nav-label">Main</div>
            {navItems.slice(0, 3).map((item) => (
              <button
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <nav className="nav-section">
            <div className="nav-label">Tools</div>
            {navItems.slice(3).map((item) => (
              <button
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main wrapper */}
        <div>
          {/* Topbar */}
          <header className="topbar">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <h1 className="page-title">Dashboard</h1>

            <div className="topbar-right">
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </header>

          {/* Main content */}
          <main className="main">
            {currentPage === 'dashboard' && (
              <>
                {/* Metrics */}
                <div className="metric-row">
                  <div className="metric" data-accent="gold">
                    <div className="metric-label">📊 Daily Total Bets</div>
                    <div className="metric-value">42,000</div>
                    <div className="metric-trend">+12.5% from yesterday</div>
                  </div>
                  <div className="metric" data-accent="success">
                    <div className="metric-label">💰 Total Payouts</div>
                    <div className="metric-value">28,900</div>
                    <div className="metric-trend">+8.3% from yesterday</div>
                  </div>
                  <div className="metric" data-accent="success">
                    <div className="metric-label">📈 Net Profit/Loss</div>
                    <div className="metric-value">+13,100</div>
                    <div className="metric-trend">+18.2% from yesterday</div>
                  </div>
                  <div className="metric">
                    <div className="metric-label">👥 Online Members</div>
                    <div className="metric-value">834</div>
                    <div className="metric-trend">+45 from 1 hour ago</div>
                  </div>
                </div>

                {/* Charts and tables */}
                <div className="grid-main">
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">📊 Bets vs Payouts Trend</div>
                    </div>
                    <div style={{ padding: '20px', height: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dashboardData.chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="bets" fill="#f5c518" />
                          <Bar dataKey="payouts" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">🔥 Hot Numbers</div>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Number</th>
                            <th>Bets</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.hotNumbers.map((item, idx) => (
                            <tr key={idx}>
                              <td>
                                <span className={`tag ${item.type.toLowerCase().replace(' ', '-')}`}>
                                  {item.type}
                                </span>
                              </td>
                              <td>
                                <span className="num-badge">{item.number}</span>
                              </td>
                              <td>{item.bets.toLocaleString()} / {item.limit.toLocaleString()}</td>
                              <td>
                                <span className="status-badge" style={{ color: getStatusColor(item.status) }}>
                                  {getStatusLabel(item.status)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentPage !== 'dashboard' && (
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    {navItems.find(item => item.id === currentPage)?.label}
                  </div>
                </div>
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ink-muted)' }}>
                  <p>Page coming soon</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ImprovedDashboard;
