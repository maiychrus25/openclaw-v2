#!/usr/bin/env node
/**
 * Figma MCP Server for OpenClaw
 * Implements standard MCP tools using Figma REST API + PAT
 */
import { Server } from './node_modules/@modelcontextprotocol/sdk/dist/esm/server/index.js';
import { StdioServerTransport } from './node_modules/@modelcontextprotocol/sdk/dist/esm/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from './node_modules/@modelcontextprotocol/sdk/dist/esm/types.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));

const FIGMA_TOKEN = process.env.FIGMA_TOKEN || '';
const FIGMA_API  = 'https://api.figma.com/v1';

if (!FIGMA_TOKEN) {
  console.error('FIGMA_TOKEN environment variable is required');
  process.exit(1);
}

async function figmaRequest(path, options = {}) {
  const res = await fetch(`${FIGMA_API}${path}`, {
    ...options,
    headers: {
      'X-Figma-Token': FIGMA_TOKEN,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.err || `Figma API error ${res.status}`);
  return data;
}

const TOOLS = [
  {
    name: 'figma_get_file',
    description: 'Get a Figma file with all its nodes',
    inputSchema: {
      type: 'object',
      properties: {
        file_key: { type: 'string', description: 'Figma file key (from URL: figma.com/file/{key}/...)' },
        depth: { type: 'integer', description: 'Nesting depth (1-4, default 1)', default: 1 }
      },
      required: ['file_key']
    }
  },
  {
    name: 'figma_get_file_nodes',
    description: 'Get specific nodes from a Figma file by node IDs',
    inputSchema: {
      type: 'object',
      properties: {
        file_key: { type: 'string', description: 'Figma file key' },
        ids: { type: 'string', description: 'Comma-separated node IDs (e.g. 1:2,1:3)' },
        depth: { type: 'integer', description: 'Nesting depth', default: 1 }
      },
      required: ['file_key', 'ids']
    }
  },
  {
    name: 'figma_get_comments',
    description: 'Get all comments on a Figma file',
    inputSchema: {
      type: 'object',
      properties: {
        file_key: { type: 'string', description: 'Figma file key' }
      },
      required: ['file_key']
    }
  },
  {
    name: 'figma_get_versions',
    description: 'Get version history of a Figma file',
    inputSchema: {
      type: 'object',
      properties: {
        file_key: { type: 'string', description: 'Figma file key' }
      },
      required: ['file_key']
    }
  },
  {
    name: 'figma_search',
    description: 'Search Figma team files',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        type: { type: 'string', enum: ['files', 'components', 'styles'], description: 'Search type', default: 'files' }
      },
      required: ['query']
    }
  },
  {
    name: 'figma_get_team_components',
    description: 'Get all components in a team library',
    inputSchema: {
      type: 'object',
      properties: {
        team_id: { type: 'string', description: 'Figma team ID' },
        page_size: { type: 'integer', default: 50 }
      },
      required: ['team_id']
    }
  },
  {
    name: 'figma_get_styles',
    description: 'Get all styles in a team library',
    inputSchema: {
      type: 'object',
      properties: {
        team_id: { type: 'string', description: 'Figma team ID' }
      },
      required: ['team_id']
    }
  },
  {
    name: 'figma_get_images',
    description: 'Export Figma nodes as images',
    inputSchema: {
      type: 'object',
      properties: {
        file_key: { type: 'string', description: 'Figma file key' },
        ids: { type: 'string', description: 'Comma-separated node IDs' },
        format: { type: 'string', enum: ['png', 'svg', 'jpg', 'pdf'], default: 'png' },
        scale: { type: 'number', description: 'Scale factor', default: 1 }
      },
      required: ['file_key', 'ids']
    }
  }
];

const server = new Server(
  { name: 'figma-mcp', version: '1.0.0' },
  {
    capabilities: {
      tools: {}
    }
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      case 'figma_get_file':
        result = await figmaRequest(`/files/${args.file_key}?depth=${args.depth || 1}&plugin_data=source`);
        break;

      case 'figma_get_file_nodes':
        result = await figmaRequest(
          `/files/${args.file_key}/nodes?ids=${args.ids}&depth=${args.depth || 1}`
        );
        break;

      case 'figma_get_comments':
        result = await figmaRequest(`/files/${args.file_key}/comments`);
        break;

      case 'figma_get_versions':
        result = await figmaRequest(`/files/${args.file_key}/versions`);
        break;

      case 'figma_search':
        result = await figmaRequest(`/search?q=${encodeURIComponent(args.query)}&type=${args.type || 'files'}`);
        break;

      case 'figma_get_team_components':
        result = await figmaRequest(`/teams/${args.team_id}/components?page_size=${args.page_size || 50}`);
        break;

      case 'figma_get_styles':
        result = await figmaRequest(`/teams/${args.team_id}/styles`);
        break;

      case 'figma_get_images':
        const imgRes = await figmaRequest(
          `/images/${args.file_key}?ids=${args.ids}&format=${args.format || 'png'}&scale=${args.scale || 1}`
        );
        result = imgRes;
        break;

      default:
        return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
    };
  } catch (err) {
    return {
      content: [{ type: 'text', text: `Error: ${err.message}` }],
      isError: true
    };
  }
});

const transport = new StdioServerTransport();
server.connect(transport).catch(err => {
  console.error('Server error:', err);
  process.exit(1);
});
