import React, { useState } from 'react';
import { MOCK_RULESETS } from '../services/mockData';
import { Ruleset, Severity } from '../types';
import { Shield, ChevronDown, ChevronUp, Plus, Search, Settings2, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

export const RulesetConfig = () => {
    const [rulesets, setRulesets] = useState<Ruleset[]>(MOCK_RULESETS);
    const [expanded, setExpanded] = useState<Set<string>>(new Set(['owasp-top-10']));

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expanded);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpanded(newExpanded);
    };

    const toggleRuleset = (id: string) => {
        setRulesets(rulesets.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    };

    const toggleRule = (rulesetId: string, ruleId: string) => {
        setRulesets(rulesets.map(r => {
            if (r.id === rulesetId) {
                return {
                    ...r,
                    rules: r.rules.map(rule => rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)
                };
            }
            return r;
        }));
    };

    const getSeverityColor = (severity: Severity) => {
        switch (severity) {
            case Severity.CRITICAL: return 'text-red-400 bg-red-500/10 border-red-500/20';
            case Severity.HIGH: return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            case Severity.MEDIUM: return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case Severity.LOW: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white">Ruleset Configuration</h2>
                    <p className="text-slate-400 mt-1">Manage active security rules and scanning policies.</p>
                </div>
                 <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors shadow-lg shadow-blue-600/20">
                    <Plus className="w-4 h-4 mr-2" />
                    New Custom Ruleset
                </button>
            </div>

            <div className="space-y-6 overflow-y-auto pb-8">
                {rulesets.map((ruleset) => (
                    <div key={ruleset.id} className={`bg-slate-800 border ${ruleset.enabled ? 'border-slate-600' : 'border-slate-700/50 opacity-75'} rounded-xl overflow-hidden transition-all duration-300`}>
                        {/* Header */}
                        <div className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-700/30" onClick={() => toggleExpand(ruleset.id)}>
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-lg ${ruleset.enabled ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-700 text-slate-500'}`}>
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center">
                                        {ruleset.name}
                                        {ruleset.provider === 'Custom' && (
                                            <span className="ml-3 text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full font-medium">CUSTOM</span>
                                        )}
                                    </h3>
                                    <p className="text-sm text-slate-400">{ruleset.description}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-6" onClick={e => e.stopPropagation()}>
                                 <div className="text-sm text-slate-500 hidden sm:block">
                                    {ruleset.rules.filter(r => r.enabled).length} / {ruleset.rules.length} Rules Active
                                 </div>
                                <button onClick={() => toggleRuleset(ruleset.id)} className={`transition-colors ${ruleset.enabled ? 'text-blue-400' : 'text-slate-600'}`}>
                                    {ruleset.enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                                </button>
                                <button className="text-slate-400 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); toggleExpand(ruleset.id); }}>
                                    {expanded.has(ruleset.id) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        {expanded.has(ruleset.id) && (
                            <div className="border-t border-slate-700 bg-slate-900/30 p-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="text-xs text-slate-500 uppercase tracking-wider">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">Status</th>
                                                <th className="px-4 py-3 font-medium">Rule ID</th>
                                                <th className="px-4 py-3 font-medium">Name</th>
                                                <th className="px-4 py-3 font-medium">Severity</th>
                                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/50">
                                            {ruleset.rules.map(rule => (
                                                <tr key={rule.id} className="hover:bg-slate-700/20 transition-colors">
                                                    <td className="px-4 py-3">
                                                         <button 
                                                            onClick={() => toggleRule(ruleset.id, rule.id)}
                                                            className={`${rule.enabled ? 'text-green-400' : 'text-slate-600'} hover:opacity-80 transition-colors`}
                                                         >
                                                             {rule.enabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                                                         </button>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-mono text-slate-400">{rule.id}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm font-medium text-slate-200">{rule.name}</div>
                                                        <div className="text-xs text-slate-500">{rule.description}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(rule.severity)}`}>
                                                            {rule.severity}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button className="p-1 text-slate-500 hover:text-white transition-colors">
                                                            <Settings2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}