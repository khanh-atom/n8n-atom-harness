---
name: google-search
description: Open Google, perform a search, and return the page content of results as markdown.
last_verified: 2026-04-26
---

# Google Search

Opens `https://www.google.com/search?q=<query>` in a new tab and returns the results page content as markdown.

## Input

| Field | Required | Description |
|-------|----------|-------------|
| `query` | ✓ | Search term (also accepts `keyword` or `q`) |

## Output

```json
{
  "success": true,
  "query": "n8n automation",
  "searchUrl": "https://www.google.com/search?q=n8n+automation",
  "content": "...markdown of results page..."
}
```

## Flow

```
Subflow Trigger → Parse Input → List Pages → Open Google Search → Extract Page ID → Get Results Content → Format Response
```

1. **Parse Input** — extracts `query` / `keyword` / `q` from incoming data
2. **List Pages** — lists open tabs (for context, not strictly required)
3. **Open Google Search** — opens `google.com/search?q=<encoded query>` as a new page
4. **Extract Page ID** — parses the page ID from the `new_page` MCP response
5. **Get Results Content** — calls `get_page_content` on that page to get markdown
6. **Format Response** — returns `{ success, query, searchUrl, content }`

## Notes

- Google may show a cookie consent or CAPTCHA on first load. If `content` is empty or minimal, check the snapshot for blocking overlays.
- The `list_pages` step at the start is informational; the new tab is opened regardless.
- URL-encodes the query via `encodeURIComponent`, so spaces and special characters work correctly.

## Last verified

2026-04-26
