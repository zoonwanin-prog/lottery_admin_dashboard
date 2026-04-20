import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LotteryType {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
  totalBets: number;
  totalPayouts: number;
  profit: number;
}

interface PayoutRate {
  type: string;
  rate: number;
  editable: boolean;
}

interface ClosedNumber {
  number: string;
  type: 'closed' | 'half-pay';
}

const ImprovedLottery: React.FC = () => {
  const [selectedLottery, setSelectedLottery] = useState('thai-govt');
  const [closedNumbers, setClosedNumbers] = useState<ClosedNumber[]>([
    { number: '123', type: 'closed' },
    { number: '456', type: 'half-pay' },
  ]);
  const [newNumber, setNewNumber] = useState('');
  const [numberType, setNumberType] = useState<'closed' | 'half-pay'>('closed');
  const [showModal, setShowModal] = useState(false);
  const [editingRate, setEditingRate] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const lotteries: LotteryType[] = [
    { id: 'thai-govt', name: 'Thai Govt', icon: '🇹🇭', isActive: true, totalBets: 125400, totalPayouts: 85300, profit: 40100 },
    { id: 'laos', name: 'Laos', icon: '🇱🇦', isActive: true, totalBets: 98200, totalPayouts: 62100, profit: 36100 },
    { id: 'hanoi', name: 'Hanoi', icon: '🇻🇳', isActive: true, totalBets: 76500, totalPayouts: 51200, profit: 25300 },
    { id: 'stock', name: 'Stock', icon: '📈', isActive: false, totalBets: 0, totalPayouts: 0, profit: 0 },
  ];

  const payoutRates: PayoutRate[] = [
    { type: '3 Digits Top', rate: 800, editable: true },
    { type: '3 Digits Bottom', rate: 800, editable: true },
    { type: '2 Digits Top', rate: 95, editable: true },
    { type: '2 Digits Bottom', rate: 95, editable: true },
    { type: 'Running', rate: 400, editable: true },
    { type: 'Toad', rate: 160, editable: true },
  ];

  const chartData = [
    { lottery: 'Thai', bets: 125400, payouts: 85300 },
    { lottery: 'Laos', bets: 98200, payouts: 62100 },
    { lottery: 'Hanoi', bets: 76500, payouts: 51200 },
  ];

  const currentLottery = lotteries.find(l => l.id === selectedLottery);

  const handleAddNumber = () => {
    if (newNumber.length === 3) {
      setClosedNumbers([...closedNumbers, { number: newNumber, type: numberType }]);
      setNewNumber('');
      setShowModal(false);
    }
  };

  const handleRemoveNumber = (index: number) => {
    setClosedNumbers(closedNumbers.filter((_, i) => i !== index));
  };

  const handleUpdateRate = (index: number, newRate: number) => {
    const updatedRates = [...payoutRates];
    updatedRates[index].rate = newRate;
    setEditingRate(null);
  };

  const toggleLotteryStatus = (id: string) => {
    // In a real app, this would update the backend
    console.log(`Toggle lottery ${id}`);
  };

  return (
    <div className="improved-lottery">
      <style>{`
        .improved-lottery {
          font-family: 'Prompt', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .lottery-selector {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        @media (max-width: 1024px) {
          .lottery-selector {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .lottery-selector {
            grid-template-columns: 1fr;
          }
        }

        .lottery-card {
          background: var(--bg-card);
          border: 2px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .lottery-card:hover {
          border-color: var(--gold-400);
        }

        .lottery-card.active {
          border-color: var(--gold-400);
          background: linear-gradient(135deg, rgba(245, 197, 24, 0.05) 0%, transparent 100%);
        }

        .lottery-card.inactive {
          opacity: 0.6;
        }

        .lottery-toggle {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--bg-subtle);
          border: 2px solid var(--border);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: all 0.2s;
        }

        .lottery-toggle:hover {
          border-color: var(--gold-400);
        }

        .lottery-toggle.active {
          background: var(--gold-400);
          border-color: var(--gold-400);
          color: var(--navy-900);
        }

        .lottery-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .lottery-name {
          font-family: 'Fraunces', serif;
          font-size: 16px;
          font-weight: 600;
          color: var(--navy-800);
          margin-bottom: 8px;
        }

        [data-theme="dark"] .lottery-name {
          color: var(--gold-400);
        }

        .lottery-stats {
          font-size: 12px;
          color: var(--ink-muted);
          line-height: 1.6;
        }

        .stat-value {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
          color: var(--ink);
        }

        .grid-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        @media (max-width: 1024px) {
          .grid-2col {
            grid-template-columns: 1fr;
          }
        }

        .card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
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

        .card-action {
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

        .card-action:hover {
          background: var(--gold-500);
          transform: translateY(-1px);
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

        .rate-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .rate-value {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
          font-size: 14px;
          min-width: 60px;
        }

        .rate-input {
          width: 80px;
          padding: 6px 10px;
          border: 1px solid var(--border);
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 600;
        }

        .rate-input:focus {
          outline: none;
          border-color: var(--gold-400);
        }

        .rate-edit-btn {
          padding: 4px 8px;
          background: var(--bg-subtle);
          border: 1px solid var(--border);
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .rate-edit-btn:hover {
          border-color: var(--gold-400);
        }

        .number-badge {
          display: inline-block;
          padding: 4px 10px;
          background: var(--navy-800);
          color: var(--gold-400);
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          font-size: 13px;
          border-radius: 6px;
          margin-right: 8px;
          margin-bottom: 8px;
        }

        .number-badge.half-pay {
          background: rgba(245, 197, 24, 0.2);
          border: 1px solid var(--gold-400);
        }

        .remove-btn {
          padding: 2px 6px;
          background: var(--danger);
          color: white;
          border: none;
          border-radius: 3px;
          font-size: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .remove-btn:hover {
          background: #dc2626;
        }

        .numbers-list {
          padding: 18px 22px;
          min-height: 100px;
        }

        .chart-container {
          padding: 20px 22px;
          height: 300px;
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

        .modal-group {
          margin-bottom: 16px;
        }

        .modal-label {
          font-size: 12px;
          color: var(--ink-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
          margin-bottom: 8px;
          display: block;
        }

        .modal-input,
        .modal-select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-align: center;
        }

        .modal-input:focus,
        .modal-select:focus {
          outline: none;
          border-color: var(--gold-400);
          box-shadow: 0 0 0 3px rgba(245, 197, 24, 0.1);
        }

        .modal-buttons {
          display: flex;
          gap: 12px;
          margin-top: 20px;
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

        .modal-btn.primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-btn.secondary {
          background: var(--bg-subtle);
          color: var(--ink);
          border: 1px solid var(--border);
        }

        .modal-btn.secondary:hover {
          background: var(--border);
        }
      `}</style>

      {/* Lottery selector */}
      <div className="lottery-selector">
        {lotteries.map((lottery) => (
          <div
            key={lottery.id}
            className={`lottery-card ${selectedLottery === lottery.id ? 'active' : ''} ${!lottery.isActive ? 'inactive' : ''}`}
            onClick={() => setSelectedLottery(lottery.id)}
          >
            <div
              className={`lottery-toggle ${lottery.isActive ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleLotteryStatus(lottery.id);
              }}
            >
              {lottery.isActive ? '✓' : '○'}
            </div>
            <div className="lottery-icon">{lottery.icon}</div>
            <div className="lottery-name">{lottery.name}</div>
            <div className="lottery-stats">
              <div>Bets: <span className="stat-value">{lottery.totalBets.toLocaleString()}</span></div>
              <div>Payouts: <span className="stat-value">{lottery.totalPayouts.toLocaleString()}</span></div>
              <div>Profit: <span className="stat-value" style={{ color: lottery.profit > 0 ? '#10b981' : '#ef4444' }}>
                {lottery.profit > 0 ? '+' : ''}{lottery.profit.toLocaleString()}
              </span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid-2col">
        {/* Payout rates */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">💰 Payout Rates</div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Rate</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payoutRates.map((rate, idx) => (
                  <tr key={idx}>
                    <td>{rate.type}</td>
                    <td>
                      <div className="rate-cell">
                        {editingRate === `rate-${idx}` ? (
                          <input
                            type="number"
                            className="rate-input"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            autoFocus
                          />
                        ) : (
                          <span className="rate-value">{rate.rate}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {editingRate === `rate-${idx}` ? (
                        <button
                          className="rate-edit-btn"
                          onClick={() => {
                            handleUpdateRate(idx, parseInt(editingValue));
                            setEditingRate(null);
                          }}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="rate-edit-btn"
                          onClick={() => {
                            setEditingRate(`rate-${idx}`);
                            setEditingValue(rate.rate.toString());
                          }}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Closed numbers */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🔒 Closed Numbers</div>
            <button className="card-action" onClick={() => setShowModal(true)}>
              + Add
            </button>
          </div>
          <div className="numbers-list">
            {closedNumbers.length === 0 ? (
              <p style={{ color: 'var(--ink-muted)', fontSize: '13px' }}>No closed numbers</p>
            ) : (
              closedNumbers.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '8px' }}>
                  <span className={`number-badge ${item.type === 'half-pay' ? 'half-pay' : ''}`}>
                    {item.number} {item.type === 'half-pay' ? '(50%)' : ''}
                  </span>
                  <button className="remove-btn" onClick={() => handleRemoveNumber(idx)}>
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header">
          <div className="card-title">📊 Lottery Comparison</div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lottery" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bets" fill="#f5c518" />
              <Bar dataKey="payouts" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Add Closed Number</div>
            <div className="modal-group">
              <label className="modal-label">Number (3 digits)</label>
              <input
                type="text"
                className="modal-input"
                placeholder="000"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value.replace(/\D/g, '').slice(0, 3))}
                maxLength={3}
                autoFocus
              />
            </div>
            <div className="modal-group">
              <label className="modal-label">Type</label>
              <select
                className="modal-select"
                value={numberType}
                onChange={(e) => setNumberType(e.target.value as 'closed' | 'half-pay')}
              >
                <option value="closed">Closed</option>
                <option value="half-pay">Half-Pay (50%)</option>
              </select>
            </div>
            <div className="modal-buttons">
              <button className="modal-btn secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className="modal-btn primary"
                onClick={handleAddNumber}
                disabled={newNumber.length !== 3}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovedLottery;
