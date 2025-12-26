import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { IssueList } from './components/IssueList';
import { IssueDetail } from './components/IssueDetail';
import { IntegrationSettings } from './components/IntegrationSettings';
import { NewProject } from './components/NewProject';
import { MOCK_PROJECTS } from './services/mockData';
import { SastIssue, Project } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  // State for projects list and active project
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(MOCK_PROJECTS[0].id);
  const [selectedIssue, setSelectedIssue] = useState<SastIssue | null>(null);

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
        return <Dashboard project={activeProject} />;
      case 'issues':
        return (
          <IssueList 
            project={activeProject} 
            onSelectIssue={setSelectedIssue} 
          />
        );
      case 'new-project':
        return (
            <NewProject 
                onCancel={() => setCurrentView('dashboard')}
                onCreate={handleAddProject}
            />
        );
      case 'integrations':
        return <IntegrationSettings />;
      case 'settings':
          return <div className="p-8 text-slate-400">System settings placeholder</div>
      case 'rules':
          return <div className="p-8 text-slate-400">Ruleset configuration placeholder</div>
      default:
        return <Dashboard project={activeProject} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <Sidebar 
        currentView={selectedIssue ? 'issues' : currentView} 
        setCurrentView={(view) => {
            setCurrentView(view);
            setSelectedIssue(null);
        }} 
      />
      <main className="flex-1 overflow-auto bg-[#0b1120]">
        {renderContent()}
      </main>
    </div>
  );
}