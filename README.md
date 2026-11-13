# Viriathus Email Automation

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
