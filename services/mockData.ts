import { Project, Severity, IssueStatus, Ruleset } from "../types";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj_01",
    name: "e-commerce-backend",
    repoUrl: "github.com/acme-inc/e-commerce-backend",
    provider: "github",
    lastScan: "2025-02-10T10:30:00Z",
    issues: [
      {
        id: "issue_01",
        ruleId: "SQL_INJECTION",
        title: "Potential SQL Injection",
        description: "User input is directly concatenated into a SQL query string.",
        severity: Severity.CRITICAL,
        status: IssueStatus.OPEN,
        filePath: "src/controllers/auth.ts",
        startLine: 45,
        endLine: 45,
        toolName: "ESLint Security",
        snippet: "const query = \"SELECT * FROM users WHERE email = '\" + req.body.email + \"'\";",
        aiAnalysis: {
            analysis: "The code directly concatenates the `req.body.email` user input into a SQL query string. This is a classic SQL Injection vulnerability, allowing an attacker to manipulate the query logic (e.g., by entering `' OR '1'='1`) to bypass authentication or access unauthorized data.",
            suggestedFix: "const query = \"SELECT * FROM users WHERE email = ?\";\nawait db.execute(query, [req.body.email]);",
            explanation: "The fix uses a parameterized query (placeholder `?`). The database driver treats the input strictly as data, not executable code, effectively neutralizing the injection vector."
        }
      },
      {
        id: "issue_02",
        ruleId: "HARDCODED_SECRET",
        title: "Hardcoded AWS Access Key",
        description: "AWS Access Key ID found in source code.",
        severity: Severity.HIGH,
        status: IssueStatus.OPEN,
        filePath: "config/aws.ts",
        startLine: 12,
        endLine: 12,
        toolName: "TruffleHog",
        snippet: "const AWS_KEY = \"AKIAIOSFODNN7EXAMPLE\";",
      },
      {
        id: "issue_03",
        ruleId: "XSS_REFLECTED",
        title: "Reflected XSS",
        description: "Unsanitized user input reflected in HTML response.",
        severity: Severity.MEDIUM,
        status: IssueStatus.IN_PROGRESS,
        filePath: "src/views/search.ts",
        startLine: 22,
        endLine: 24,
        toolName: "SonarQube",
        snippet: "res.send(`<h1>Search results for: ${req.query.q}</h1>`);",
      },
      {
        id: "issue_04",
        ruleId: "WEAK_HASH",
        title: "Weak Hashing Algorithm (MD5)",
        description: "MD5 is not collision resistant and should not be used for security.",
        severity: Severity.MEDIUM,
        status: IssueStatus.OPEN,
        filePath: "src/utils/hash.ts",
        startLine: 8,
        endLine: 8,
        toolName: "Bandit",
        snippet: "const hash = crypto.createHash('md5').update(data).digest('hex');",
      },
      {
        id: "issue_05",
        ruleId: "PATH_TRAVERSAL",
        title: "Path Traversal Vulnerability",
        description: "User-controlled file path allows directory traversal.",
        severity: Severity.CRITICAL,
        status: IssueStatus.OPEN,
        filePath: "src/controllers/files.ts",
        startLine: 33,
        endLine: 35,
        toolName: "Semgrep",
        snippet: "const filePath = path.join('/uploads', req.params.filename);\nfs.readFile(filePath, (err, data) => {\n  res.send(data);\n});",
        aiAnalysis: {
            analysis: "The `req.params.filename` is directly used in `path.join` without sanitization. An attacker could use `../` sequences (e.g., `../../etc/passwd`) to read arbitrary files outside the intended `/uploads` directory.",
            suggestedFix: "const sanitized = path.basename(req.params.filename);\nconst filePath = path.join('/uploads', sanitized);\nif (!filePath.startsWith('/uploads/')) {\n  return res.status(403).send('Forbidden');\n}\nfs.readFile(filePath, (err, data) => {\n  res.send(data);\n});",
            explanation: "Using `path.basename()` strips directory traversal sequences, and the additional prefix check ensures the resolved path is still within the allowed directory."
        }
      },
      {
        id: "issue_06",
        ruleId: "INSECURE_RANDOM",
        title: "Insecure Random Number Generator",
        description: "Math.random() is not cryptographically secure and should not be used for tokens.",
        severity: Severity.HIGH,
        status: IssueStatus.RESOLVED,
        filePath: "src/utils/token.ts",
        startLine: 15,
        endLine: 15,
        toolName: "ESLint Security",
        snippet: "const token = Math.random().toString(36).substring(2);",
        fixedCode: "const token = crypto.randomBytes(32).toString('hex');",
        remediation: "Replaced Math.random() with crypto.randomBytes() for cryptographically secure token generation."
      },
      {
        id: "issue_07",
        ruleId: "OPEN_REDIRECT",
        title: "Open Redirect Vulnerability",
        description: "Unvalidated redirect URL from user input.",
        severity: Severity.MEDIUM,
        status: IssueStatus.IGNORED,
        filePath: "src/controllers/auth.ts",
        startLine: 78,
        endLine: 78,
        toolName: "Semgrep",
        snippet: "res.redirect(req.query.returnUrl);",
      },
      {
        id: "issue_08",
        ruleId: "MISSING_AUTH",
        title: "Missing Authentication on Admin Endpoint",
        description: "Admin API endpoint lacks authentication middleware.",
        severity: Severity.CRITICAL,
        status: IssueStatus.IN_PROGRESS,
        filePath: "src/routes/admin.ts",
        startLine: 5,
        endLine: 8,
        toolName: "Custom Scanner",
        snippet: "router.get('/admin/users', async (req, res) => {\n  const users = await User.findAll();\n  res.json(users);\n});",
      }
    ]
  },
  {
    id: "proj_02",
    name: "customer-portal-frontend",
    repoUrl: "gitlab.com/acme-inc/customer-portal",
    provider: "gitlab",
    lastScan: "2025-02-09T14:15:00Z",
    issues: [
      {
        id: "issue_09",
        ruleId: "XSS_DOM",
        title: "DOM-based XSS via innerHTML",
        description: "User input assigned to innerHTML without sanitization.",
        severity: Severity.HIGH,
        status: IssueStatus.OPEN,
        filePath: "src/components/UserProfile.tsx",
        startLine: 42,
        endLine: 42,
        toolName: "SonarQube",
        snippet: "element.innerHTML = userData.bio;",
      },
      {
        id: "issue_10",
        ruleId: "PROTOTYPE_POLLUTION",
        title: "Prototype Pollution via Object.assign",
        description: "Deep merge of user-controlled objects can lead to prototype pollution.",
        severity: Severity.MEDIUM,
        status: IssueStatus.OPEN,
        filePath: "src/utils/merge.ts",
        startLine: 12,
        endLine: 18,
        toolName: "Snyk",
        snippet: "function deepMerge(target, source) {\n  for (const key in source) {\n    target[key] = source[key];\n  }\n  return target;\n}",
      },
      {
        id: "issue_11",
        ruleId: "SENSITIVE_DATA_EXPOSURE",
        title: "Sensitive Data in Local Storage",
        description: "JWT token stored in localStorage is vulnerable to XSS attacks.",
        severity: Severity.HIGH,
        status: IssueStatus.OPEN,
        filePath: "src/services/auth.ts",
        startLine: 28,
        endLine: 28,
        toolName: "ESLint Security",
        snippet: "localStorage.setItem('auth_token', response.data.token);",
      }
    ]
  },
  {
    id: "proj_03",
    name: "internal-api-gateway",
    repoUrl: "github.com/acme-inc/api-gateway",
    provider: "github",
    lastScan: "2025-02-08T09:00:00Z",
    issues: [
      {
        id: "issue_12",
        ruleId: "SSRF",
        title: "Server-Side Request Forgery (SSRF)",
        description: "User-supplied URL passed directly to HTTP client without validation.",
        severity: Severity.CRITICAL,
        status: IssueStatus.OPEN,
        filePath: "src/proxy/handler.ts",
        startLine: 19,
        endLine: 21,
        toolName: "Semgrep",
        snippet: "const response = await axios.get(req.body.targetUrl);\nres.json(response.data);",
      },
      {
        id: "issue_13",
        ruleId: "RATE_LIMIT_MISSING",
        title: "Missing Rate Limiting",
        description: "API endpoint has no rate limiting, susceptible to brute-force attacks.",
        severity: Severity.MEDIUM,
        status: IssueStatus.OPEN,
        filePath: "src/routes/login.ts",
        startLine: 3,
        endLine: 3,
        toolName: "Custom Scanner",
        snippet: "router.post('/api/login', loginController.authenticate);",
      }
    ]
  }
];

