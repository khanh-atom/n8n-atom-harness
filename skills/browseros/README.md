---
name: browseros-core
description: Core BrowserOS MCP browser primitives. Use these subflows to open pages, snapshot elements, click, fill, and extract content.
---

# BrowserOS Core Skills

Core browser automation subflows. Each wraps a single BrowserOS MCP tool call as an n8n subflow.

All subflows accept data from a parent workflow via the **Execute Workflow Trigger** node.

## Available subflows

| File | Tool | Input fields | Description |
|------|------|-------------|-------------|
| `open-page.n8n` | `new_page` | `url`, `hidden?`, `background?` | Open a new browser tab |
| `take-snapshot.n8n` | `take_snapshot` | `page` | Get interactive element IDs from a page |
| `click-element.n8n` | `click` | `page`, `element`, `button?`, `clickCount?` | Click an element by snapshot ID |
| `fill-input.n8n` | `fill` | `page`, `element`, `text`, `clear?` | Type text into an input field |
| `get-page-content.n8n` | `get_page_content` | `page`, `selector?`, `includeLinks?`, `includeImages?` | Extract page content as markdown |

## Usage pattern

**Always observe before acting:**

1. `open-page.n8n` — navigate to a URL
2. `take-snapshot.n8n` — get element IDs (`[47]`, `[52]`, ...)
3. `click-element.n8n` or `fill-input.n8n` — interact using those IDs
4. After navigation, re-snapshot — element IDs change after page loads

## MCP endpoint

All calls go to:

```
POST http://localhost:6277/execute-tool
Origin: http://localhost:6274
server: { command: "npx", args: ["mcp-remote", "http://127.0.0.1:9001/mcp"] }
```

## Last verified

2026-04-26
