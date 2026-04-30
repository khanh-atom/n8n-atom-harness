import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

export default definePluginEntry({
  id: "n8n-harness",
  name: "n8n Harness",
  description:
    "BrowserOS MCP automation workflows for n8n-atom-cli, exposed as an OpenClaw skill plugin.",
  register() {
    // Skill-only plugin. Runtime registration is intentionally empty.
  },
});
