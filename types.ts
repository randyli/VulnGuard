export enum Severity {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  INFO = 'Info',
}

export enum IssueStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  IGNORED = 'Ignored',
}

export interface AIFixResponse {
  analysis: string;
  suggestedFix: string;
  explanation: string;
}

// Simplified internal representation of a SAST issue
export interface SastIssue {
  id: string;
  ruleId: string;
  title: string;
  description: string;
  severity: Severity;
  status: IssueStatus;
  filePath: string;
  startLine: number;
  endLine?: number;
  snippet: string; // The vulnerable code
  toolName: string;
  remediation?: string; // AI Suggestion
  fixedCode?: string; // AI Code Fix
  aiAnalysis?: AIFixResponse; // Structured AI Analysis
}

export interface Project {
  id: string;
  name: string;
  repoUrl: string;
  provider: 'github' | 'gitlab' | 'azure';
  lastScan: string;
  issues: SastIssue[];
}

export interface SecurityRule {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  enabled: boolean;
}

export interface Ruleset {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  provider: 'Standard' | 'Custom';
  rules: SecurityRule[];
}