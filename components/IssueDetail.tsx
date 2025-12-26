import React, { useState } from 'react';
import { SastIssue, AIFixResponse, Severity } from '../types';
import { analyzeIssueWithGemini } from '../services/geminiService';
import { createBranch } from '../services/gitService';
import { ArrowLeft, BrainCircuit, GitPullRequest, Copy, Check, Terminal, ExternalLink, CheckCircle2, GitBranch } from 'lucide-react';

interface IssueDetailProps {
  issue: SastIssue;
  onBack: () => void;
}

export const IssueDetail: React.FC<IssueDetailProps> = ({ issue, onBack }) => {
  // Initialize with existing analysis if available
  const [aiAnalysis, setAiAnalysis] = useState<AIFixResponse | null>(issue.aiAnalysis || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [prStatus, setPrStatus] = useState<'idle' | 'creating' | 'created'>('idle');
  const [branchStatus, setBranchStatus] = useState<'idle' | 'creating' | 'created'>('idle');

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeIssueWithGemini(issue);
      setAiAnalysis(result);
    } catch (err: any) {
      setError(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBranch = async () => {
      setBranchStatus('creating');
      const branchName = `fix/${issue.ruleId.toLowerCase().replace(/_/g, '-')}-${issue.id.split('_')[1]}`;
      await createBranch('current', branchName);
      setBranchStatus('created');
  };

  const handleCreatePR = () => {
    setPrStatus('creating');
    setTimeout(() => {
        setPrStatus('created');
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityBadge = (severity: Severity) => {
      const colors = {
          [Severity.CRITICAL]: 'bg-red-500 text-white',
          [Severity.HIGH]: 'bg-orange-500 text-white',
          [Severity.MEDIUM]: 'bg-yellow-500 text-black',
          [Severity.LOW]: 'bg-blue-500 text-white',
          [Severity.INFO]: 'bg-slate-500 text-white',
      }
      return <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${colors[severity]}`}>{severity}</span>
  }

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-200 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Issues
        </button>
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center space-x-3 mb-2">
                    {getSeverityBadge(issue.severity)}
                    <span className="font-mono text-slate-500 text-sm">{issue.ruleId}</span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">{issue.title}</h1>
                <p className="text-slate-400 max-w-3xl">{issue.description}</p>
            </div>
            <div className="flex space-x-3">
                 <button className="px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center">
                    <ExternalLink className="w-4 h-4 mr-2" /> View File
                </button>
            </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Code Context */}
        <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="px-4 py-3 bg-slate-950 border-b border-slate-700 flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                        <Terminal className="w-4 h-4" />
                        <span className="font-mono">{issue.filePath}</span>
                    </div>
                    <span className="text-xs text-slate-500">Lines {issue.startLine}-{issue.endLine || issue.startLine}</span>
                </div>
                <div className="p-4 overflow-x-auto bg-[#0d1117]">
                    <pre className="font-mono text-sm text-slate-300">
                        <code>{issue.snippet}</code>
                    </pre>
                </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-semibold mb-4 text-white">Issue Details</h3>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <dt className="text-slate-500 mb-1">Tool</dt>
                        <dd className="font-medium">{issue.toolName}</dd>
                    </div>
                     <div>
                        <dt className="text-slate-500 mb-1">Location</dt>
                        <dd className="font-medium truncate">{issue.filePath}</dd>
                    </div>
                </dl>
            </div>
        </div>

        {/* Right Column: AI Analysis */}
        <div className="space-y-6">
            {!aiAnalysis ? (
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-xl p-8 text-center">
                    <BrainCircuit className="w-16 h-16 mx-auto text-indigo-400 mb-4 opacity-80" />
                    <h3 className="text-xl font-bold text-white mb-2">AI Remediation Assistant</h3>
                    <p className="text-slate-400 mb-6">Generate an explanation and a secure code fix for this vulnerability using Gemini.</p>
                    
                    {loading ? (
                         <div className="flex items-center justify-center space-x-3 text-indigo-400">
                            <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                            <span>Analyzing Vulnerability...</span>
                         </div>
                    ) : (
                         <button 
                            onClick={handleAnalyze}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-indigo-600/20 flex items-center mx-auto"
                        >
                            <BrainCircuit className="w-5 h-5 mr-2" />
                            Generate Fix Suggestion
                        </button>
                    )}
                    {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    {/* Analysis Card */}
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                             <BrainCircuit className="w-5 h-5 mr-2 text-indigo-400" />
                             Analysis
                        </h3>
                        <p className="text-slate-300 leading-relaxed mb-4">{aiAnalysis.analysis}</p>
                         <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-2">Why this works</h4>
                        <p className="text-slate-300 text-sm leading-relaxed">{aiAnalysis.explanation}</p>
                    </div>

                    {/* Code Fix Card */}
                    <div className="bg-slate-800 rounded-xl border border-green-500/30 overflow-hidden relative">
                        <div className="px-4 py-3 bg-green-900/20 border-b border-green-500/20 flex justify-between items-center">
                            <span className="text-green-400 font-medium text-sm flex items-center">
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Suggested Fix
                            </span>
                            <button 
                                onClick={() => copyToClipboard(aiAnalysis.suggestedFix)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-400"/> : <Copy className="w-4 h-4"/>}
                            </button>
                        </div>
                        <div className="p-4 bg-[#0d1117] overflow-x-auto">
                            <pre className="text-sm font-mono text-green-300">
                                <code>{aiAnalysis.suggestedFix}</code>
                            </pre>
                        </div>
                    </div>

                    {/* Action Card */}
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                         <h4 className="font-medium text-white mb-4">Remediation Actions</h4>
                         
                         <div className="flex flex-col sm:flex-row gap-4">
                            {/* Create Branch Button */}
                             <button 
                                onClick={handleCreateBranch}
                                disabled={branchStatus !== 'idle'}
                                className={`flex-1 px-4 py-2.5 rounded-lg font-medium flex items-center justify-center transition-all ${
                                    branchStatus === 'created'
                                    ? 'bg-slate-700 text-green-400 border border-green-500/30 cursor-default'
                                    : branchStatus === 'creating'
                                    ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-wait'
                                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600'
                                }`}
                             >
                                 {branchStatus === 'idle' && <><GitBranch className="w-4 h-4 mr-2" /> Create Fix Branch</>}
                                 {branchStatus === 'creating' && <span className="animate-pulse">Creating Branch...</span>}
                                 {branchStatus === 'created' && <><Check className="w-4 h-4 mr-2" /> Branch Created</>}
                             </button>

                             {/* Create PR Button */}
                             <button 
                                onClick={handleCreatePR}
                                disabled={prStatus !== 'idle' || branchStatus !== 'created'} // Enforce branch creation first for realism? Or let them tap it anyway for demo fluidity. Let's assume branch auto-created if skipped, but disabling looks better. Actually, users might want to skip the explicit step in a demo. I'll enable it but if branch not created, maybe just do both. For simplicity, just enable.
                                className={`flex-1 px-4 py-2.5 rounded-lg font-medium flex items-center justify-center transition-all ${
                                    prStatus === 'created' 
                                    ? 'bg-green-600 text-white cursor-default' 
                                    : prStatus === 'creating'
                                    ? 'bg-slate-700 text-slate-300 cursor-wait'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                                }`}
                             >
                                {prStatus === 'idle' && <><GitPullRequest className="w-4 h-4 mr-2" /> Create Merge Request</>}
                                {prStatus === 'creating' && <span className="animate-pulse">Creating MR...</span>}
                                {prStatus === 'created' && <><Check className="w-4 h-4 mr-2" /> MR Created!</>}
                             </button>
                         </div>
                         {branchStatus === 'created' && (
                             <p className="text-xs text-slate-500 mt-3 text-center">
                                 Branch <span className="font-mono text-slate-400">fix/{issue.ruleId.toLowerCase().replace(/_/g, '-')}-{issue.id.split('_')[1]}</span> created.
                             </p>
                         )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};