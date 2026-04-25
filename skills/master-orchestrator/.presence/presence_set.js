#!/usr/bin/env node
/**
 * presence_set.js — Update an agent's own presence status
 * Usage: node presence_set.js --agent senior-backend --status active --task "building auth" --project ahv-qlhv-be
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const get = (flag) => {
  const idx = args.indexOf(`--${flag}`);
  return idx !== -1 ? args[idx + 1] : null;
};

const agentId = get('agent');
const status = get('status');
const task = get('task');
const project = get('project');

if (!agentId || !status) {
  console.error('Usage: node presence_set.js --agent <id> --status <active|idle|failed|unknown> [--task "..."] [--project "..."]');
  process.exit(1);
}

const VALID_STATUSES = ['active', 'idle', 'failed', 'unknown'];
if (!VALID_STATUSES.includes(status)) {
  console.error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
  process.exit(1);
}

const filePath = path.join(__dirname, `${agentId}.json`);
const entry = {
  agent_id: agentId,
  status,
  task: task || null,
  project: project || null,
  updated_at: new Date().toISOString()
};

fs.writeFileSync(filePath, JSON.stringify(entry, null, 2));
console.log(`✅ ${agentId} → ${status}${task ? ` | ${task}` : ''}${project ? ` (@ ${project})` : ''}`);
