import React from 'react';
import { Project, SastIssue, Severity, IssueStatus } from '../types';
import { AlertCircle, FileCode, ChevronRight, CheckCircle2, Search, BrainCircuit, ChevronDown, ChevronUp } from 'lucide-react';

interface IssueListProps {
  project: Project;
  onSelectIssue: (issue: SastIssue) => void;
}

export const IssueList: React.FC<IssueListProps> = ({ project, onSelectIssue }) => {
  const [filter, setFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<IssueStatus | 'All'>('All');
  const [expandedInsights, setExpandedInsights] = React.useState<Set<string>>(new Set());

  const toggleInsight = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedInsights(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredIssues = project.issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(filter.toLowerCase()) || 
      issue.filePath.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case Severity.CRITICAL: return 'text-red-500 bg-red-500/10 border-red-500/20';
      case Severity.HIGH: return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case Severity.MEDIUM: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  const tabs = ['All', ...Object.values(IssueStatus)];

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex flex-col space-y-4 mb-6">
        <h2 className="text-2xl font-bold text-white">Vulnerabilities</h2>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Status Tabs */}
            <div className="flex p-1 bg-slate-800 rounded-lg border border-slate-700 overflow-x-auto max-w-full">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setStatusFilter(tab as IssueStatus | 'All')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                            statusFilter === tab
                                ? 'bg-slate-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search issues..." 
                    className="bg-slate-800 border border-slate-700 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full sm:w-64"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex-1">
        <div className="overflow-y-auto h-full">
          <table className="w-full text-left">
            <thead className="bg-slate-900 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm w-32">Severity</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Issue & AI Insights</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Location</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Tool</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Status</th>
                <th className="px-6 py-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredIssues.map((issue) => (
                <tr 
                  key={issue.id} 
                  className="hover:bg-slate-700/50 transition-colors cursor-pointer group"
                  onClick={() => onSelectIssue(issue)}
                >
                  <td className="px-6 py-4 align-top">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}>
                      {issue.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="font-medium text-slate-200">{issue.title}</div>
                    <div className="text-xs text-slate-500 mt-1 mb-2">{issue.ruleId}</div>
                    {issue.aiAnalysis && (
                      <div className="mt-2">
                         <button
                            onClick={(e) => toggleInsight(e, issue.id)}
                            className={`flex items-center space-x-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all border ${
                                expandedInsights.has(issue.id)
                                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                : 'bg-indigo-500/10 text-indigo-400 border-transparent hover:bg-indigo-500/20 hover:border-indigo-500/20'
                            }`}
                         >
                            <BrainCircuit className="w-3.5 h-3.5" />
                            <span>AI Insight</span>
                            {expandedInsights.has(issue.id) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                         </button>

                         {expandedInsights.has(issue.id) && (
                            <div className="mt-2 p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-lg text-sm text-slate-300 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200" onClick={(e) => e.stopPropagation()}>
                                {issue.aiAnalysis.analysis}
                            </div>
                         )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center text-slate-400 text-sm">
                      <FileCode className="w-4 h-4 mr-2 opacity-70 flex-shrink-0" />
                      <span className="font-mono break-all">{issue.filePath}:{issue.startLine}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top text-slate-400 text-sm">
                    {issue.toolName}
                  </td>
                   <td className="px-6 py-4 align-top text-slate-400 text-sm">
                    {issue.status}
                  </td>
                  <td className="px-6 py-4 align-middle text-right">
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredIssues.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No issues found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};