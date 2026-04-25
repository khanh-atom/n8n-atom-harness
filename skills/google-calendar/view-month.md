# google-calendar / view-month

Open Google Calendar in month view and extract all events as markdown.

## Input

_No input fields required._

## Output

Page content as markdown listing all events for the current month.

## Workflow

See `view-month.n8n` for the workflow. Run it using:

```bash
npm exec n8n-atom-cli run skills/google-calendar/view-month.n8n
```

## Gotchas

- The calendar opens in month view for the **current month** automatically.
- You must be logged into Google in the browser for the calendar to load.
- Element IDs from snapshot become invalid after navigation — always re-snapshot after `new_page`.

## Last verified

2026-04-26 (April 2026 view confirmed working)
