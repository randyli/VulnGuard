import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { Github, Gitlab, Cloud, ArrowRight, Loader2, Terminal, CheckCircle2 } from 'lucide-react';
import { gitClone } from '../services/gitService';

interface NewProjectProps {
  onCancel: () => void;
  onCreate: (project: Omit<Project, 'id' | 'issues' | 'lastScan'>) => void;
}

export const NewProject: React.FC<NewProjectProps> = ({ onCancel, onCreate }) => {
  const [name, setName] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [provider, setProvider] = useState<'github' | 'gitlab' | 'azure'>('github');
  const [status, setStatus] = useState<'idle' | 'cloning' | 'success'>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('cloning');
    setLogs([]);
    
    // Simulate git clone sequence
    addLog(`> git clone ${repoUrl} .`);
    addLog(`Cloning into '${name}'...`);
    
    await new Promise(r => setTimeout(r, 800));
    addLog(`remote: Enumerating objects: 142, done.`);
    addLog(`remote: Counting objects: 100% (142/142), done.`);
    
    await new Promise(r => setTimeout(r, 800));
    addLog(`remote: Compressing objects: 100% (98/98), done.`);
    addLog(`Receiving objects: 100% (142/142), 1.24 MiB | 2.40 MiB/s, done.`);
    
    await new Promise(r => setTimeout(r, 600));
    addLog(`Resolving deltas: 100% (45/45), done.`);
    addLog(`> git checkout main`);
    addLog(`Switched to branch 'main'`);
    
    await new Promise(r => setTimeout(r, 400));
    setStatus('success');
    
    setTimeout(() => {
        onCreate({ name, repoUrl, provider });
    }, 1000);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in">
        <h2 className="text-3xl font-bold text-white mb-2">New Project</h2>
        <p className="text-slate-400 mb-8">Connect a repository to start scanning for vulnerabilities.</p>

        {status === 'idle' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Project Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. my-awesome-app"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-600"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Repository URL</label>
                    <input
                        type="url"
                        required
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        placeholder="https://github.com/org/repo"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-600"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Provider</label>
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            type="button"
                            onClick={() => setProvider('github')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                                provider === 'github'
                                    ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-slate-600'
                            }`}
                        >
                            <Github className="w-6 h-6 mb-2" />
                            <span className="text-sm font-medium">GitHub</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setProvider('gitlab')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                                provider === 'gitlab'
                                    ? 'bg-orange-600/10 border-orange-500 text-orange-400'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-slate-600'
                            }`}
                        >
                            <Gitlab className="w-6 h-6 mb-2" />
                            <span className="text-sm font-medium">GitLab</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setProvider('azure')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                                provider === 'azure'
                                    ? 'bg-sky-600/10 border-sky-500 text-sky-400'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-slate-600'
                            }`}
                        >
                            <Cloud className="w-6 h-6 mb-2" />
                            <span className="text-sm font-medium">Azure</span>
                        </button>
                    </div>
                </div>

                <div className="pt-6 flex items-center space-x-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center"
                    >
                        Connect Project
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                </div>
            </form>
        ) : (
            <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 font-mono text-sm relative overflow-hidden">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-4 mb-4">
                    <Terminal className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-500">Terminal Output</span>
                </div>
                <div className="space-y-2 h-48 overflow-y-auto">
                    {logs.map((log, i) => (
                        <div key={i} className="text-slate-300 animate-fade-in">{log}</div>
                    ))}
                    {status === 'success' && (
                        <div className="text-green-400 font-bold mt-4 flex items-center animate-fade-in">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Repository cloned successfully.
                        </div>
                    )}
                </div>
                {status === 'cloning' && (
                    <div className="absolute top-6 right-6">
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    </div>
                )}
            </div>
        )}
    </div>
  );
};