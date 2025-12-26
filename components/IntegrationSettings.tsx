import React, { useState } from 'react';
import { Github, Gitlab, Check, Cloud } from 'lucide-react';

export const IntegrationSettings = () => {
    const [githubConnected, setGithubConnected] = useState(true);
    const [gitlabConnected, setGitlabConnected] = useState(false);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-2">Integrations</h2>
            <p className="text-slate-400 mb-8">Manage connections to your source code management providers and SAST tools.</p>

            <div className="space-y-6">
                {/* GitHub */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                             <Github className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">GitHub</h3>
                            <p className="text-sm text-slate-400">Connect to GitHub repositories for PR automation.</p>
                        </div>
                    </div>
                    <div>
                        {githubConnected ? (
                             <button onClick={() => setGithubConnected(false)} className="px-4 py-2 border border-green-500/30 bg-green-500/10 text-green-400 rounded-lg font-medium flex items-center">
                                <Check className="w-4 h-4 mr-2" /> Connected
                             </button>
                        ) : (
                            <button onClick={() => setGithubConnected(true)} className="px-4 py-2 bg-white text-black hover:bg-slate-200 rounded-lg font-medium transition-colors">
                                Connect
                            </button>
                        )}
                    </div>
                </div>

                 {/* GitLab */}
                 <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                         <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                             <Gitlab className="w-8 h-8 text-orange-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">GitLab</h3>
                            <p className="text-sm text-slate-400">Import projects and sync merge requests.</p>
                        </div>
                    </div>
                    <div>
                        {gitlabConnected ? (
                             <button onClick={() => setGitlabConnected(false)} className="px-4 py-2 border border-green-500/30 bg-green-500/10 text-green-400 rounded-lg font-medium flex items-center">
                                <Check className="w-4 h-4 mr-2" /> Connected
                             </button>
                        ) : (
                            <button onClick={() => setGitlabConnected(true)} className="px-4 py-2 bg-orange-600 text-white hover:bg-orange-500 rounded-lg font-medium transition-colors">
                                Connect
                            </button>
                        )}
                    </div>
                </div>

                 {/* SAST API Webhook */}
                 <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center space-x-4 mb-4">
                         <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                             <Cloud className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">SARIF Ingestion Webhook</h3>
                            <p className="text-sm text-slate-400">Post SARIF JSON results to this endpoint.</p>
                        </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                        <code className="text-slate-400 text-sm font-mono">https://api.vulnguard.ai/v1/ingest/sarif?token=sk_live_...</code>
                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">Copy</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
