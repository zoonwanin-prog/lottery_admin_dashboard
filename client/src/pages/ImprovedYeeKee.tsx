import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface YeeKeeRound {
  roundNumber: number;
  time: string;
  result: string;
  totalBets: number;
  targetProfit: number;
  actualProfit: number;
  status: 'completed' | 'pending' | 'active';
}

interface YeeKeeSettings {
  interval: '5min' | '15min';
  targetProfitPercentage: number;
  riskLevel: 'low' | 'medium' | 'high';
  autoGenerate: boolean;
  manualOverride: boolean;
}

const ImprovedYeeKee: React.FC = () => {
  const [settings, setSettings] = useState<YeeKeeSettings>({
    interval: '5min',
    targetProfitPercentage: 50,
    riskLevel: 'medium',
    autoGenerate: true,
    manualOverride: false,
  });

  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [manualResult, setManualResult] = useState('');
  const [showModal, setShowModal] = useState(false);

  const yeeKeeRounds: YeeKeeRound[] = [
    { roundNumber: 1, time: '00:00', result: '12345', totalBets: 45200, targetProfit: 22600, actualProfit: 28900, status: 'completed' },
    { roundNumber: 2, time: '00:05', result: '67890', totalBets: 38100, targetProfit: 19050, actualProfit: 22100, status: 'completed' },
    { roundNumber: 3, time: '00:10', result: '54321', totalBets: 52300, targetProfit: 26150, actualProfit: 31200, status: 'completed' },
    { roundNumber: 4, time: '00:15', result: '---', totalBets: 41200, targetProfit: 20600, actualProfit: 0, status: 'pending' },
  ];

  const chartData = [
    { round: 1, targetProfit: 22600, actualProfit: 28900 },
    { round: 2, targetProfit: 19050, actualProfit: 22100 },
    { round: 3, targetProfit: 26150, actualProfit: 31200 },
    { round: 4, targetProfit: 20600, actualProfit: 0 },
  ];

  const handleSettingChange = (key: keyof YeeKeeSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleManualOverride = (roundNumber: number) => {
    setSelectedRound(roundNumber);
    setShowModal(true);
  };

  const submitManualResult = () => {
    if (manualResult.length === 5) {
      console.log(`Round ${selectedRound}: Manual result ${manualResult}`);
      setManualResult('');
      setShowModal(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return '✅ Completed';
      case 'pending': return '⏳ Pending';
      case 'active': return '🔴 Active';
      default: return '⚪ Unknown';
    }
  };

  return (
    <div className="improved-yeekee">
      <style>{`
        .improved-yeekee {
          font-family: 'Prompt', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .yeekee-container {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 20px;
        }

        @media (max-width: 1024px) {
          .yeekee-container {
            grid-template-columns: 1fr;
          }
        }

        .settings-panel {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        .settings-title {
          font-family: 'Fraunces', serif;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--navy-800);
        }

        [data-theme="dark"] .settings-title {
          color: var(--gold-400);
        }

        .setting-group {
          margin-bottom: 16px;
        }

        .setting-label {
          font-size: 12px;
          color: var(--ink-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
          margin-bottom: 6px;
          display: block;
        }

        .setting-input,
        .setting-select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid var(--border);
          border-radius: 6px;
          font-size: 13px;
          background: var(--bg);
          color: var(--ink);
          font-family: inherit;
          transition: all 0.2s;
        }

        .setting-input:focus,
        .setting-select:focus {
          outline: none;
          border-color: var(--gold-400);
          box-shadow: 0 0 0 3px rgba(245, 197, 24, 0.1);
        }

        .toggle-group {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .toggle-btn {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--bg);
          color: var(--ink);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .toggle-btn.active {
          background: var(--gold-400);
          color: var(--navy-900);
          border-color: var(--gold-400);
        }

        .toggle-btn:hover:not(.active) {
          border-color: var(--gold-400);
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }

        .checkbox-group input[type="checkbox"] {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .checkbox-group label {
          font-size: 13px;
          cursor: pointer;
          flex: 1;
        }

        .risk-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--bg-subtle);
          border-radius: 6px;
          margin-top: 8px;
        }

        .risk-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .risk-text {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .card-header {
          padding: 18px 22px;
          border-bottom: 1px solid var(--border-soft);
          display: flex;
          align-items: center;
          justify-content: space-between;
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

        .result-badge {
          display: inline-block;
          min-width: 60px;
          padding: 6px 12px;
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
          font-size: 12px;
        }

        .profit-value {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
          font-size: 14px;
        }

        .profit-positive {
          color: var(--success);
        }

        .profit-negative {
          color: var(--danger);
        }

        .action-btn {
          padding: 6px 12px;
          background: var(--gold-400);
          color: var(--navy-900);
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .action-btn:hover {
          background: var(--gold-500);
          transform: translateY(-1px);
          box-shadow: var(--shadow);
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: var(--bg-card);
          border-radius: 12px;
          padding: 24px;
          max-width: 400px;
          width: 90%;
          box-shadow: var(--shadow-xl);
        }

        .modal-title {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--navy-800);
        }

        [data-theme="dark"] .modal-title {
          color: var(--gold-400);
        }

        .modal-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid var(--border);
          border-radius: 8px;
          font-size: 16px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 16px;
          transition: all 0.2s;
        }

        .modal-input:focus {
          outline: none;
          border-color: var(--gold-400);
          box-shadow: 0 0 0 3px rgba(245, 197, 24, 0.1);
        }

        .modal-buttons {
          display: flex;
          gap: 12px;
        }

        .modal-btn {
          flex: 1;
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .modal-btn.primary {
          background: var(--gold-400);
          color: var(--navy-900);
        }

        .modal-btn.primary:hover {
          background: var(--gold-500);
        }

        .modal-btn.secondary {
          background: var(--bg-subtle);
          color: var(--ink);
          border: 1px solid var(--border);
        }

        .modal-btn.secondary:hover {
          background: var(--border);
        }

        .chart-container {
          padding: 20px 22px;
          height: 300px;
        }
      `}</style>

      <div className="yeekee-container">
        {/* Main content */}
        <div>
          {/* Chart */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">📊 Profit Trend</div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="round" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="targetProfit" stroke="#f5c518" strokeWidth={2} />
                  <Line type="monotone" dataKey="actualProfit" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rounds table */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">⏱️ Recent Rounds</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Round</th>
                    <th>Time</th>
                    <th>Result</th>
                    <th>Total Bets</th>
                    <th>Target Profit</th>
                    <th>Actual Profit</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {yeeKeeRounds.map((round) => (
                    <tr key={round.roundNumber}>
                      <td>#{round.roundNumber}</td>
                      <td>{round.time}</td>
                      <td>
                        <span className="result-badge">{round.result}</span>
                      </td>
                      <td>{round.totalBets.toLocaleString()}</td>
                      <td className="profit-value">{round.targetProfit.toLocaleString()}</td>
                      <td className={`profit-value ${round.actualProfit >= round.targetProfit ? 'profit-positive' : 'profit-negative'}`}>
                        {round.actualProfit.toLocaleString()}
                      </td>
                      <td>
                        <span className="status-badge">{getStatusBadge(round.status)}</span>
                      </td>
                      <td>
                        {round.status === 'pending' && (
                          <button
                            className="action-btn"
                            onClick={() => handleManualOverride(round.roundNumber)}
                          >
                            Set
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Settings panel */}
        <div className="settings-panel">
          <div className="settings-title">⚙️ Settings</div>

          <div className="setting-group">
            <label className="setting-label">Draw Interval</label>
            <div className="toggle-group">
              <button
                className={`toggle-btn ${settings.interval === '5min' ? 'active' : ''}`}
                onClick={() => handleSettingChange('interval', '5min')}
              >
                5 Min
              </button>
              <button
                className={`toggle-btn ${settings.interval === '15min' ? 'active' : ''}`}
                onClick={() => handleSettingChange('interval', '15min')}
              >
                15 Min
              </button>
            </div>
          </div>

          <div className="setting-group">
            <label className="setting-label">Target Profit %</label>
            <input
              type="number"
              className="setting-input"
              value={settings.targetProfitPercentage}
              onChange={(e) => handleSettingChange('targetProfitPercentage', parseInt(e.target.value))}
              min="0"
              max="100"
            />
          </div>

          <div className="setting-group">
            <label className="setting-label">Risk Level</label>
            <select
              className="setting-select"
              value={settings.riskLevel}
              onChange={(e) => handleSettingChange('riskLevel', e.target.value)}
            >
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
            <div className="risk-indicator">
              <div className="risk-dot" style={{ backgroundColor: getRiskColor(settings.riskLevel) }}></div>
              <div className="risk-text">{settings.riskLevel}</div>
            </div>
          </div>

          <div className="setting-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="autoGenerate"
                checked={settings.autoGenerate}
                onChange={(e) => handleSettingChange('autoGenerate', e.target.checked)}
              />
              <label htmlFor="autoGenerate">Auto Generate</label>
            </div>
          </div>

          <div className="setting-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="manualOverride"
                checked={settings.manualOverride}
                onChange={(e) => handleSettingChange('manualOverride', e.target.checked)}
              />
              <label htmlFor="manualOverride">Manual Override</label>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Set Result for Round {selectedRound}</div>
            <input
              type="text"
              className="modal-input"
              placeholder="00000"
              value={manualResult}
              onChange={(e) => setManualResult(e.target.value.replace(/\D/g, '').slice(0, 5))}
              maxLength={5}
              autoFocus
            />
            <div className="modal-buttons">
              <button className="modal-btn secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className="modal-btn primary"
                onClick={submitManualResult}
                disabled={manualResult.length !== 5}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovedYeeKee;
