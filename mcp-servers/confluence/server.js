#!/usr/bin/env node
/**
 * AHV Confluence MCP Server
 * Self-contained — uses local node_modules
 * Reads CONFLUENCE_URL, CONFLUENCE_EMAIL, CONFLUENCE_TOKEN from env or .env
 */
import { Server } from "./node_modules/@modelcontextprotocol/sdk/dist/esm/server/index.js";
import { StdioServerTransport } from "./node_modules/@modelcontextprotocol/sdk/dist/esm/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "./node_modules/@modelcontextprotocol/sdk/dist/esm/types.js";
import https from "https";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load .env ───────────────────────────────────────────────────────────────
function loadEnv() {
  try {
    const envPath = resolve(__dirname, ".env");
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const [k, ...v] = line.split("=");
      if (k && v.length && !process.env[k.trim()]) {
        process.env[k.trim()] = v.join("=").trim();
      }
    }
  } catch {}
}
loadEnv();

const BASE_URL = (process.env.CONFLUENCE_URL || "").replace(/\/$/, "");
const EMAIL = process.env.CONFLUENCE_EMAIL || "";
const TOKEN = process.env.CONFLUENCE_TOKEN || "";
const AUTH = Buffer.from(`${EMAIL}:${TOKEN}`).toString("base64");

// ── HTTP helper ─────────────────────────────────────────────────────────────
function cfFetch(path, opts = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const req = https.request(
      { hostname: url.hostname, path: url.pathname + url.search, method: opts.method || "GET",
        headers: { "Authorization": `Basic ${AUTH}`, "Content-Type": "application/json", "Accept": "application/json", ...opts.headers } },
      res => { let d = ""; res.on("data", c => d += c); res.on("end", () => {
        try { resolve({ ok: res.statusCode < 400, status: res.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ ok: res.statusCode < 400, status: res.statusCode, body: d }); }
      }); }
    );
    req.on("error", reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error("timeout")); });
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

// ── Tools ────────────────────────────────────────────────────────────────────
async function searchPages(query, spaceKey = "") {
  const qs = new URLSearchParams({ cql: `type=page${spaceKey ? ` AND space="${spaceKey}"` : ""} AND text~"${query}"` });
  const res = await cfFetch(`/wiki/rest/api/content/search?${qs}`);
  if (!res.ok) throw new Error(`Confluence error ${res.status}`);
  return res.body.results.map(p => ({ id: p.id, title: p.title, space: p.space.key, url: `${BASE_URL}${p._links.webui}` }));
}

async function getPage(pageId) {
  const res = await cfFetch(`/wiki/rest/api/content/${pageId}?expand=body.storage,version,space`);
  if (!res.ok) throw new Error(`Confluence error ${res.status}`);
  const p = res.body;
  return { id: p.id, title: p.title, space: p.space.key, version: p.version.number, body: p.body.storage.value, url: `${BASE_URL}${p._links.webui}` };
}

async function createPage(opts = {}) {
  const body = JSON.stringify({ type: "page", title: opts.title, space: { key: opts.space }, body: { storage: { value: opts.body || "", representation: "storage" } }, ancestors: opts.parentId ? [{ id: opts.parentId }] : undefined });
  const res = await cfFetch("/wiki/rest/api/content", { method: "POST", body });
  if (!res.ok) throw new Error(`Confluence error ${res.status}`);
  const p = res.body;
  return { id: p.id, title: p.title, space: p.space.key, url: `${BASE_URL}${p._links.webui}` };
}

async function updatePage(pageId, opts = {}) {
  // Get current version
  const current = await cfFetch(`/wiki/rest/api/content/${pageId}?expand=version`);
  if (!current.ok) throw new Error(`Confluence error ${current.status}`);
  const newVersion = (current.body.version.number || 0) + 1;
  const body = JSON.stringify({ version: { number: newVersion }, title: opts.title, body: { storage: { value: opts.body || "", representation: "storage" } } });
  const res = await cfFetch(`/wiki/rest/api/content/${pageId}`, { method: "PUT", body });
  if (!res.ok) throw new Error(`Confluence error ${res.status}`);
  return res.body;
}

async function listSpaces(limit = 25) {
  const res = await cfFetch(`/wiki/rest/api/space?limit=${limit}`);
  if (!res.ok) throw new Error(`Confluence error ${res.status}`);
  return res.body.results.map(s => ({ key: s.key, name: s.name, url: `${BASE_URL}${s._links.webui}` }));
}

async function getCurrentUser() {
  const res = await cfFetch("/wiki/rest/api/user/current");
  if (!res.ok) throw new Error(`Confluence error ${res.status}`);
  return res.body;
}

// ── MCP Server ───────────────────────────────────────────────────────────────
const server = new Server({ name: "ahv-mcp-confluence", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: "search_pages", description: "Search Confluence pages by keyword", inputSchema: { type: "object", properties: { query: { type: "string" }, space_key: { type: "string" } }, required: ["query"] } },
    { name: "get_page", description: "Get a Confluence page by ID", inputSchema: { type: "object", properties: { page_id: { type: "string" } }, required: ["page_id"] } },
    { name: "create_page", description: "Create a new Confluence page", inputSchema: { type: "object", properties: { title: { type: "string" }, space: { type: "string" }, body: { type: "string" }, parent_id: { type: "string" } }, required: ["title", "space"] } },
    { name: "update_page", description: "Update an existing Confluence page", inputSchema: { type: "object", properties: { page_id: { type: "string" }, title: { type: "string" }, body: { type: "string" } }, required: ["page_id"] } },
    { name: "list_spaces", description: "List Confluence spaces", inputSchema: { type: "object", properties: { limit: { type: "number" } } } },
    { name: "get_current_user", description: "Get current authenticated user", inputSchema: { type: "object", properties: {} } },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (event) => {
  const { name, arguments: args = {} } = event.params;
  try {
    let result;
    switch (name) {
      case "search_pages": result = await searchPages(args.query, args.space_key); break;
      case "get_page": result = await getPage(args.page_id); break;
      case "create_page": result = await createPage(args); break;
      case "update_page": result = await updatePage(args.page_id, args); break;
      case "list_spaces": result = await listSpaces(args.limit); break;
      case "get_current_user": result = await getCurrentUser(); break;
      default: throw new Error(`Unknown tool: ${name}`);
    }
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  } catch (err) {
    return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
server.connect(transport).catch(err => { console.error("[ahv-mcp-confluence] FATAL:", err); process.exit(1); });
