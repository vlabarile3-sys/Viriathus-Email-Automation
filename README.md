# Viriathus Email Automation
## About the project

Viriathus Email Automation helps teams prepare personalized email drafts for groups of agents. Users choose a workflow, select recipients and a date, pick an email template, and review the result before starting a batch. The Apps Script implementation can also copy a Drive template, link a draft to a selected email thread, and record an audit entry.

### Key capabilities

- Organize agents into workflows and manage reusable email templates.
- Personalize subjects and message bodies with agent, date, and file-link tokens.
- Preview the email and choose a new or existing thread for each agent.
- Review an audit history of automation actions.

**[Open the live demo](https://vlabarile3-sys.github.io/Viriathus-Email-Automation/)**

The public demo uses fictional data and simulates these actions in the browser. It does not create Gmail drafts, send emails, or access Google Sheets or Drive. Demo changes are stored in the browser; the separate Apps Script source requires configuration and authorization for real integrations.


Public GitHub Pages demo and sanitized Google Apps Script source for Viriathus Email Automation.

## Live demo

Enable **Settings → Pages** and publish the `main` branch from the repository root. The demo entry point is `index.html`.

The demo keeps its sample workflows, agents, templates, and audit history in the current browser's `localStorage`. It uses fictional `example.com` addresses and sample thread data. It does **not** connect to Google Sheets, Gmail, or Drive, and it does not send emails or create files.

## Google Apps Script source

The `apps-script-source.zip` archive contains the original Apps Script files (`Code.gs`, `Index.html`, `CSS.html`, and `JS.html`). Sensitive spreadsheet and Drive identifiers and named contact addresses have been replaced with placeholders. Before a live deployment:

1. Configure the `VIRIATHUS_MAIN_DB` Script Property with your spreadsheet ID.
2. Replace the demo template's sample recipient addresses and file ID with values for your deployment.
3. Configure the agent email domain used by `addAgentsBulk` (`example.com` is a demo placeholder).
4. Deploy the Apps Script project as a Web App with the appropriate Google account permissions.

Do not commit real IDs, recipient addresses, or other private data to this public repository.

## Run locally

From the repository root, serve the files with any static HTTP server, for example:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.
