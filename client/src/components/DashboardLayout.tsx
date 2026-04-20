import React, { useState } from 'react';
import { Menu, X, BarChart3, Settings, Users, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

export default function DashboardLayout({ children, activeTab = 'dashboard' }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'lottery', label: 'Lottery Management', icon: TrendingUp },
    { id: 'yee-kee', label: 'Yee-Kee Special', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <span className="text-sidebar-primary-foreground font-bold text-lg">L</span>
              </div>
              <h1 className="text-xl font-bold">Lottery Admin</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                  )}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent/10">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">admin@lottery.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 flex justify-center lg:justify-start">
            <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-muted-foreground">Live</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
