import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Project, Severity } from '../types';

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

  project.issues.forEach(issue => {
    severityCounts[issue.severity]++;
  });

  const pieData = [
    { name: 'Critical', value: severityCounts[Severity.CRITICAL], color: '#ef4444' },
    { name: 'High', value: severityCounts[Severity.HIGH], color: '#f97316' },
    { name: 'Medium', value: severityCounts[Severity.MEDIUM], color: '#eab308' },
    { name: 'Low', value: severityCounts[Severity.LOW], color: '#3b82f6' },
  ];

  const barData = [
    { name: 'SQL Injection', count: 12 },
    { name: 'XSS', count: 8 },
    { name: 'Auth Broken', count: 5 },
    { name: 'Misconfig', count: 15 },
  ];

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Security Overview</h2>
          <p className="text-slate-400 mt-1">Project: <span className="text-blue-400">{project.name}</span></p>
        </div>
        <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-sm">Last Scan: </span>
            <span className="text-slate-200 font-mono text-sm">{new Date(project.lastScan).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Issues" value={project.issues.length} color="text-white" />
        <StatCard title="Critical" value={severityCounts[Severity.CRITICAL]} color="text-red-500" />
        <StatCard title="High" value={severityCounts[Severity.HIGH]} color="text-orange-500" />
        <StatCard title="Remediation Rate" value="84%" color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Severity Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
              {pieData.map(d => (
                  <div key={d.name} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                      <span className="text-sm text-slate-400">{d.name}</span>
                  </div>
              ))}
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Top Vulnerability Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={100} />
                <Tooltip 
                    cursor={{fill: '#334155', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }: { title: string, value: number | string, color: string }) => (
  <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col justify-between hover:bg-slate-800 transition-colors">
    <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</span>
    <span className={`text-4xl font-bold mt-2 ${color}`}>{value}</span>
  </div>
);
