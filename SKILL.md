---
name: n8n-harness
description: Browser automation via BrowserOS MCP. Use .n8n workflow files with HTTP Request nodes to control the browser. Run with n8n-atom-cli.
---
# n8n-harness

Browser automation through **BrowserOS MCP** and **n8n workflows**. No Python, no CDP, no daemon — just `.n8n` files that make HTTP requests to the BrowserOS MCP server.

## ⚠️ Agent decision rule — read this first

> **Does a** `.n8n` **file exist in** `skills/` **for this task?**
>
> - **YES →** Run it with `n8n-atom-cli`. Do NOT call `mcp_browseros_*` tools directly.
> - **NO →** Call BrowserOS MCP directly (`mcp_browseros_*`), then write a new `.n8n` skill file.

Direct MCP calls (`mcp_browseros_*` tools, do not use curl) are a **fallback / authoring tool**, not the default. Using them when a skill already exists bypasses reusable, version-controlled workflows and defeats the purpose of this harness.

### Example — Google search

`skills/google/search.n8n` exists → **correct approach:**

```bash
npm exec n8n-atom-cli run skills/google/search.n8n --input '{"query": "hello world"}'
```

**Incorrect approach** (do NOT do this when the skill exists):

```
# ❌ Wrong: calling mcp_browseros_new_page directly
mcp_browseros_new_page(url="https://www.google.com/search?q=hello+world")
```

## How it works

```
Agent creates .n8n file → npm exec n8n-atom-cli runs it → HTTP POST to BrowserOS MCP → browser action
```

Every browser action is an HTTP POST to the BrowserOS MCP execute-tool endpoint (only use this in n8n workflow, do not use this directly)

```
POST http://localhost:6277/execute-tool
Origin: http://localhost:6274
Content-Type: application/json

{
  "toolName": "<mcp_tool_name>",
  "toolArgs": { ... },
  "server": {
    "command": "npx",
    "args": ["mcp-remote", "http://127.0.0.1:9001/mcp"]
  }
}
```

## Quick start

### Direct curl (for testing / one-off actions)

```bash
curl -X POST http://localhost:6277/execute-tool \
  -H "Origin: http://localhost:6274" \
  -H "Content-Type: application/json" \
  -d '{
    "toolName": "new_page",
    "toolArgs": {
      "url": "https://www.google.com",
      "hidden": false,
      "background": false
    },
    "server": {
      "command": "npx",
      "args": ["mcp-remote", "http://127.0.0.1:9001/mcp"]
    }
  }'
```

### Using existing .n8n skills

Check `skills/` for pre-built workflows. Run them with n8n-atom-cli:

```bash
npm exec n8n-atom-cli run skills/browseros/open-page.n8n
```

### Available skills

`skills/browseros/` — core browser primitives

- `open-page.n8n` — Open a new browser tab
- `take-snapshot.n8n` — Get interactive element IDs from a page
- `click-element.n8n` — Click an element by snapshot ID
- `fill-input.n8n` — Type text into an input field
- `get-page-content.n8n` — Extract page content as markdown
- `README.md` — Usage guide for all browseros subflows

`skills/google/` — Google automation

- `search.n8n` — Search Google and return results page content
- `search.md` — Input/output docs, flow notes, gotchas

## Two-tier skill strategy

| Situation | Action |
| --- | --- |
| `.n8n` skill exists | `npm exec n8n-atom-cli run skills/<site>/<action>.n8n` — **always prefer this** |
| Skill exists but is broken | Debug with direct MCP calls or curl, then **fix and save the** `.n8n` **file** |
| No skill yet | Call BrowserOS MCP directly; once working, **write the** `.n8n` **file** for reuse |

Direct MCP calls (`mcp_browseros_*` or curl) are only appropriate when:

- No `.n8n` skill file exists yet, **or**
- You are actively debugging a broken skill, **or**
- The action is truly one-off and will never be reused

Otherwise, **always run the** `.n8n` **file**.

## Core BrowserOS MCP tools

These are the most commonly used tools. All are called via `POST /execute-tool` with the tool name and args:

### Navigation & Pages

| Tool | Args | Description |
| --- | --- | --- |
| `new_page` | `url`, `background`, `hidden` | Open a new tab |
| `navigate_page` | `page`, `url`, `action` | Navigate, back, forward, reload |
| `list_pages` | — | List all open tabs |
| `close_page` | `page` | Close a tab |

