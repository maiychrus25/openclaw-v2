---
name: google-stitch
description: "Generate UI designs from text prompts using Google Stitch (stitch.withgoogle.com) via the upstream MCP API. Manage Stitch projects, screens, and download assets as images or HTML. Use when: (1) user asks to design a UI, app screen, or wireframe, (2) user wants to generate mockups from a text description, (3) user wants to list or download Stitch project assets, (4) user mentions Google Stitch or stitch.withgoogle.com."
---

# Google Stitch

Generate UI designs via the Google Stitch upstream MCP API at `stitch.googleapis.com/mcp`.
Powered by Gemini 3 Pro/Flash. Outputs screenshot PNGs + production-ready HTML/CSS.

## Prerequisites

Set `STITCH_API_KEY` env var. Obtain from: stitch.withgoogle.com → Profile → Stitch Settings → API Keys → Create Key.

## Quick Start

All commands via `scripts/stitch.sh` (resolve relative to this skill directory):

```bash
# Generate a design (creates project automatically, downloads images + HTML)
bash scripts/stitch.sh generate "A dashboard for fitness tracking" --model pro --output ./designs

# Generate into an existing project
bash scripts/stitch.sh generate "Analytics view with charts" --project 9755281677296540803 --output ./designs

# Mobile design
bash scripts/stitch.sh generate "E-commerce product page" --device mobile --output ./designs

# List projects / screens
bash scripts/stitch.sh list-projects
bash scripts/stitch.sh list-screens <project_id>

# Download a specific screen
bash scripts/stitch.sh download <project_id> <screen_id> --output ./designs

# List upstream MCP tools
bash scripts/stitch.sh tools
```

## Rate Limiting

**Enforced: 1 generate call per 5 minutes** (300 seconds). The script sleeps automatically if called too soon. Configurable via `RATE_LIMIT_SECONDS` in the script.

## How It Works

The script calls the upstream Stitch MCP server directly via JSON-RPC over HTTPS:
- Endpoint: `https://stitch.googleapis.com/mcp`
- Auth: `X-Goog-Api-Key` header with your Stitch API key
- Protocol: JSON-RPC 2.0 (`tools/call`, `tools/list`)

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `generate_screen_from_text` | Text prompt → UI screen (Gemini 3 Pro or Flash) |
| `create_project` | Create empty project container |
| `get_project` | Get project details + screen list |
| `list_projects` | List all user projects |
| `list_screens` | List screens in a project |
| `get_screen` | Get screen details + download URLs |
| `edit_screens` | Edit existing screens |
| `generate_variants` | Generate design variants |

## Models

| Model | Flag | Speed | Quality |
|-------|------|-------|---------|
| Gemini 3 Flash | `--model flash` (default) | Fast | Good |
| Gemini 3 Pro | `--model pro` | ~2-3 min | Best |

## Output

Auto-downloaded to `--output` directory:
- `<Title>_<screenId>.png` — screenshot (up to 2560px)
- `<Title>_<screenId>.html` — production HTML/CSS code

The generate response also includes AI suggestions for follow-up screens.

## Prompt Tips

- Be specific: include app type, target platform, key features, style
- Specify device: "desktop dashboard" vs "mobile app" vs "tablet"
- Mention style: "Material Design 3", "glassmorphism", "minimal", "corporate"
- Reference colors: "blue-purple brand, white background"
- Reference fonts: Inter, DM Sans, Space Grotesk, etc. (see API reference)

## Alternative: Community CLI

For project browsing and local preview, also available via `npx @_davideast/stitch-mcp`:
```bash
npx @_davideast/stitch-mcp view --projects
npx @_davideast/stitch-mcp serve -p <project-id>
```
Note: community CLI does NOT have `generate_screen_from_text` — use the skill script for generation.

## API Details

See [references/api-reference.md](references/api-reference.md) for full specs and auth methods.
