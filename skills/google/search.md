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

## Workflow

See `search.n8n` for the workflow. Run it using:

```bash
npm exec n8n-atom-cli run skills/google/search.n8n --input '{"query": "your search term"}'
```

## Notes

- Google may show a cookie consent or CAPTCHA on first load. If `content` is empty or minimal, check the snapshot for blocking overlays.
- The `list_pages` step at the start is informational; the new tab is opened regardless.
- URL-encodes the query via `encodeURIComponent`, so spaces and special characters work correctly.

## Last verified

2026-04-26
