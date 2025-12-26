import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { IssueList } from './components/IssueList';
import { IssueDetail } from './components/IssueDetail';
import { IntegrationSettings } from './components/IntegrationSettings';
import { NewProject } from './components/NewProject';
import { GitManager } from './components/GitManager';
import { MOCK_PROJECTS } from './services/mockData';
import { SastIssue, Project } from './types';
import { ChevronDown, Folder, Check, Bell, UserCircle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  // State for projects list and active project
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(MOCK_PROJECTS[0].id);
  const [selectedIssue, setSelectedIssue] = useState<SastIssue | null>(null);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const handleAddProject = (newProjData: Omit<Project, 'id' | 'issues' | 'lastScan'>) => {
    const newProject: Project = {
        ...newProjData,
        id: `proj_${Date.now()}`,
        issues: [], // Start with empty issues
        lastScan: new Date().toISOString()
    };
    setProjects([...projects, newProject]);
    setSelectedProjectId(newProject.id);
    setCurrentView('dashboard');
  };

  const handleSwitchProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedIssue(null);
    setIsProjectDropdownOpen(false);
    // Optional: Reset view to dashboard when switching projects
    // setCurrentView('dashboard');
  };

  const renderContent = () => {
    // Detail view overrides main views
    if (selectedIssue) {
      return (
        <IssueDetail 
          issue={selectedIssue} 
          onBack={() => setSelectedIssue(null)} 
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
            <div className="h-full overflow-y-auto">
                <Dashboard project={activeProject} />
            </div>
        );
      case 'issues':
        return (
          <IssueList 
            project={activeProject} 
            onSelectIssue={setSelectedIssue} 
          />
        );
      case 'repository':
        return (
          <div className="h-full overflow-y-auto">
              <GitManager project={activeProject} />
          </div>
        );
      case 'new-project':
        return (
            <div className="h-full overflow-y-auto">
                <NewProject 
                    onCancel={() => setCurrentView('dashboard')}
                    onCreate={handleAddProject}
                />
            </div>
        );
      case 'integrations':
        return (
            <div className="h-full overflow-y-auto">
                <IntegrationSettings />
            </div>
        );
      case 'settings':
          return <div className="p-8 text-slate-400 h-full overflow-y-auto">System settings placeholder</div>
      case 'rules':
          return <div className="p-8 text-slate-400 h-full overflow-y-auto">Ruleset configuration placeholder</div>
      default:
        return (
            <div className="h-full overflow-y-auto">
                <Dashboard project={activeProject} />
            </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden">
      <Sidebar 
        currentView={selectedIssue ? 'issues' : currentView} 
        setCurrentView={(view) => {
            setCurrentView(view);
            setSelectedIssue(null);
        }} 
      />
      <main className="flex-1 flex flex-col min-w-0 bg-[#0b1120]">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 shrink-0 backdrop-blur-sm z-20">
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <button 
                        onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700 group focus:outline-none"
                    >
                        <div className="p-1.5 bg-blue-500/10 rounded-md">
                            <Folder className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex flex-col items-start text-left">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 group-hover:text-slate-400">Current Project</span>
                            <div className="flex items-center text-sm font-medium text-slate-200 group-hover:text-white">
                                {activeProject.name}
                                <ChevronDown className={`w-4 h-4 ml-2 text-slate-500 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </div>
                    </button>

                    {/* Project Dropdown */}
                    {isProjectDropdownOpen && (
                        <>
                            <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setIsProjectDropdownOpen(false)}
                            ></div>
                            <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden animate-fade-in ring-1 ring-black/5">
                                <div className="p-2">
                                    <div className="text-xs font-semibold text-slate-500 px-3 py-2 uppercase tracking-wider">Switch Project</div>
                                    {projects.map(project => (
                                        <button
                                            key={project.id}
                                            onClick={() => handleSwitchProject(project.id)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                                selectedProjectId === project.id 
                                                ? 'bg-blue-600/10 text-blue-400' 
                                                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                            }`}
                                        >
                                            <span className="truncate flex-1 text-left">{project.name}</span>
                                            {selectedProjectId === project.id && <Check className="w-4 h-4 ml-2" />}
                                        </button>
                                    ))}
                                </div>
                                <div className="p-2 border-t border-slate-700 bg-slate-900/50">
                                    <button 
                                        onClick={() => {
                                            setIsProjectDropdownOpen(false);
                                            setCurrentView('new-project');
                                            setSelectedIssue(null);
                                        }}
                                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                    >
                                        <span>+ Create New Project</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
                </button>
                <div className="h-6 w-px bg-slate-800"></div>
                <button className="flex items-center space-x-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                    <UserCircle className="w-6 h-6" />
                    <span>DevSecOps Admin</span>
                </button>
            </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}