export const MOCK_SCAN_HISTORY = [
  { date: '2025-02-04', critical: 5, high: 8, medium: 12, low: 6 },
  { date: '2025-02-05', critical: 5, high: 7, medium: 11, low: 6 },
  { date: '2025-02-06', critical: 4, high: 7, medium: 10, low: 5 },
  { date: '2025-02-07', critical: 4, high: 6, medium: 9, low: 5 },
  { date: '2025-02-08', critical: 3, high: 5, medium: 8, low: 4 },
  { date: '2025-02-09', critical: 3, high: 4, medium: 7, low: 4 },
  { date: '2025-02-10', critical: 3, high: 4, medium: 6, low: 3 },
];

export interface ActivityItem {
  id: string;
  type: 'scan' | 'ai_fix' | 'branch' | 'pr' | 'rule_change' | 'integration';
  title: string;
  description: string;
  timestamp: string;
  project?: string;
  severity?: Severity;
}

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 'act_01', type: 'scan', title: 'Security scan completed', description: 'Found 8 issues in e-commerce-backend (3 Critical, 2 High, 2 Medium, 1 Low)', timestamp: '2025-02-10T10:30:00Z', project: 'e-commerce-backend' },
  { id: 'act_02', type: 'ai_fix', title: 'AI fix generated', description: 'Gemini generated a remediation for SQL Injection in auth.ts', timestamp: '2025-02-10T10:35:00Z', project: 'e-commerce-backend', severity: Severity.CRITICAL },
  { id: 'act_03', type: 'branch', title: 'Fix branch created', description: 'Branch fix/sql-injection-01 created from main', timestamp: '2025-02-10T10:40:00Z', project: 'e-commerce-backend' },
  { id: 'act_04', type: 'pr', title: 'Merge request created', description: 'MR #42: Fix SQL Injection in auth controller', timestamp: '2025-02-10T10:42:00Z', project: 'e-commerce-backend' },
  { id: 'act_05', type: 'scan', title: 'Security scan completed', description: 'Found 3 issues in customer-portal-frontend (0 Critical, 2 High, 1 Medium)', timestamp: '2025-02-09T14:15:00Z', project: 'customer-portal-frontend' },
  { id: 'act_06', type: 'rule_change', title: 'Ruleset updated', description: 'OWASP Top 10 ruleset A09 rule was disabled', timestamp: '2025-02-09T11:00:00Z' },
  { id: 'act_07', type: 'integration', title: 'GitHub connected', description: 'GitHub integration configured for acme-inc organization', timestamp: '2025-02-08T16:00:00Z' },
  { id: 'act_08', type: 'ai_fix', title: 'AI fix generated', description: 'Gemini generated a remediation for Path Traversal in files.ts', timestamp: '2025-02-10T11:15:00Z', project: 'e-commerce-backend', severity: Severity.CRITICAL },
  { id: 'act_09', type: 'scan', title: 'Security scan completed', description: 'Found 2 issues in internal-api-gateway (1 Critical, 0 High, 1 Medium)', timestamp: '2025-02-08T09:00:00Z', project: 'internal-api-gateway' },
  { id: 'act_10', type: 'pr', title: 'Merge request merged', description: 'MR #38: Fix Insecure Random in token utility - merged', timestamp: '2025-02-07T15:30:00Z', project: 'e-commerce-backend' },
];

