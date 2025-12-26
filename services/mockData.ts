import { Project, Severity, IssueStatus, Ruleset } from "../types";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj_01",
    name: "e-commerce-backend",
    repoUrl: "github.com/acme-inc/e-commerce-backend",
    provider: "github",
    lastScan: "2023-10-27T10:30:00Z",
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
        toolName: "Bandit",
        snippet: "const hash = crypto.createHash('md5').update(data).digest('hex');",
      }
    ]
  },
  {
    id: "proj_02",
    name: "customer-portal-frontend",
    repoUrl: "gitlab.com/acme-inc/customer-portal",
    provider: "gitlab",
    lastScan: "2023-10-26T14:15:00Z",
    issues: []
  }
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