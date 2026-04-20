import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Lock, Unlock, Search, Filter, Eye, EyeOff } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import LiveStatusBar from '@/components/LiveStatusBar';

interface Member {
  id: string;
  username: string;
  email: string;
  phone: string;
  credit: number;
  totalBets: number;
  totalWinnings: number;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  role: 'member' | 'agent' | 'sub-agent';
  lastLogin: string;
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: 'M001',
      username: 'john_doe',
      email: 'john@example.com',
      phone: '081-234-5678',
      credit: 50000,
      totalBets: 250000,
      totalWinnings: 180000,
      joinDate: '2025-01-15',
      status: 'active',
      role: 'member',
      lastLogin: '2026-04-20 14:30',
    },
    {
      id: 'M002',
      username: 'jane_smith',
      email: 'jane@example.com',
      phone: '081-345-6789',
      credit: 75000,
      totalBets: 380000,
      totalWinnings: 280000,
      joinDate: '2024-11-20',
      status: 'active',
      role: 'agent',
      lastLogin: '2026-04-20 15:45',
    },
    {
      id: 'M003',
      username: 'bob_wilson',
      email: 'bob@example.com',
      phone: '081-456-7890',
      credit: 30000,
      totalBets: 120000,
      totalWinnings: 85000,
      joinDate: '2026-02-10',
      status: 'active',
      role: 'member',
      lastLogin: '2026-04-19 10:15',
    },
    {
      id: 'M004',
      username: 'alice_brown',
      email: 'alice@example.com',
      phone: '081-567-8901',
      credit: 0,
      totalBets: 45000,
      totalWinnings: 32000,
      joinDate: '2026-03-05',
      status: 'suspended',
      role: 'member',
      lastLogin: '2026-04-15 08:20',
    },
    {
      id: 'M005',
      username: 'agent_pro',
      email: 'agent@example.com',
      phone: '081-678-9012',
      credit: 150000,
      totalBets: 850000,
      totalWinnings: 620000,
      joinDate: '2024-08-12',
      status: 'active',
      role: 'agent',
      lastLogin: '2026-04-20 16:00',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'credit'>('add');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditAction, setCreditAction] = useState<'add' | 'deduct'>('add');

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleOpenCreditModal = (member: Member) => {
    setSelectedMember(member);
    setModalMode('credit');
    setShowModal(true);
    setCreditAmount('');
  };

  const handleUpdateCredit = () => {
    if (selectedMember && creditAmount) {
      const amount = parseFloat(creditAmount);
      const newCredit = creditAction === 'add'
        ? selectedMember.credit + amount
        : Math.max(0, selectedMember.credit - amount);

      setMembers(members.map(m =>
        m.id === selectedMember.id ? { ...m, credit: newCredit } : m
      ));
      setShowModal(false);
      setCreditAmount('');
    }
  };

  const handleToggleStatus = (memberId: string) => {
    setMembers(members.map(m =>
      m.id === memberId
        ? { ...m, status: m.status === 'active' ? 'suspended' : 'active' }
        : m
    ));
  };

  const handleDeleteMember = (memberId: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      setMembers(members.filter(m => m.id !== memberId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'inactive':
        return 'bg-slate-100 text-slate-700';
      case 'suspended':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'agent':
        return 'bg-blue-100 text-blue-700';
      case 'sub-agent':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <DashboardLayout activeTab="members">
      <div className="flex flex-col h-full">
        <LiveStatusBar />

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Members Management</h1>
              <p className="text-muted-foreground">จัดการสมาชิก ตัวแทน และเครดิต</p>
            </div>
            <button
              onClick={() => {
                setModalMode('add');
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Add Member
            </button>
          </div>

          {/* Search & Filter */}
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm space-y-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    placeholder="Search by username or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="member">Member</option>
                <option value="agent">Agent</option>
                <option value="sub-agent">Sub-Agent</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {filteredMembers.length} of {members.length} members
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Username</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Credit</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Total Bets</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Last Login</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold text-foreground">{member.username}</p>
                          <p className="text-xs text-muted-foreground">{member.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">{member.email}</td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-foreground">฿{member.credit.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Available</p>
                      </td>
                      <td className="py-3 px-4 text-foreground">฿{member.totalBets.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getRoleColor(member.role)}`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{member.lastLogin}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenCreditModal(member)}
                            title="Manage Credit"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(member.id)}
                            title={member.status === 'active' ? 'Suspend' : 'Activate'}
                            className={`p-2 rounded-lg transition-colors ${
                              member.status === 'active'
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {member.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            title="Delete"
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
              <p className="text-sm text-muted-foreground mb-2">Total Members</p>
              <p className="text-2xl font-bold text-foreground">{members.length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
              <p className="text-sm text-muted-foreground mb-2">Active Members</p>
              <p className="text-2xl font-bold text-green-600">{members.filter(m => m.status === 'active').length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
              <p className="text-sm text-muted-foreground mb-2">Total Credit</p>
              <p className="text-2xl font-bold text-foreground">฿{members.reduce((sum, m) => sum + m.credit, 0).toLocaleString()}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
              <p className="text-sm text-muted-foreground mb-2">Agents</p>
              <p className="text-2xl font-bold text-blue-600">{members.filter(m => m.role === 'agent').length}</p>
            </div>
          </div>
        </div>

        {/* Credit Modal */}
        {showModal && modalMode === 'credit' && selectedMember && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-foreground mb-4">Manage Credit - {selectedMember.username}</h3>
              <div className="space-y-4 mb-6">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Current Credit</p>
                  <p className="text-2xl font-bold text-foreground">฿{selectedMember.credit.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Action</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCreditAction('add')}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                        creditAction === 'add'
                          ? 'bg-green-600 text-white'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      Add Credit
                    </button>
                    <button
                      onClick={() => setCreditAction('deduct')}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                        creditAction === 'deduct'
                          ? 'bg-red-600 text-white'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      Deduct Credit
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Amount</label>
                  <input
                    type="number"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setCreditAmount('');
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCredit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
