#!/usr/bin/env node
/**
 * AHV Stitch MCP Server
 * Self-contained — uses local node_modules
 * Reads STITCH_API_KEY from env or .env file
 */
import { Server } from "./node_modules/@modelcontextprotocol/sdk/dist/esm/server/index.js";
import { StdioServerTransport } from "./node_modules/@modelcontextprotocol/sdk/dist/esm/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "./node_modules/@modelcontextprotocol/sdk/dist/esm/types.js";
import https from "https";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load .env if exists ────────────────────────────────────────────────────
function loadEnv() {
  try {
    const envPath = resolve(__dirname, ".env");
    const lines = readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const [k, ...v] = line.split("=");
      if (k && v.length && !process.env[k.trim()]) {
        process.env[k.trim()] = v.join("=").trim();
      }
    }
  } catch {}
}
loadEnv();

const STITCH_URL = "https://stitch.googleapis.com/mcp";
const POLL_INTERVAL_MS = 5000;
const MAX_WAIT_MS = 300000;

const API_KEY = process.env.STITCH_API_KEY || "";

// ── HTTP helper ─────────────────────────────────────────────────────────────
function httpFetch(url, body, timeoutMs = 90000) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const params = new URLSearchParams({ key: API_KEY });
    const fullPath = `${u.pathname}?${params.toString()}`;
    const req = https.request(
      { hostname: u.hostname, path: fullPath, method: "POST",
        headers: { "Content-Type": "application/json", "X-Goog-Api-Key": API_KEY,
                   "Content-Length": Buffer.byteLength(body) } },
      res => { let d = ""; res.on("data", c => d += c); res.on("end", () => resolve({ ok: res.statusCode < 300, status: res.statusCode, body: d })); }
    );
    req.on("error", reject);
    req.setTimeout(timeoutMs, () => { req.destroy(); reject(new Error("timeout")); });
    req.write(body); req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Poll for async results ───────────────────────────────────────────────────
async function pollForResult(sessionId) {
  const start = Date.now();
  while (Date.now() - start < MAX_WAIT_MS) {
    await sleep(POLL_INTERVAL_MS);
    const body = JSON.stringify({
      jsonrpc: "2.0", id: 3, method: "tools/call",
      params: { name: "get_generation_result", arguments: { sessionId } }
    });
    try {
      const result = await httpFetch(STITCH_URL, body, 15000);
      if (!result.ok) continue;
      const parsed = JSON.parse(result.body);
      const out = parsed?.result?.structuredContent ?? parsed?.result;
      if (out?.status === "COMPLETE" || out?.status === "success" || out?.outputComponents?.length > 0) return out;
    } catch {}
  }
  throw new Error("Generation timed out after 5 minutes");
}

// ── Handle generate_screen ───────────────────────────────────────────────────
async function handleGenerateScreen(args) {
  const submitBody = JSON.stringify({
    jsonrpc: "2.0", id: 2, method: "tools/call",
    params: { name: "generate_screen_from_text", arguments: args }
  });
  const submitResult = await httpFetch(STITCH_URL, submitBody, 90000);
  if (!submitResult.ok) throw new Error(`Stitch error ${submitResult.status}`);
  const parsed = JSON.parse(submitResult.body);
  const inline = parsed?.result?.structuredContent ?? parsed?.result;
  if (inline?.outputComponents?.length > 0 || inline?.status === "COMPLETE") return inline;
  const sessionId = parsed?.result?.content?.[0]?.text?.sessionId || inline?.sessionId;
  if (!sessionId) return parsed.result || inline || parsed;
  return await pollForResult(sessionId);
}

// ── MCP Server ───────────────────────────────────────────────────────────────
const server = new Server({ name: "ahv-mcp-stitch", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: "list_projects", description: "List all Stitch projects", inputSchema: { type: "object", properties: {} } },
    { name: "get_project", description: "Get a Stitch project by ID", inputSchema: { type: "object", properties: { projectId: { type: "string" } }, required: ["projectId"] } },
    {
      name: "generate_screen_from_text",
      description: "Generate a UI screen from a text prompt (async — handles long generation times)",
      inputSchema: {
        type: "object",
        properties: { projectId: { type: "string" }, prompt: { type: "string" }, deviceType: { type: "string", enum: ["MOBILE", "DESKTOP", "TABLET"] }, modelId: { type: "string" } },
        required: ["projectId", "prompt"],
      },
    },
    { name: "list_screens", description: "List all screens in a project", inputSchema: { type: "object", properties: { projectId: { type: "string" } }, required: ["projectId"] } },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (event) => {
  const { name, arguments: args = {} } = event.params;
  try {
    let result;
    if (name === "generate_screen_from_text") {
      result = await handleGenerateScreen(args);
    } else {
      const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } });
      const res = await httpFetch(STITCH_URL, body, 30000);
      if (!res.ok) throw new Error(`Stitch API error ${res.status}`);
      const parsed = JSON.parse(res.body);
      if (parsed.error) throw new Error(JSON.stringify(parsed.error));
      result = parsed.result;
    }
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  } catch (err) {
    return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
server.connect(transport).catch(err => { console.error("[ahv-mcp-stitch] FATAL:", err); process.exit(1); });
