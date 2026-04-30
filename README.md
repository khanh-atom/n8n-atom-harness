# n8n-harness

Browser automation via **BrowserOS MCP** and **n8n workflow files**.

No Python, no CDP daemon, no framework — just `.n8n` workflow files that make HTTP requests to BrowserOS MCP.

## OpenClaw plugin

This repository is also an OpenClaw skill plugin:

- `openclaw.plugin.json` declares the `n8n-harness` plugin.
- `index.ts` is the OpenClaw runtime entry. It is intentionally a no-op because the plugin ships skills, not runtime tools.
- `SKILL.md` is exposed to OpenClaw via the manifest `skills: ["./"]`.

For local development, link this repo into OpenClaw:

```bash
openclaw plugins install -l .
openclaw plugins inspect n8n-harness
```

If this repo is placed under a workspace `.openclaw/extensions/` directory instead, enable it explicitly:

```bash
openclaw plugins enable n8n-harness
```

## Architecture

```
┌──────────────────────────┐
│ .n8n workflow file       │
│ (HTTP Request nodes)     │
└──────────┬───────────────┘
           │ POST /execute-tool
           ▼
┌──────────────────────────┐
│ BrowserOS MCP Server     │
│ localhost:6277            │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Browser (full control)   │
└──────────────────────────┘
```

## Quick start

1. Ensure BrowserOS MCP is running on `localhost:6277`
2. Run a skill: `npm exec n8n-atom-cli run skills/browseros/open-page.n8n`
3. Or call MCP directly:

```bash
curl -X POST http://localhost:6277/execute-tool \
  -H "Origin: http://localhost:6274" \
  -H "Content-Type: application/json" \
  -d '{
    "toolName": "new_page",
    "toolArgs": { "url": "https://www.google.com", "hidden": false, "background": false },
    "server": { "command": "npx", "args": ["mcp-remote", "http://127.0.0.1:9001/mcp"] }
  }'
```

## Skills

Pre-built `.n8n` workflow files in `skills/`:

| Skill | Description |
|-------|-------------|
| `browseros-open-page.n8n` | Open a new browser page |
| `browseros-take-snapshot.n8n` | Get interactive element IDs |
| `browseros-click-element.n8n` | Click an element |
| `browseros-fill-input.n8n` | Type into an input field |
| `browseros-get-page-content.n8n` | Extract page content as markdown |

See [SKILL.md](SKILL.md) for full documentation, all available MCP tools, and how to write new skills.

## How to create new skills

1. Use BrowserOS MCP directly to accomplish your task
2. Once you have the working flow, save it as a `.n8n` workflow file in `skills/`
3. Name it `<site>-<action>.n8n` for site-specific skills

## License

MIT
