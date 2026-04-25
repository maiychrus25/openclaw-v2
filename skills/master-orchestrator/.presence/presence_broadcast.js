#!/usr/bin/env node
/**
 * presence_broadcast.js — Read all agent presence files and format for Telegram
 * Used by master-orchestrator to broadcast status table
 */
const fs = require('fs');
const path = require('path');

const PRESENCE_DIR = __dirname;

const files = fs.readdirSync(PRESENCE_DIR).filter(f => f.endsWith('.json') && f !== 'schema.json');

const agents = files.map(file => {
  try {
    return JSON.parse(fs.readFileSync(path.join(PRESENCE_DIR, file), 'utf8'));
  } catch {
    return null;
  }
}).filter(Boolean);

const STATUS_SYMBOLS = {
  active: '🟢',
  idle: '⚪',
  failed: '🔴',
  unknown: '⚪'
};

const lines = [];
lines.push('🌐 *Orbis — Agent Presence Board*');
lines.push('');

const active = agents.filter(a => a.status === 'active');
const idle = agents.filter(a => a.status === 'idle');
const failed = agents.filter(a => a.status === 'failed');
const unknown = agents.filter(a => a.status === 'unknown');

lines.push(`🟢 Active: ${active.length}  ⚪ Idle: ${idle.length}  🔴 Failed: ${failed.length}  ⚪ Unknown: ${unknown.length}`);
lines.push('');

if (active.length) {
  lines.push('*Active:*');
  active.forEach(a => {
    lines.push(`  ${STATUS_SYMBOLS[a.status]} \`${a.agent_id}\` — ${a.task || 'no task'}${a.project ? ` (@ ${a.project})` : ''}`);
  });
  lines.push('');
}

if (failed.length) {
  lines.push('*Failed:*');
  failed.forEach(a => {
    lines.push(`  🔴 \`${a.agent_id}\` — ${a.task || 'no task'}`);
  });
  lines.push('');
}

if (!active.length && !failed.length) {
  lines.push('_No active or failed agents._');
}

console.log(lines.join('\n'));
