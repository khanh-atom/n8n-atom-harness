# google-calendar / view-specific-month

Open Google Calendar to a specific month and year, and extract all events as markdown.

## Input

```json
{
  "year": "2026",
  "month": "8"
}
```

## Output

Page content as markdown listing all events for the specified month.

## Workflow

See `view-specific-month.n8n` for the workflow. Run it using:

```bash
npm exec n8n-atom-cli run skills/google-calendar/view-specific-month.n8n --input '{"year": "2026", "month": "8"}'
```

## Gotchas

- You must be logged into Google in the browser for the calendar to load.
- Element IDs from snapshot become invalid after navigation — always re-snapshot after `new_page`.
- The `month` is 1-indexed (e.g., 1 for January, 8 for August).

## Last verified

2026-04-26
