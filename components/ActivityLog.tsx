import React, { useState } from 'react';
import { MOCK_ACTIVITY, ActivityItem } from '../services/mockData';
import { Severity } from '../types';
import { Activity, Search, ScanLine, BrainCircuit, GitBranch, GitPullRequest, Shield, Plug, Filter, Clock, AlertCircle } from 'lucide-react';

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  scan: { icon: <ScanLine className="w-4 h-4" />, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  ai_fix: { icon: <BrainCircuit className="w-4 h-4" />, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  branch: { icon: <GitBranch className="w-4 h-4" />, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  pr: { icon: <GitPullRequest className="w-4 h-4" />, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  rule_change: { icon: <Shield className="w-4 h-4" />, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  integration: { icon: <Plug className="w-4 h-4" />, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
};

export const ActivityLog: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const typeFilters = [
    { id: 'all', label: 'All' },
    { id: 'scan', label: 'Scans' },
    { id: 'ai_fix', label: 'AI Fixes' },
    { id: 'branch', label: 'Branches' },
    { id: 'pr', label: 'Pull Requests' },
    { id: 'rule_change', label: 'Rules' },
  ];

  const filtered = MOCK_ACTIVITY.filter(item => {
    const matchesType = filter === 'all' || item.type === filter;
    const matchesSearch = search === '' || 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Group by date
  const groups: Record<string, ActivityItem[]> = {};
  filtered.forEach(item => {
    const date = new Date(item.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  });

  return (
    <div className="p-8 h-full flex flex-col animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center">
            <Activity className="w-7 h-7 mr-3 text-emerald-400" />
            Activity Log
          </h2>
          <p className="text-slate-400 mt-1">Recent security events, scans, and remediation actions.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <Clock className="w-4 h-4" />
          <span>{MOCK_ACTIVITY.length} events</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex p-1 bg-slate-800 rounded-lg border border-slate-700 overflow-x-auto">
          {typeFilters.map(tf => (
            <button
              key={tf.id}
              onClick={() => setFilter(tf.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                filter === tf.id
                  ? 'bg-slate-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search activity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full text-sm"
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto space-y-8 pb-8">
        {Object.entries(groups).map(([date, items]) => (
          <div key={date}>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 sticky top-0 bg-[#0b1120] py-2 z-10">
              {date}
            </h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-800"></div>
              
              <div className="space-y-1">
                {items.map((item, idx) => {
                  const config = typeConfig[item.type] || typeConfig.scan;
                  return (
                    <div key={item.id} className="relative flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors group">
                      {/* Icon node */}
                      <div className={`relative z-10 p-2 rounded-lg border ${config.bg} ${config.color} shrink-0`}>
                        {config.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                            {item.title}
                          </h4>
                          <span className="text-xs text-slate-500 shrink-0 ml-4">
                            {formatTime(item.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-0.5 line-clamp-2">{item.description}</p>
                        <div className="flex items-center space-x-3 mt-1.5">
                          {item.project && (
                            <span className="text-xs text-slate-500 font-mono bg-slate-800 px-2 py-0.5 rounded">{item.project}</span>
                          )}
                          {item.severity && (
                            <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                              item.severity === Severity.CRITICAL ? 'text-red-400 bg-red-500/10' :
                              item.severity === Severity.HIGH ? 'text-orange-400 bg-orange-500/10' :
                              'text-yellow-400 bg-yellow-500/10'
                            }`}>
                              {item.severity}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No activity matches your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
