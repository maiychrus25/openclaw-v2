# Google Stitch API Reference

## Authentication

Two methods supported:

### API Key (recommended for personal use)
1. Go to https://stitch.withgoogle.com/
2. Click profile icon → "Stitch Settings"
3. Go to "API Keys" section → "Create Key"
4. Set `STITCH_API_KEY` env var

### Application Default Credentials (ADC)
For Google Cloud projects with IAM:
```bash
gcloud auth application-default login
gcloud beta services mcp enable stitch.googleapis.com --project=$PROJECT_ID
```
Requires `roles/serviceusage.serviceUsageConsumer` role.

## MCP Tools

The Stitch MCP server exposes these tools:

### generate_screen_from_text
Generate a new UI screen from a text prompt.
- **Input**: `{ "prompt": "string", "model": "gemini-3-flash|gemini-3-pro" }`
- **Output**: Screen object with `screenId`, `projectId`, `imageUrl`, and generated assets
- Models: `gemini-3-flash` (default, faster) or `gemini-3-pro` (higher quality)

### list_projects
List all Stitch projects for the authenticated user.
- **Input**: `{}`
- **Output**: Array of project objects with `id`, `name`, `createdAt`

### get_project
Get details of a specific project.
- **Input**: `{ "projectId": "string" }`
- **Output**: Project object with screens, metadata

### list_screens
List all screens within a project.
- **Input**: `{ "projectId": "string" }`
- **Output**: Array of screen objects

### download_asset
Download an image or HTML asset for a screen.
- **Input**: `{ "screenId": "string", "type": "image|html" }`
- **Output**: `{ "url": "string" }` — direct download URL

### enhance_prompt
Improve a design prompt for better generation results.
- **Input**: `{ "prompt": "string" }`
- **Output**: Enhanced prompt text

## Stitch MCP Endpoint

Default: `https://stitch-mcp.googleapis.com`
Override with `STITCH_MCP_URL` env var.

## Limits & Pricing
- Stitch MCP is free of charge (as of Feb 2026)
- API key access may require Advanced/Premium plan during certain periods
- Rate limits are not officially documented; expect reasonable usage throttling

## Links
- Web app: https://stitch.withgoogle.com/
- Gemini CLI extension: https://github.com/gemini-cli-extensions/stitch
- MCP server: https://github.com/davideast/stitch-mcp
- Privacy notice: https://stitch.withgoogle.com/privacy
