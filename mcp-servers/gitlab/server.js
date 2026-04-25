#!/usr/bin/env node
/**
 * AHV GitLab MCP Server
 * Self-contained — uses local node_modules
 * Reads GITLAB_URL + GITLAB_TOKEN from env or .env file
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
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const [k, ...v] = line.split("=");
      if (k && v.length && !process.env[k.trim()]) {
        process.env[k.trim()] = v.join("=").trim();
      }
    }
  } catch {}
}
loadEnv();

const GITLAB_URL = process.env.GITLAB_URL || "https://gitlab.com";
const GITLAB_TOKEN = process.env.GITLAB_TOKEN || "";

// ── HTTP helper ─────────────────────────────────────────────────────────────
function gitlabFetch(path, opts = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(GITLAB_URL + path);
    const req = https.request(
      { hostname: url.hostname, path: url.pathname + url.search, method: opts.method || "GET",
        headers: { "PRIVATE-TOKEN": GITLAB_TOKEN, "Content-Type": "application/json", ...opts.headers } },
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

// ── Project search ────────────────────────────────────────────────────────────
async function searchProjects(query) {
  const res = await gitlabFetch(`/api/v4/projects?search=${encodeURIComponent(query)}&membership=true&per_page=20`);
  if (!res.ok) throw new Error(`GitLab error ${res.status}: ${JSON.stringify(res.body)}`);
  return res.body.map(p => ({ id: p.id, name: p.name, path: p.path_with_namespace, web_url: p.web_url, description: p.description }));
}

// ── MR listing ────────────────────────────────────────────────────────────────
async function listMRs(projectPath, state = "opened") {
  const encoded = encodeURIComponent(projectPath);
  const res = await gitlabFetch(`/api/v4/projects/${encoded}/merge_requests?state=${state}&per_page=20`);
  if (!res.ok) throw new Error(`GitLab error ${res.status}`);
  return res.body.map(m => ({ iid: m.iid, title: m.title, state: m.state, author: m.author.username, source: m.source_branch, target: m.target_branch, web_url: m.web_url }));
}

// ── Pipeline trigger ────────────────────────────────────────────────────────
async function triggerPipeline(projectPath, ref = "main", variables = []) {
  const encoded = encodeURIComponent(projectPath);
  const body = JSON.stringify({ ref, variables });
  const res = await gitlabFetch(`/api/v4/projects/${encoded}/pipeline`, { method: "POST", body });
  if (!res.ok) throw new Error(`GitLab error ${res.status}`);
  return res.body;
}

// ── List branches ───────────────────────────────────────────────────────────
async function listBranches(projectPath) {
  const encoded = encodeURIComponent(projectPath);
  const res = await gitlabFetch(`/api/v4/projects/${encoded}/repository/branches?per_page=50`);
  if (!res.ok) throw new Error(`GitLab error ${res.status}`);
  return res.body.map(b => ({ name: b.name, committed: b.commit.committed_date }));
}

// ── Create MR ────────────────────────────────────────────────────────────────
async function createMR(projectPath, opts = {}) {
  const encoded = encodeURIComponent(projectPath);
  const body = JSON.stringify({ source_branch: opts.source_branch, target_branch: opts.target_branch || "main", title: opts.title, description: opts.description || "" });
  const res = await gitlabFetch(`/api/v4/projects/${encoded}/merge_requests`, { method: "POST", body });
  if (!res.ok) throw new Error(`GitLab error ${res.status}`);
  return res.body;
}

// ── List issues ──────────────────────────────────────────────────────────────
async function listIssues(projectPath, state = "opened") {
  const encoded = encodeURIComponent(projectPath);
  const res = await gitlabFetch(`/api/v4/projects/${encoded}/issues?state=${state}&per_page=20`);
  if (!res.ok) throw new Error(`GitLab error ${res.status}`);
  return res.body.map(i => ({ iid: i.iid, title: i.title, state: i.state, labels: i.labels, web_url: i.web_url }));
}

// ── MCP Server ───────────────────────────────────────────────────────────────
const server = new Server({ name: "ahv-mcp-gitlab", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: "search_projects", description: "Search GitLab projects", inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] } },
    { name: "list_merge_requests", description: "List merge requests in a project", inputSchema: { type: "object", properties: { project_path: { type: "string", description: "e.g. group/project" }, state: { type: "string", enum: ["opened", "merged", "closed"] } }, required: ["project_path"] } },
    { name: "trigger_pipeline", description: "Trigger a GitLab CI pipeline", inputSchema: { type: "object", properties: { project_path: { type: "string" }, ref: { type: "string" }, variables: { type: "array", items: { type: "object", properties: { key: { type: "string" }, value: { type: "string" } } } } }, required: ["project_path", "ref"] } },
    { name: "list_branches", description: "List branches in a project", inputSchema: { type: "object", properties: { project_path: { type: "string" } }, required: ["project_path"] } },
    { name: "create_merge_request", description: "Create a merge request", inputSchema: { type: "object", properties: { project_path: { type: "string" }, source_branch: { type: "string" }, target_branch: { type: "string" }, title: { type: "string" }, description: { type: "string" } }, required: ["project_path", "source_branch", "title"] } },
    { name: "list_issues", description: "List issues in a project", inputSchema: { type: "object", properties: { project_path: { type: "string" }, state: { type: "string", enum: ["opened", "closed", "all"] } }, required: ["project_path"] } },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (event) => {
  const { name, arguments: args = {} } = event.params;
  try {
    let result;
    switch (name) {
      case "search_projects": result = await searchProjects(args.query); break;
      case "list_merge_requests": result = await listMRs(args.project_path, args.state); break;
      case "trigger_pipeline": result = await triggerPipeline(args.project_path, args.ref, args.variables || []); break;
      case "list_branches": result = await listBranches(args.project_path); break;
      case "create_merge_request": result = await createMR(args.project_path, args); break;
      case "list_issues": result = await listIssues(args.project_path, args.state); break;
      default: throw new Error(`Unknown tool: ${name}`);
    }
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  } catch (err) {
    return { content: [{ type: "text", text: `Error: ${err.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
server.connect(transport).catch(err => { console.error("[ahv-mcp-gitlab] FATAL:", err); process.exit(1); });
