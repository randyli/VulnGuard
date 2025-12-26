import React from 'react';
import { Project, SastIssue, Severity } from '../types';
import { AlertCircle, FileCode, ChevronRight, CheckCircle2, Search } from 'lucide-react';

interface IssueListProps {
  project: Project;
  onSelectIssue: (issue: SastIssue) => void;
}

export const IssueList: React.FC<IssueListProps> = ({ project, onSelectIssue }) => {
  const [filter, setFilter] = React.useState('');

  const filteredIssues = project.issues.filter(issue => 
    issue.title.toLowerCase().includes(filter.toLowerCase()) || 
    issue.filePath.toLowerCase().includes(filter.toLowerCase())
  );

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case Severity.CRITICAL: return 'text-red-500 bg-red-500/10 border-red-500/20';
      case Severity.HIGH: return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case Severity.MEDIUM: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Vulnerabilities</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search issues..." 
            className="bg-slate-800 border border-slate-700 text-slate-200 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex-1">
        <div className="overflow-y-auto h-full">
          <table className="w-full text-left">
            <thead className="bg-slate-900 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Severity</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Issue</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Location</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Tool</th>
                <th className="px-6 py-4 text-slate-400 font-medium text-sm">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredIssues.map((issue) => (
                <tr 
                  key={issue.id} 
                  className="hover:bg-slate-700/50 transition-colors cursor-pointer group"
                  onClick={() => onSelectIssue(issue)}
                >
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}>
                      {issue.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-200">{issue.title}</div>
                    <div className="text-xs text-slate-500 mt-1">{issue.ruleId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-slate-400 text-sm">
                      <FileCode className="w-4 h-4 mr-2 opacity-70" />
                      <span className="font-mono">{issue.filePath}:{issue.startLine}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {issue.toolName}
                  </td>
                   <td className="px-6 py-4 text-slate-400 text-sm">
                    {issue.status}
                  </td>
                  <td className="px-6 py-4 text-right">
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
