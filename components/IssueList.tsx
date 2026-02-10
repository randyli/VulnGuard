import React from 'react';
import { Project, SastIssue, Severity, IssueStatus } from '../types';
import { AlertCircle, FileCode, ChevronRight, CheckCircle2, Search, BrainCircuit, ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface IssueListProps {
  project: Project;
  onSelectIssue: (issue: SastIssue) => void;
}

export const IssueList: React.FC<IssueListProps> = ({ project, onSelectIssue }) => {
  const [filter, setFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<IssueStatus | 'All'>('All');
  const [severityFilter, setSeverityFilter] = React.useState<Set<Severity>>(new Set());
  const [expandedInsights, setExpandedInsights] = React.useState<Set<string>>(new Set());
  const [showSeverityFilter, setShowSeverityFilter] = React.useState(false);

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

  const toggleSeverity = (severity: Severity) => {
    setSeverityFilter(prev => {
      const next = new Set(prev);
      if (next.has(severity)) {
        next.delete(severity);
      } else {
        next.add(severity);
      }
      return next;
    });
  };

  const filteredIssues = project.issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(filter.toLowerCase()) || 
      issue.filePath.toLowerCase().includes(filter.toLowerCase()) ||
      issue.ruleId.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    const matchesSeverity = severityFilter.size === 0 || severityFilter.has(issue.severity);
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case Severity.CRITICAL: return 'text-red-500 bg-red-500/10 border-red-500/20';
      case Severity.HIGH: return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case Severity.MEDIUM: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getStatusIcon = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.OPEN: return <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>;
      case IssueStatus.IN_PROGRESS: return <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block animate-pulse"></span>;
      case IssueStatus.RESOLVED: return <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>;
      case IssueStatus.IGNORED: return <span className="w-2 h-2 rounded-full bg-slate-500 inline-block"></span>;
    }
  };

  const tabs = ['All', ...Object.values(IssueStatus)];

  const severityOptions = [Severity.CRITICAL, Severity.HIGH, Severity.MEDIUM, Severity.LOW];

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Vulnerabilities</h2>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <span>{filteredIssues.length}</span>
            <span>of</span>
            <span>{project.issues.length}</span>
            <span>issues</span>
          </div>
        </div>
        
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

            <div className="flex items-center space-x-3">
              {/* Severity Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowSeverityFilter(!showSeverityFilter)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    severityFilter.size > 0
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Severity</span>
                  {severityFilter.size > 0 && (
                    <span className="bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{severityFilter.size}</span>
                  )}
                </button>

                {showSeverityFilter && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowSeverityFilter(false)}></div>
                    <div className="absolute top-full right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 p-3 animate-fade-in">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1">Filter by Severity</div>
                      {severityOptions.map(sev => (
                        <label
                          key={sev}
                          className="flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={severityFilter.has(sev)}
                            onChange={() => toggleSeverity(sev)}
                            className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                          />
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(sev)}`}>
                            {sev}
                          </span>
                        </label>
                      ))}
                      {severityFilter.size > 0 && (
                        <button
                          onClick={() => setSeverityFilter(new Set())}
                          className="w-full text-xs text-slate-400 hover:text-white mt-2 py-1.5 text-center transition-colors"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </>
                )}
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
                  <td className="px-6 py-4 align-top">
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      {getStatusIcon(issue.status)}
                      <span>{issue.status}</span>
                    </div>
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
