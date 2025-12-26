import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { GitBranch, getBranches, createBranch } from '../services/gitService';
import { GitBranch as GitIcon, Plus, Terminal, Search, Clock, User, Check, RefreshCw } from 'lucide-react';

interface GitManagerProps {
  project: Project;
}

export const GitManager: React.FC<GitManagerProps> = ({ project }) => {
    const [branches, setBranches] = useState<GitBranch[]>([]);
    const [loading, setLoading] = useState(true);
    const [newBranchName, setNewBranchName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        loadBranches();
    }, [project.id]);

    const loadBranches = async () => {
        setLoading(true);
        const data = await getBranches(project.id);
        setBranches(data);
        setLoading(false);
    };

    const handleCreateBranch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBranchName) return;
        setIsCreating(true);
        const newBranch = await createBranch(project.id, newBranchName);
        setBranches([newBranch, ...branches]);
        setIsCreating(false);
        setShowCreateModal(false);
        setNewBranchName('');
    };

    return (
        <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <GitIcon className="w-6 h-6 mr-3 text-orange-500" />
                        Repository Management
                    </h2>
                    <p className="text-slate-400 mt-1 font-mono text-sm">{project.repoUrl}</p>
                </div>
                <div className="flex space-x-3">
                    <button 
                         onClick={loadBranches}
                         className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                         title="Fetch"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-blue-600/20"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Branch
                    </button>
                </div>
            </div>

            {/* Create Branch Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-96 shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">Create New Branch</h3>
                        <form onSubmit={handleCreateBranch}>
                            <div className="mb-4">
                                <label className="block text-sm text-slate-400 mb-2">Source</label>
                                <div className="flex items-center text-slate-300 bg-slate-900 px-3 py-2 rounded border border-slate-700">
                                    <GitIcon className="w-4 h-4 mr-2 text-slate-500" />
                                    <span className="font-mono text-sm">main</span>
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm text-slate-400 mb-2">Branch Name</label>
                                <input 
                                    type="text" 
                                    value={newBranchName}
                                    onChange={(e) => setNewBranchName(e.target.value)}
                                    placeholder="feature/fix-vuln-01"
                                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button 
                                    type="button" 
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isCreating || !newBranchName}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium disabled:opacity-50 transition-colors"
                                >
                                    {isCreating ? 'Creating...' : 'Create Branch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Branch List */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex-1 flex flex-col shadow-xl">
                 <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex items-center space-x-4">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Filter branches..." 
                            className="bg-slate-900 border border-slate-700 text-slate-200 pl-9 pr-4 py-2 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder-slate-600"
                        />
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800">
                         <Terminal className="w-3 h-3" />
                         <span>git status: clean</span>
                    </div>
                 </div>
                 
                 <div className="overflow-y-auto flex-1 p-2">
                    {branches.map((branch, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-700/30 rounded-lg group transition-colors border border-transparent hover:border-slate-700 mb-1">
                            <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-lg ${branch.isDefault ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700/50 text-slate-400'}`}>
                                    <GitIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-slate-200">{branch.name}</span>
                                        {branch.isDefault && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30 font-bold tracking-wide">DEFAULT</span>}
                                    </div>
                                    <div className="flex items-center text-xs text-slate-500 mt-1 space-x-3">
                                        <span className="font-mono bg-slate-900 px-1.5 rounded">{branch.lastCommit}</span>
                                        <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {branch.author}</span>
                                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {branch.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 flex space-x-2 transition-opacity">
                                <button className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded border border-slate-600 transition-all hover:text-white">
                                    Checkout
                                </button>
                            </div>
                        </div>
                    ))}
                    {branches.length === 0 && !loading && (
                         <div className="text-center p-8 text-slate-500">No branches found.</div>
                    )}
                 </div>
            </div>
        </div>
    );
};