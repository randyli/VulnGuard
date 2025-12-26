import React from 'react';
import { ShieldAlert, LayoutDashboard, GitGraph, Settings, Code2, Plus, GitBranch } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'issues', label: 'Vulnerabilities', icon: ShieldAlert },
    { id: 'repository', label: 'Repository', icon: GitBranch },
    { id: 'integrations', label: 'Integrations', icon: GitGraph },
    { id: 'rules', label: 'Rulesets', icon: Code2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col sticky top-0">
      <div className="p-6 flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <ShieldAlert className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">VulnGuard</span>
      </div>

      <div className="px-4 mb-2">
        <button 
          onClick={() => setCurrentView('new-project')}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white group ${currentView === 'new-project' ? 'ring-2 ring-blue-500 border-transparent' : ''}`}
        >
            <Plus size={18} className="text-blue-400 group-hover:text-blue-300" />
            <span className="font-medium text-sm">New Project</span>
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3 text-sm text-slate-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>System Operational</span>
        </div>
      </div>
    </div>
  );
};