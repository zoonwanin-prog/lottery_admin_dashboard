import React, { useState } from 'react';
import { Edit2, Lock, Unlock, Plus, Trash2, Settings, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import LiveStatusBar from '@/components/LiveStatusBar';

interface LotteryType {
  id: string;
  name: string;
  prizes: string[];
  rates: { [key: string]: number };
  closedNumbers: string[];
  halfPayNumbers: string[];
  isMarketClosed: boolean;
  maxBetLimit: number;
}

interface RateConfig {
  label: string;
  key: string;
  default: number;
}

const RATE_CONFIGS: RateConfig[] = [
  { label: '3 ตัวบน', key: 'top3', default: 900 },
  { label: '3 ตัวโต๊ด', key: 'middle3', default: 150 },
  { label: '2 ตัวบน', key: 'top2', default: 95 },
  { label: '2 ตัวล่าง', key: 'bottom2', default: 95 },
  { label: 'วิ่งบน', key: 'runTop', default: 3.2 },
  { label: 'วิ่งล่าง', key: 'runBottom', default: 4.2 },
];

export default function LotteryManagement() {
  const [lotteries, setLotteries] = useState<LotteryType[]>([
    {
      id: 'thai-govt',
      name: 'หวยรัฐบาลไทย',
      prizes: ['3 ตัวบน', '3 ตัวโต๊ด', '2 ตัวบน', '2 ตัวล่าง', 'วิ่งบน', 'วิ่งล่าง'],
      rates: { top3: 900, middle3: 150, top2: 95, bottom2: 95, runTop: 3.2, runBottom: 4.2 },
      closedNumbers: ['123', '456'],
      halfPayNumbers: ['789'],
      isMarketClosed: false,
      maxBetLimit: 50000,
    },
    {
      id: 'laos',
      name: 'หวยลาว (พัฒนา)',
      prizes: ['4 ตัว (ชุด)', '3 ตัวบน', '2 ตัวบน', '2 ตัวล่าง'],
      rates: { four: 120000, top3: 850, top2: 92, bottom2: 92 },
      closedNumbers: [],
      halfPayNumbers: [],
      isMarketClosed: false,
      maxBetLimit: 50000,
    },
    {
      id: 'hanoi',
      name: 'หวยฮานอย',
      prizes: ['3 ตัวบน', '3 ตัวโต๊ด', '2 ตัวบน', '2 ตัวล่าง'],
      rates: { top3: 850, middle3: 120, top2: 92, bottom2: 92 },
      closedNumbers: [],
      halfPayNumbers: [],
      isMarketClosed: false,
      maxBetLimit: 50000,
    },
    {
      id: 'stock',
      name: 'หวยหุ้น',
      prizes: ['3 ตัวบน', '2 ตัวบน', '2 ตัวล่าง'],
      rates: { top3: 850, top2: 92, bottom2: 92 },
      closedNumbers: [],
      halfPayNumbers: [],
      isMarketClosed: false,
      maxBetLimit: 50000,
    },
  ]);

  const [selectedLottery, setSelectedLottery] = useState<string | null>(null);
  const [editingRates, setEditingRates] = useState<{ [key: string]: number } | null>(null);
  const [newClosedNumber, setNewClosedNumber] = useState('');
  const [showRateModal, setShowRateModal] = useState(false);
  const [showClosedModal, setShowClosedModal] = useState(false);

  const currentLottery = lotteries.find(l => l.id === selectedLottery);

  const handleUpdateRate = (key: string, value: number) => {
    if (editingRates) {
      setEditingRates({ ...editingRates, [key]: value });
    }
  };

  const handleSaveRates = () => {
    if (selectedLottery && editingRates) {
      setLotteries(lotteries.map(l =>
        l.id === selectedLottery ? { ...l, rates: editingRates } : l
      ));
      setEditingRates(null);
      setShowRateModal(false);
    }
  };

  const handleAddClosedNumber = () => {
    if (selectedLottery && newClosedNumber && currentLottery) {
      setLotteries(lotteries.map(l =>
        l.id === selectedLottery
          ? { ...l, closedNumbers: [...l.closedNumbers, newClosedNumber] }
          : l
      ));
      setNewClosedNumber('');
    }
  };

  const handleRemoveClosedNumber = (number: string) => {
    if (selectedLottery && currentLottery) {
      setLotteries(lotteries.map(l =>
        l.id === selectedLottery
          ? { ...l, closedNumbers: l.closedNumbers.filter(n => n !== number) }
          : l
      ));
    }
  };

  const handleToggleMarketClosed = () => {
    if (selectedLottery) {
      setLotteries(lotteries.map(l =>
        l.id === selectedLottery ? { ...l, isMarketClosed: !l.isMarketClosed } : l
      ));
    }
  };

  const handleToggleHalfPay = (number: string) => {
    if (selectedLottery && currentLottery) {
      const isHalfPay = currentLottery.halfPayNumbers.includes(number);
      setLotteries(lotteries.map(l =>
        l.id === selectedLottery
          ? {
              ...l,
              halfPayNumbers: isHalfPay
                ? l.halfPayNumbers.filter(n => n !== number)
                : [...l.halfPayNumbers, number]
            }
          : l
      ));
    }
  };

  return (
    <DashboardLayout activeTab="lottery">
      <div className="flex flex-col h-full">
        <LiveStatusBar />

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Lottery Management</h1>
            <p className="text-muted-foreground">จัดการประเภทหวย อัตราจ่าย เลขอั้น และการปิดรับแทง</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - Lottery List */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-4">ประเภทหวย</h3>
                <div className="space-y-2">
                  {lotteries.map((lottery) => (
                    <button
                      key={lottery.id}
                      onClick={() => setSelectedLottery(lottery.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                        selectedLottery === lottery.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{lottery.name}</span>
                        {lottery.isMarketClosed && (
                          <Lock size={16} className="flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            {currentLottery ? (
              <div className="lg:col-span-3 space-y-6">
                {/* Market Status Card */}
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground">สถานะตลาด</h3>
                    <button
                      onClick={handleToggleMarketClosed}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentLottery.isMarketClosed
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {currentLottery.isMarketClosed ? (
                        <>
                          <Lock size={18} />
                          ปิดรับแทง
                        </>
                      ) : (
                        <>
                          <Unlock size={18} />
                          เปิดรับแทง
                        </>
                      )}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Max Bet Limit</p>
                      <p className="text-2xl font-bold text-foreground">฿{currentLottery.maxBetLimit.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">เลขอั้นทั้งหมด</p>
                      <p className="text-2xl font-bold text-foreground">{currentLottery.closedNumbers.length}</p>
                    </div>
                  </div>
                </div>

                {/* Rates Configuration */}
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground">อัตราจ่าย (บาทละ)</h3>
                    <button
                      onClick={() => {
                        setEditingRates(currentLottery.rates);
                        setShowRateModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit2 size={18} />
                      แก้ไข
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {currentLottery.prizes.map((prize, idx) => {
                      const rateKey = Object.keys(currentLottery.rates)[idx];
                      return (
                        <div key={rateKey} className="p-3 bg-slate-50 rounded-lg border border-border">
                          <p className="text-xs text-muted-foreground mb-1">{prize}</p>
                          <p className="text-lg font-bold text-foreground">
                            {currentLottery.rates[rateKey]}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Closed Numbers */}
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground">เลขอั้น (Closed Numbers)</h3>
                    <button
                      onClick={() => setShowClosedModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={18} />
                      เพิ่มเลข
                    </button>
                  </div>

                  {currentLottery.closedNumbers.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {currentLottery.closedNumbers.map((number) => (
                        <div
                          key={number}
                          className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                        >
                          <span className="font-mono font-bold text-red-700">{number}</span>
                          <button
                            onClick={() => handleRemoveClosedNumber(number)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-lg text-center text-muted-foreground">
                      ไม่มีเลขอั้น
                    </div>
                  )}
                </div>

                {/* Half Pay Numbers */}
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-foreground mb-4">เลขจ่ายครึ่ง (Half Pay)</h3>
                  <p className="text-sm text-muted-foreground mb-4">จ่ายเพียง 50% ของอัตราปกติ</p>

                  {currentLottery.halfPayNumbers.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {currentLottery.halfPayNumbers.map((number) => (
                        <div
                          key={number}
                          className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
                        >
                          <span className="font-mono font-bold text-amber-700">{number}</span>
                          <button
                            onClick={() => handleToggleHalfPay(number)}
                            className="text-amber-600 hover:text-amber-700 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-lg text-center text-muted-foreground">
                      ไม่มีเลขจ่ายครึ่ง
                    </div>
                  )}
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">เคล็ดลับ:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>เลขอั้น: ปิดรับแทงเลขนี้ทั้งหมด</li>
                      <li>เลขจ่ายครึ่ง: จ่ายเพียง 50% ของอัตราปกติ</li>
                      <li>ปิดรับแทง: ปิดตลาดทั้งหมด ไม่รับแทงเลขใดๆ</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-3 bg-card border border-border rounded-lg p-8 shadow-sm flex items-center justify-center">
                <p className="text-muted-foreground text-lg">เลือกประเภทหวยเพื่อแสดงรายละเอียด</p>
              </div>
            )}
          </div>
        </div>

        {/* Rate Modal */}
        {showRateModal && editingRates && currentLottery && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
              <h3 className="text-lg font-bold text-foreground mb-4">แก้ไขอัตราจ่าย - {currentLottery.name}</h3>
              <div className="space-y-4 mb-6">
                {currentLottery.prizes.map((prize, idx) => {
                  const rateKey = Object.keys(currentLottery.rates)[idx];
                  return (
                    <div key={rateKey}>
                      <label className="text-sm font-medium text-foreground block mb-2">{prize}</label>
                      <input
                        type="number"
                        value={editingRates[rateKey] || 0}
                        onChange={(e) => handleUpdateRate(rateKey, parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRateModal(false);
                    setEditingRates(null);
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSaveRates}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Closed Number Modal */}
        {showClosedModal && currentLottery && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-foreground mb-4">เพิ่มเลขอั้น - {currentLottery.name}</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">หมายเลข</label>
                  <input
                    type="text"
                    value={newClosedNumber}
                    onChange={(e) => setNewClosedNumber(e.target.value)}
                    placeholder="เช่น 123"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowClosedModal(false);
                    setNewClosedNumber('');
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleAddClosedNumber}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  เพิ่ม
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
