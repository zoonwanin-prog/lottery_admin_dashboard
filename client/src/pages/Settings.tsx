import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, AlertCircle, Bell, Lock, Globe, User } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import LiveStatusBar from '@/components/LiveStatusBar';

interface SystemSettings {
  siteName: string;
  defaultCurrency: string;
  maintenanceMode: boolean;
  autoWithdrawal: boolean;
  maxBetLimit: number;
  minBetLimit: number;
  commissionRate: number;
  notificationEmail: string;
  backupFrequency: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'Lottery Admin System',
    defaultCurrency: 'THB',
    maintenanceMode: false,
    autoWithdrawal: true,
    maxBetLimit: 50000,
    minBetLimit: 10,
    commissionRate: 5,
    notificationEmail: 'admin@lottery.com',
    backupFrequency: 'daily',
  });

  const [savedMessage, setSavedMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    setSavedMessage('Settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleChange = (key: keyof SystemSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <DashboardLayout activeTab="settings">
      <div className="flex flex-col h-full">
        <LiveStatusBar />

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">จัดการการตั้งค่าระบบและการกำหนดค่า</p>
          </div>

          {/* Tabs */}
          <div className="bg-card border border-border rounded-lg shadow-sm">
            <div className="flex border-b border-border">
              {[
                { id: 'general', label: 'General', icon: Globe },
                { id: 'security', label: 'Security', icon: Lock },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'advanced', label: 'Advanced', icon: SettingsIcon },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="p-6 space-y-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleChange('siteName', e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Default Currency</label>
                      <select
                        value={settings.defaultCurrency}
                        onChange={(e) => handleChange('defaultCurrency', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="THB">Thai Baht (฿)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Backup Frequency</label>
                      <select
                        value={settings.backupFrequency}
                        onChange={(e) => handleChange('backupFrequency', e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Min Bet Limit (฿)</label>
                      <input
                        type="number"
                        value={settings.minBetLimit}
                        onChange={(e) => handleChange('minBetLimit', parseFloat(e.target.value))}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Max Bet Limit (฿)</label>
                      <input
                        type="number"
                        value={settings.maxBetLimit}
                        onChange={(e) => handleChange('maxBetLimit', parseFloat(e.target.value))}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Commission Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.commissionRate}
                      onChange={(e) => handleChange('commissionRate', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Applied to all agent transactions</p>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                    <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Security Notice</p>
                      <p>Keep your security settings up to date to protect your system</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Admin Password</label>
                    <button className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors">
                      Change Password
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Two-Factor Authentication</label>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Enable 2FA
                    </button>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">API Keys</label>
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="text-sm font-mono text-foreground">sk_live_4eC39HqLyjWDarhtT657j8Zc</p>
                          <p className="text-xs text-muted-foreground">Live API Key</p>
                        </div>
                        <button className="text-red-600 hover:text-red-700">Revoke</button>
                      </div>
                    </div>
                    <button className="mt-3 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors">
                      Generate New Key
                    </button>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Notification Email</label>
                    <input
                      type="email"
                      value={settings.notificationEmail}
                      onChange={(e) => handleChange('notificationEmail', e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">Email Notifications</p>
                    {[
                      { id: 'large_bet', label: 'Large Bet Alert (> ฿10,000)', checked: true },
                      { id: 'large_payout', label: 'Large Payout Alert (> ฿50,000)', checked: true },
                      { id: 'member_signup', label: 'New Member Signup', checked: false },
                      { id: 'system_error', label: 'System Errors', checked: true },
                      { id: 'daily_report', label: 'Daily Report', checked: true },
                    ].map((notif) => (
                      <label key={notif.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                        <input
                          type="checkbox"
                          defaultChecked={notif.checked}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-foreground">{notif.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced Settings */}
              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                    <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                    <div className="text-sm text-amber-800">
                      <p className="font-semibold mb-1">Advanced Settings</p>
                      <p>Modify these settings only if you know what you are doing</p>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <div>
                        <p className="font-medium text-foreground">Maintenance Mode</p>
                        <p className="text-xs text-muted-foreground">Disable all user access during maintenance</p>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted">
                      <input
                        type="checkbox"
                        checked={settings.autoWithdrawal}
                        onChange={(e) => handleChange('autoWithdrawal', e.target.checked)}
                        className="w-4 h-4 rounded"
                      />
                      <div>
                        <p className="font-medium text-foreground">Auto Withdrawal</p>
                        <p className="text-xs text-muted-foreground">Automatically process withdrawal requests</p>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Database Maintenance</label>
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors text-left">
                        Optimize Database
                      </button>
                      <button className="w-full px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors text-left">
                        Clear Cache
                      </button>
                      <button className="w-full px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors text-left">
                        Export Database
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Button & Message */}
          <div className="flex items-center justify-between">
            <div>
              {savedMessage && (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  <span className="text-sm font-medium">{savedMessage}</span>
                </div>
              )}
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Save size={18} />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
