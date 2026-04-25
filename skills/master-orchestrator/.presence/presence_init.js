#!/usr/bin/env node
/**
 * presence_init.js — Initialize .presence.json for all 34 agents
 */
const fs = require('fs');
const path = require('path');

const AGENTS = [
  'master-orchestrator',
  'prompt-optimizer',
  'agile-product-owner',
  'market-intelligence',
  'product-strategy',
  'content-strategy',
  'ai-seo',
  'seo-audit',
  'product-marketing-context',
  'senior-architect',
  'database-schema-designer',
  'database-reviewer',
  'ui-design-system',
  'ui-ux-pro-max',
  'epic-design',
  'stitch-design',
  'stitch-loop',
  'senior-backend',
  'senior-frontend',
  'shadcn-expert',
  'clean-code',
  'coding-standards',
  'typescript-reviewer',
  'refactor-cleaner',
  'realistic-seeder',
  'planner',
  'senior-qa',
  'code-reviewer',
  'playwright-pro',
  'performance-optimizer',
  'senior-security',
  'security-reviewer',
  'senior-devops',
  'harness-optimizer'
];

const PRESENCE_DIR = __dirname;

AGENTS.forEach(agentId => {
  const filePath = path.join(PRESENCE_DIR, `${agentId}.json`);
  if (!fs.existsSync(filePath)) {
    const entry = {
      agent_id: agentId,
      status: 'unknown',
      task: null,
      project: null,
      updated_at: new Date().toISOString()
    };
    fs.writeFileSync(filePath, JSON.stringify(entry, null, 2));
    console.log(`✅ Initialized: ${agentId}`);
  } else {
    console.log(`⏩ Already exists: ${agentId}`);
  }
});

console.log(`\n🎉 Presence system initialized for ${AGENTS.length} agents.`);
