import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, Area, AreaChart, CartesianGrid, Legend } from 'recharts';
import { Project, Severity, IssueStatus } from '../types';
import { MOCK_SCAN_HISTORY } from '../services/mockData';
import { ShieldAlert, ShieldCheck, AlertTriangle, TrendingDown, Activity, Clock, ArrowDownRight, ArrowUpRight, Zap } from 'lucide-react';

interface DashboardProps {
  project: Project;
}

export const Dashboard: React.FC<DashboardProps> = ({ project }) => {
  const severityCounts = {
    [Severity.CRITICAL]: 0,
    [Severity.HIGH]: 0,
    [Severity.MEDIUM]: 0,
    [Severity.LOW]: 0,
    [Severity.INFO]: 0,
  };

  const statusCounts = {
    [IssueStatus.OPEN]: 0,
    [IssueStatus.IN_PROGRESS]: 0,
    [IssueStatus.RESOLVED]: 0,
    [IssueStatus.IGNORED]: 0,
  };

  project.issues.forEach(issue => {
    severityCounts[issue.severity]++;
    statusCounts[issue.status]++;
  });

  const totalIssues = project.issues.length;
  const resolvedCount = statusCounts[IssueStatus.RESOLVED];
  const remediationRate = totalIssues > 0 ? Math.round((resolvedCount / totalIssues) * 100) : 0;
  const openCritical = project.issues.filter(i => i.severity === Severity.CRITICAL && i.status === IssueStatus.OPEN).length;
  const aiAnalyzed = project.issues.filter(i => i.aiAnalysis).length;

  const pieData = [
    { name: 'Critical', value: severityCounts[Severity.CRITICAL], color: '#ef4444' },
    { name: 'High', value: severityCounts[Severity.HIGH], color: '#f97316' },
    { name: 'Medium', value: severityCounts[Severity.MEDIUM], color: '#eab308' },
    { name: 'Low', value: severityCounts[Severity.LOW], color: '#3b82f6' },
  ].filter(d => d.value > 0);

  const statusPieData = [
    { name: 'Open', value: statusCounts[IssueStatus.OPEN], color: '#ef4444' },
    { name: 'In Progress', value: statusCounts[IssueStatus.IN_PROGRESS], color: '#f59e0b' },
    { name: 'Resolved', value: statusCounts[IssueStatus.RESOLVED], color: '#10b981' },
    { name: 'Ignored', value: statusCounts[IssueStatus.IGNORED], color: '#6b7280' },
  ].filter(d => d.value > 0);

  // Compute bar chart from actual issue data
  const ruleCategories: Record<string, number> = {};
  project.issues.forEach(issue => {
    const label = issue.ruleId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    ruleCategories[label] = (ruleCategories[label] || 0) + 1;
  });
  const barData = Object.entries(ruleCategories)
    .map(([name, count]) => ({ name: name.length > 16 ? name.substring(0, 14) + '..' : name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Tool breakdown
  const toolCounts: Record<string, number> = {};
  project.issues.forEach(issue => {
    toolCounts[issue.toolName] = (toolCounts[issue.toolName] || 0) + 1;
  });
  const toolData = Object.entries(toolCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Security Overview</h2>
          <p className="text-slate-400 mt-1">Project: <span className="text-blue-400">{project.name}</span></p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400 text-sm">Last Scan: </span>
              <span className="text-slate-200 font-mono text-sm">{new Date(project.lastScan).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title="Total Issues" 
          value={totalIssues} 
          icon={<Activity className="w-5 h-5" />}
          iconBg="bg-slate-700" 
          iconColor="text-slate-300"
          subtitle={`${statusCounts[IssueStatus.OPEN]} open`}
        />
        <StatCard 
          title="Critical" 
          value={severityCounts[Severity.CRITICAL]} 
          icon={<ShieldAlert className="w-5 h-5" />}
          iconBg="bg-red-500/10" 
          iconColor="text-red-500"
          subtitle={`${openCritical} require action`}
          valueColor="text-red-500"
        />
        <StatCard 
          title="High" 
          value={severityCounts[Severity.HIGH]} 
          icon={<AlertTriangle className="w-5 h-5" />}
          iconBg="bg-orange-500/10" 
          iconColor="text-orange-500"
          valueColor="text-orange-500"
        />
        <StatCard 
          title="Remediation Rate" 
          value={`${remediationRate}%`} 
          icon={<TrendingDown className="w-5 h-5" />}
          iconBg="bg-emerald-500/10" 
          iconColor="text-emerald-500"
          subtitle={`${resolvedCount} resolved`}
          valueColor="text-emerald-500"
        />
        <StatCard 
          title="AI Analyzed" 
          value={aiAnalyzed} 
          icon={<Zap className="w-5 h-5" />}
          iconBg="bg-indigo-500/10" 
          iconColor="text-indigo-400"
          subtitle={`of ${totalIssues} issues`}
          valueColor="text-indigo-400"
        />
      </div>

      {/* Trend Chart */}
      <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 mb-1">Vulnerability Trend</h3>
        <p className="text-sm text-slate-500 mb-6">Issue count over the last 7 days across all severity levels</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_SCAN_HISTORY}>
              <defs>
                <linearGradient id="gradCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradMedium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={(v) => v.split('-').slice(1).join('/')} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="critical" stroke="#ef4444" fill="url(#gradCritical)" strokeWidth={2} name="Critical" />
              <Area type="monotone" dataKey="high" stroke="#f97316" fill="url(#gradHigh)" strokeWidth={2} name="High" />
              <Area type="monotone" dataKey="medium" stroke="#eab308" fill="url(#gradMedium)" strokeWidth={2} name="Medium" />
              <Line type="monotone" dataKey="low" stroke="#3b82f6" strokeWidth={2} dot={false} name="Low" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Severity Distribution */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Severity Distribution</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-xs text-slate-400">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Status Breakdown</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-s-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {statusPieData.map(d => (
              <div key={d.name} className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-xs text-slate-400">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tool Breakdown */}
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Scanner Tools</h3>
          <div className="space-y-4 mt-4">
            {toolData.map(tool => (
              <div key={tool.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-300 font-medium">{tool.name}</span>
                  <span className="text-slate-500">{tool.count} issues</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500" 
                    style={{ width: `${Math.max(10, (tool.count / totalIssues) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          {toolData.length === 0 && (
            <div className="text-center text-slate-500 py-8">No scanner data</div>
          )}
        </div>
      </div>

      {/* Vulnerability Categories Bar Chart */}
      {barData.length > 0 && (
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Vulnerability Categories</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={120} tick={{ fontSize: 12 }} />
                <Tooltip 
                    cursor={{fill: '#334155', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  subtitle?: string;
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconBg, iconColor, subtitle, valueColor = 'text-white' }) => (
  <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors group">
    <div className="flex items-center justify-between mb-3">
      <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{title}</span>
      <div className={`p-2 rounded-lg ${iconBg} ${iconColor} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
    <span className={`text-3xl font-bold ${valueColor}`}>{value}</span>
    {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
  </div>
);