export const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'critical' as const, title: 'Critical: SQL Injection Found', message: 'New critical vulnerability detected in e-commerce-backend', time: '10 min ago', read: false },
  { id: 'n2', type: 'success' as const, title: 'AI Fix Applied', message: 'Path Traversal fix merged successfully', time: '1 hour ago', read: false },
  { id: 'n3', type: 'info' as const, title: 'Scan Complete', message: 'customer-portal-frontend scan finished with 3 issues', time: '3 hours ago', read: true },
  { id: 'n4', type: 'warning' as const, title: 'API Key Expiring', message: 'Your Gemini API key expires in 7 days', time: '5 hours ago', read: true },
  { id: 'n5', type: 'success' as const, title: 'MR Merged', message: 'MR #38 for Insecure Random fix was merged', time: '1 day ago', read: true },
];

export const MOCK_RULESETS: Ruleset[] = [
    {
        id: 'owasp-top-10',
        name: 'OWASP Top 10 (2021)',
        description: 'Standard awareness document for developers and web application security.',
        enabled: true,
        provider: 'Standard',
        rules: [
            { id: 'A01', name: 'Broken Access Control', description: 'Restrictions on what authenticated users are allowed to do are not properly enforced.', severity: Severity.CRITICAL, enabled: true },
            { id: 'A03', name: 'Injection', description: 'User supplied data is not validated, filtered, or sanitized by the application.', severity: Severity.CRITICAL, enabled: true },
            { id: 'A07', name: 'Identification and Authentication Failures', description: 'Confirmation of the user\'s identity, authentication, and session management is critical.', severity: Severity.HIGH, enabled: true },
            { id: 'A04', name: 'Insecure Design', description: 'Risks related to design and architectural flaws.', severity: Severity.HIGH, enabled: true },
            { id: 'A09', name: 'Security Logging and Monitoring Failures', description: 'Failures to log, monitor, or report security events.', severity: Severity.MEDIUM, enabled: true },
        ]
    },
    {
        id: 'sans-25',
        name: 'SANS Top 25',
        description: 'The most dangerous software errors.',
        enabled: false,
        provider: 'Standard',
        rules: [
             { id: 'CWE-89', name: 'SQL Injection', description: 'Improper Neutralization of Special Elements used in an SQL Command.', severity: Severity.CRITICAL, enabled: true },
             { id: 'CWE-79', name: 'Cross-site Scripting', description: 'Improper Neutralization of Input During Web Page Generation.', severity: Severity.HIGH, enabled: true },
             { id: 'CWE-20', name: 'Improper Input Validation', description: 'Ensure input is validated before use.', severity: Severity.MEDIUM, enabled: true },
        ]
    },
     {
        id: 'company-custom',
        name: 'Acme Corp Specifics',
        description: 'Internal security guidelines for Acme Corp.',
        enabled: true,
        provider: 'Custom',
        rules: [
             { id: 'ACME-001', name: 'No Hardcoded API Keys', description: 'Scan for specific internal API key patterns.', severity: Severity.CRITICAL, enabled: true },
             { id: 'ACME-002', name: 'Logger Configuration', description: 'Ensure logging is set to INFO or above in production.', severity: Severity.LOW, enabled: true },
        ]
    }
];
