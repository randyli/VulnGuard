import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, Bell, Shield, Clock, Monitor, Save, CheckCircle2, Eye, EyeOff, RotateCcw, Zap } from 'lucide-react';

interface SettingsSection {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);

  // General settings
  const [scanFrequency, setScanFrequency] = useState('daily');
  const [autoFix, setAutoFix] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [scanSummary, setScanSummary] = useState(true);

  // API Key settings
  const [geminiKey, setGeminiKey] = useState('sk-****************************');
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-3-pro-preview');
  const [maxTokens, setMaxTokens] = useState('4096');

  // Scan settings
  const [excludePatterns, setExcludePatterns] = useState('node_modules/\n.git/\ndist/\nbuild/\n*.test.ts');
  const [maxFileSize, setMaxFileSize] = useState('1');
  const [concurrentScans, setConcurrentScans] = useState('3');

  const sections: SettingsSection[] = [
    { id: 'general', label: 'General', icon: <Monitor className="w-4 h-4" /> },
    { id: 'api', label: 'AI Configuration', icon: <Key className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'scanning', label: 'Scan Settings', icon: <Shield className="w-4 h-4" /> },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center">
            <SettingsIcon className="w-7 h-7 mr-3 text-slate-400" />
            Settings
          </h2>
          <p className="text-slate-400 mt-1">Configure your VulnGuard AI preferences and integrations.</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-5 py-2.5 rounded-lg font-medium flex items-center transition-all ${
            saved
              ? 'bg-emerald-600 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
          }`}
        >
          {saved ? (
            <><CheckCircle2 className="w-4 h-4 mr-2" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4 mr-2" /> Save Changes</>
          )}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Section nav */}
        <div className="w-48 shrink-0">
          <nav className="space-y-1 sticky top-8">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {section.icon}
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeSection === 'general' && (
            <>
              <SettingsCard title="Scan Schedule" description="Configure automatic scanning frequency.">
                <div className="grid grid-cols-3 gap-3">
                  {['hourly', 'daily', 'weekly'].map(freq => (
                    <button
                      key={freq}
                      onClick={() => setScanFrequency(freq)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium capitalize transition-all border ${
                        scanFrequency === freq
                          ? 'bg-blue-600/10 text-blue-400 border-blue-500'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Clock className="w-4 h-4 mx-auto mb-1.5" />
                      {freq}
                    </button>
                  ))}
                </div>
              </SettingsCard>

              <SettingsCard title="Auto-Fix" description="Automatically create fix branches for issues with AI-generated remediations.">
                <ToggleSwitch enabled={autoFix} onToggle={() => setAutoFix(!autoFix)} label="Enable automatic fix branch creation" />
              </SettingsCard>
            </>
          )}

          {activeSection === 'api' && (
            <>
              <SettingsCard title="Gemini API Key" description="Configure your Google Gemini API key for AI-powered analysis.">
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 pr-12 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Enter your Gemini API key"
                    />
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Your key is encrypted at rest and never shared.
                  </p>
                </div>
              </SettingsCard>

              <SettingsCard title="Model Selection" description="Choose the Gemini model used for vulnerability analysis.">
                <div className="space-y-3">
                  {[
                    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro Preview', desc: 'Best for complex analysis (Recommended)', badge: 'Recommended' },
                    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', desc: 'Balanced performance and cost' },
                    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Fast and cost-effective for simple issues' },
                  ].map(model => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`w-full text-left p-4 rounded-lg border transition-all flex justify-between items-center ${
                        selectedModel === model.id
                          ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-medium flex items-center space-x-2">
                          <Zap className="w-4 h-4" />
                          <span>{model.name}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 ml-6">{model.desc}</p>
                      </div>
                      {model.badge && (
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{model.badge}</span>
                      )}
                    </button>
                  ))}
                </div>
              </SettingsCard>

              <SettingsCard title="Token Limit" description="Maximum tokens per AI response.">
                <input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(e.target.value)}
                  className="w-40 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </SettingsCard>
            </>
          )}

          {activeSection === 'notifications' && (
            <>
              <SettingsCard title="Email Notifications" description="Receive email alerts for security events.">
                <ToggleSwitch enabled={emailNotifications} onToggle={() => setEmailNotifications(!emailNotifications)} label="Send email notifications" />
              </SettingsCard>
              <SettingsCard title="Slack Integration" description="Post notifications to a Slack channel.">
                <div className="space-y-4">
                  <ToggleSwitch enabled={slackNotifications} onToggle={() => setSlackNotifications(!slackNotifications)} label="Enable Slack notifications" />
                  {slackNotifications && (
                    <input
                      type="text"
                      placeholder="https://hooks.slack.com/services/..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  )}
                </div>
              </SettingsCard>
              <SettingsCard title="Alert Preferences" description="Choose which events trigger notifications.">
                <div className="space-y-4">
                  <ToggleSwitch enabled={criticalAlerts} onToggle={() => setCriticalAlerts(!criticalAlerts)} label="Critical vulnerability alerts" />
                  <ToggleSwitch enabled={scanSummary} onToggle={() => setScanSummary(!scanSummary)} label="Daily scan summary" />
                </div>
              </SettingsCard>
            </>
          )}

          {activeSection === 'scanning' && (
            <>
              <SettingsCard title="Exclude Patterns" description="File and directory patterns to exclude from scanning (one per line).">
                <textarea
                  value={excludePatterns}
                  onChange={(e) => setExcludePatterns(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                />
              </SettingsCard>
              <SettingsCard title="Performance" description="Tune scan performance parameters.">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Max file size (MB)</label>
                    <input
                      type="number"
                      value={maxFileSize}
                      onChange={(e) => setMaxFileSize(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Concurrent scans</label>
                    <input
                      type="number"
                      value={concurrentScans}
                      onChange={(e) => setConcurrentScans(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </SettingsCard>
              <SettingsCard title="Reset Defaults" description="Restore all scan settings to their default values.">
                <button className="px-4 py-2 bg-slate-800 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg text-sm font-medium flex items-center transition-colors">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </button>
              </SettingsCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-components
interface SettingsCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, description, children }) => (
  <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
    <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
    <p className="text-sm text-slate-500 mb-5">{description}</p>
    {children}
  </div>
);

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onToggle, label }) => (
  <button
    onClick={onToggle}
    className="flex items-center space-x-3 group cursor-pointer"
  >
    <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${enabled ? 'bg-blue-600' : 'bg-slate-600'}`}>
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
    </div>
    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</span>
  </button>
);
