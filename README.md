# VulnGuard AI

VulnGuard AI is a next-generation Static Application Security Testing (SAST) platform that integrates standard security scanning with advanced AI capabilities. It streamlines the vulnerability management process by not only identifying issues but also providing context-aware AI analysis and automated code remediation suggestions using Google's Gemini models.

## Features

*   **Centralized Dashboard**: Visualizes security posture with severity metrics, charts, and vulnerability trends.
*   **Vulnerability Management**: Detailed tracking of SAST issues including severity levels, file location, tool origin, and status.
*   **AI-Powered Remediation**: Leverages the `gemini-3-pro-preview` model to analyze vulnerable code snippets, explain the security flaw, and generate secure code fixes.
*   **Ruleset Configuration**: Manage and customize security rulesets (e.g., OWASP Top 10, SANS Top 25, Custom Company Rules).
*   **Git Workflow Integration**: Simulate Git actions such as creating fix branches and pull requests directly from the remediation interface.
*   **Multi-Provider Support**: Designed to integrate with GitHub, GitLab, and Azure DevOps.

## Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS
*   **AI Integration**: Google GenAI SDK (`@google/genai`)
*   **Visualization**: Recharts
*   **Icons**: Lucide React

## Getting Started

### Prerequisites

*   Node.js and npm/yarn/pnpm.
*   A Google Gemini API Key.

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up your environment variables. The application requires `process.env.API_KEY` to be set with your Google GenAI API key.

4.  Start the development server:
    ```bash
    npm start
    ```

## Usage

1.  **Dashboard**: Upon launching, you are presented with the security overview of the active project.
2.  **Switch Projects**: Use the dropdown in the header to switch between projects or create a new one.
3.  **View Vulnerabilities**: Navigate to the "Vulnerabilities" tab to see a list of issues. Click on any issue to view details.
4.  **AI Analysis**: inside an issue detail view, click the "Generate Fix Suggestion" button. Gemini will analyze the code snippet and provide a secure fix.
5.  **Apply Fixes**: Use the "Create Fix Branch" and "Create Merge Request" buttons to simulate the remediation workflow.
6.  **Manage Rules**: Go to the "Rulesets" page to toggle specific security rules or entire standards like OWASP Top 10.

## Development Roadmap

We welcome contributors to help us evolve VulnGuard AI. Here is our current roadmap:

### Phase 1: Core Functionality (Current)
- [x] UI/UX Implementation (Dashboard, Issue List, Details).
- [x] Mock Data Integration.
- [x] Gemini AI Integration for remediation suggestions.
- [ ] Unit and Integration Tests for frontend components.

### Phase 2: Backend Integration
- [ ] Implement a Node.js/Express backend.
- [ ] Real SARIF file ingestion and parsing.
- [ ] Database integration (PostgreSQL) for persisting projects and issues.
- [ ] Live GitHub/GitLab API connections for real branch/PR creation.

### Phase 3: Advanced AI & Automation
- [ ] "Fix All" capability for specific rule types.
- [ ] Chat interface for interactive security auditing.
- [ ] Fine-tuning Gemini models on secure coding standards.

### Phase 4: Enterprise Features
- [ ] Role-Based Access Control (RBAC).
- [ ] SSO Integration (Okta, Auth0).
- [ ] Custom Reporting (PDF/CSV exports).

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.