# n8n-harness install

## Prerequisites

1. **BrowserOS MCP Server** running on `localhost:6277`
2. **n8n-atom-cli** installed and available on `$PATH`
3. **npx** available (comes with Node.js)

## Verify BrowserOS MCP is running

```bash
curl -s http://localhost:6277/health || echo "BrowserOS MCP not running"
```

## Quick test

Open a browser page via direct curl:

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

If this returns a result, the setup is working.

## Run a skill workflow

```bash
npm exec n8n-atom-cli run skills/browseros/open-page.n8n
```

## Endpoints

| Endpoint | Purpose |
|----------|---------|
| `http://localhost:6277/execute-tool` | BrowserOS MCP tool execution |
| `http://127.0.0.1:9001/mcp` | MCP remote transport |

## Next steps

Read [SKILL.md](SKILL.md) for full usage documentation and available tools.