### Observation

| Tool | Args | Description |
| --- | --- | --- |
| `take_snapshot` | `page` | Get interactive element IDs (use before clicking/filling) |
| `take_screenshot` | `page`, `fullPage` | Take a screenshot |
| `get_page_content` | `page`, `selector` | Extract page content as markdown |
| `get_page_links` | `page` | Extract all links |

### Interaction

| Tool | Args | Description |
| --- | --- | --- |
| `click` | `page`, `element` | Click an element by ID from snapshot |
| `fill` | `page`, `element`, `text` | Type text into an input |
| `select_option` | `page`, `element`, `value` | Select a dropdown option |
| `press_key` | `page`, `key` | Press a key combination |
| `scroll` | `page`, `direction`, `amount` | Scroll the page |
| `hover` | `page`, `element` | Hover over an element |
| `check` / `uncheck` | `page`, `element` | Toggle a checkbox |

### Advanced

| Tool | Args | Description |
| --- | --- | --- |
| `evaluate_script` | `page`, `expression` | Run JavaScript in page context |
| `search_dom` | `page`, `query` | Search DOM by text/CSS/XPath |
| `upload_file` | `page`, `element`, `files` | Upload files to a file input |
| `download_file` | `page`, `element`, `path` | Download a file |

## Writing .n8n workflow files

An `.n8n` file is JSON with this structure:

```json
{
  "name": "My Workflow",
  "nodes": [ ... ],
  "connections": { ... },
  "settings": { "executionOrder": "v1" },
  "pinData": {}
}
```

### Standard node pattern for MCP calls

Every BrowserOS MCP call in n8n uses the **HTTP Request** node:

```json
{
  "parameters": {
    "method": "POST",
    "url": "http://localhost:6277/execute-tool",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        { "name": "Origin", "value": "http://localhost:6274" },
        { "name": "Content-Type", "value": "application/json" }
      ]
    },
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "={{ JSON.stringify({ toolName: 'new_page', toolArgs: { url: 'https://example.com' }, server: { command: 'npx', args: ['mcp-remote', 'http://127.0.0.1:9001/mcp'] } }) }}",
    "options": { "timeout": 30000 }
  },
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2
}
```

### Observe → Act → Verify pattern

1. **Take snapshot** before interacting — it returns element IDs like `[47]`
2. **Use those IDs** with click, fill, select_option
3. **After navigation**, element IDs are invalid — take a new snapshot
4. **Verify** the result with another snapshot or screenshot

### Multi-step workflow example

Chain nodes for complex flows: Open page → Snapshot → Click → Fill → Submit:

```
Subflow Trigger → Open Page (HTTP) → Snapshot (HTTP) → Click Login (HTTP) → Fill Email (HTTP) → Submit (HTTP) → Verify (HTTP)
```

## Contributing skills

Every skill lives in `skills/<site-name>/` and includes **both** an `.n8n` workflow file and a `.md` documentation file:

```
skills/
├── browseros/                       # core browser primitives
│   ├── README.md                    # usage guide for all subflows
│   ├── open-page.n8n
│   ├── take-snapshot.n8n
│   ├── click-element.n8n
│   ├── fill-input.n8n
│   └── get-page-content.n8n
├── google/                          # domain skill
│   ├── search.md
│   └── search.n8n
├── github/                          # domain skill (example)
│   ├── star-repo.md
│   └── star-repo.n8n
└── <site>/
    ├── <action>.md
    └── <action>.n8n
```

### Rules

- **One folder per site** — `skills/<site-name>/`
- **Each workflow gets a companion** `.md` documenting: input fields, output shape, gotchas, last verified date
- `.md` **must reference the** `.n8n` **file and provide the exact command to run it** — do NOT put detailed flow steps or MCP tool names in the `.md`. Instead, point to the `.n8n` file and provide the CLI command (e.g. `npm exec n8n-atom-cli run skills/google-calendar/view-month.n8n`). Detailed steps in `.md` mislead agents into calling MCP directly instead of running the `.n8n` workflow.
- **File names are the action only** — `search.n8n`, not `google-search.n8n`
- **Core browser primitives** go in `skills/browseros/`
- **Read the** `.md` **first** before running or editing the `.n8n`