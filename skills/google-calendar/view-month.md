# google-calendar / view-month

Open Google Calendar in month view and extract all events as markdown.

## Input

_No input fields required._

## Output

Page content as markdown listing all events for the current month.

## Flow steps

1. **Open Calendar** — `new_page` → `https://calendar.google.com/calendar/r/month`
2. **Wait for Load** — 3-second wait for calendar to render
3. **Get Events** — `get_page_content` on the calendar page → returns markdown with all events

## Gotchas

- The calendar opens in month view for the **current month** automatically.
- You must be logged into Google in the browser for the calendar to load.
- Element IDs from snapshot become invalid after navigation — always re-snapshot after `new_page`.

## Last verified

2026-04-26 (April 2026 view confirmed working)
