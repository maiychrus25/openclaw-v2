#!/usr/bin/env node
/**
 * GitLab MCP Server Wrapper
 * Wraps GitLab REST API as MCP tool server
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// Embedded credentials (gateway doesn't pass env vars to MCP subprocesses)
const GITLAB_TOKEN = 'glpat-c_N4qQVxbcktRro-S5rdwGM6MQpvOjEKdTpoZDBsYg8.01.170axqn65';
const GITLAB_API_URL = (process.env.GITLAB_API_URL || 'https://gitlab.com/api/v4').replace(/\/$/, '');

if (!GITLAB_TOKEN) {
  console.error('GITLAB_PERSONAL_ACCESS_TOKEN environment variable is not set');
  process.exit(1);
}

async function gitlabApi(path, options = {}) {
  const url = `${GITLAB_API_URL}${path}`;
  const resp = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${GITLAB_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(`GitLab API ${resp.status}: ${text}`);
  }
  return JSON.parse(text);
}

const server = new Server({ name: 'gitlab-mcp', version: '1.0.0' }, {
  capabilities: { tools: {} }
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'gitlab_search_projects',
      description: 'Search GitLab projects',
      inputSchema: {
        type: 'object',
        properties: {
          search: { type: 'string' },
          per_page: { type: 'number', default: 20 }
        }
      }
    },
    {
      name: 'gitlab_get_project',
      description: 'Get GitLab project details by ID or path',
      inputSchema: {
        type: 'object',
        properties: {
          project_id: { type: 'string' }
        },
        required: ['project_id']
      }
    },
    {
      name: 'gitlab_list_branches',
      description: 'List branches of a project',
      inputSchema: {
        type: 'object',
        properties: {
          project_id: { type: 'string' }
        },
        required: ['project_id']
      }
    },
    {
      name: 'gitlab_create_branch',
      description: 'Create a new branch',
      inputSchema: {
        type: 'object',
        properties: {
          project_id: { type: 'string' },
          branch: { type: 'string' },
          ref: { type: 'string', description: 'Source branch or commit SHA' }
        },
        required: ['project_id', 'branch', 'ref']
      }
    },
    {
      name: 'gitlab_get_file',
      description: 'Get file contents from a project',
      inputSchema: {
        type: 'object',
        properties: {
          project_id: { type: 'string' },
          file_path: { type: 'string' },
          ref: { type: 'string', default: 'main' }
        },
        required: ['project_id', 'file_path']
      }
    },
    {
      name: 'gitlab_create_or_update_file',
      description: 'Create or update a single file',
      inputSchema: {
        type: 'object',
        properties: {
          project_id: { type: 'string' },
          file_path: { type: 'string' },
          content: { type: 'string' },
          commit_message: { type: 'string' },
          branch: { type: 'string', default: 'main' }
        },
        required: ['project_id', 'file_path', 'content', 'commit_message']
      }
    },
    {
      name: 'gitlab_list_issues',
      description: 'List project issues',
      inputSchema: {
        type: 'object',
        properties: {
          project_id: { type: 'string' },
          state: { type: 'string', default: 'opened' },
          per_page: { type: 'number', default: 20 }
        },
        required: ['project_id']
      }
    },
    {
      name: 'gitlab_create_issue',
      description: 'Create an issue',
      inputSchema: {
        type: 'object',
        properties: {
          project_id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          labels: { type: 'string' }
        },
        required: ['project_id', 'title']
      }
    },
    {
      name: 'gitlab_list_merge_requests',
      description: 'List project merge requests',
      inputSchema: {
        type: 'object',
        properties: {
          project_id: { type: 'string' },
          state: { type: 'string', default: 'opened' }
        },
        required: ['project_id']
      }
    },
    {
      name: 'gitlab_create_merge_request',
      description: 'Create a merge request',
      inputSchema: {
        type: 'object',
        properties: {
          project_id: { type: 'string' },
          source_branch: { type: 'string' },
          target_branch: { type: 'string', default: 'main' },
          title: { type: 'string' },
          description: { type: 'string' }
        },
        required: ['project_id', 'source_branch', 'title']
      }
    },
    {
      name: 'gitlab_list_pipelines',
      description: 'List project CI/CD pipelines',
      inputSchema: {
        type: 'object',
        properties: {
          project_id: { type: 'string' },
          status: { type: 'string' }
        },
        required: ['project_id']
      }
    },
    {
      name: 'gitlab_trigger_pipeline',
      description: 'Trigger a pipeline run',
      inputSchema: {
        type: 'object',
        properties: {
          project_id: { type: 'string' },
          ref: { type: 'string', default: 'main' },
          variables: { type: 'array' }
        },
        required: ['project_id', 'ref']
      }
    },
    {
      name: 'gitlab_list_commits',
      description: 'List project commits',
      inputSchema: {
        type: 'object',
        properties: {
          project_id: { type: 'string' },
          ref_name: { type: 'string' },
          per_page: { type: 'number', default: 20 }
        },
        required: ['project_id']
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  const p = (s) => encodeURIComponent(s);

  try {
    let result;

    switch (name) {
      case 'gitlab_search_projects':
        result = await gitlabApi(`/projects?search=${encodeURIComponent(args.search)}&per_page=${args.per_page || 20}`);
        break;

      case 'gitlab_get_project':
        result = await gitlabApi(`/projects/${p(args.project_id)}`);
        break;

      case 'gitlab_list_branches':
        result = await gitlabApi(`/projects/${p(args.project_id)}/repository/branches`);
        break;

      case 'gitlab_create_branch':
        result = await gitlabApi(`/projects/${p(args.project_id)}/repository/branches`, {
          method: 'POST',
          body: JSON.stringify({ branch: args.branch, ref: args.ref })
        });
        break;

      case 'gitlab_get_file':
        result = await gitlabApi(`/projects/${p(args.project_id)}/repository/files/${p(args.file_path)}/raw?ref=${args.ref || 'main'}`);
        break;

      case 'gitlab_create_or_update_file': {
        const encPath = p(args.file_path);
        const exists = await gitlabApi(`/projects/${p(args.project_id)}/repository/files/${encPath}?ref=${args.branch || 'main'}`).catch(() => null);
        const method = exists ? 'PUT' : 'POST';
        result = await gitlabApi(`/projects/${p(args.project_id)}/repository/files/${encPath}`, {
          method,
          body: JSON.stringify({
            branch: args.branch || 'main',
            content: args.content,
            commit_message: args.commit_message
          })
        });
        break;
      }

      case 'gitlab_list_issues':
        result = await gitlabApi(`/projects/${p(args.project_id)}/issues?state=${args.state || 'opened'}&per_page=${args.per_page || 20}`);
        break;

      case 'gitlab_create_issue':
        result = await gitlabApi(`/projects/${p(args.project_id)}/issues`, {
          method: 'POST',
          body: JSON.stringify({
            title: args.title,
            description: args.description || '',
            labels: args.labels || ''
          })
        });
        break;

      case 'gitlab_list_merge_requests':
        result = await gitlabApi(`/projects/${p(args.project_id)}/merge_requests?state=${args.state || 'opened'}`);
        break;

      case 'gitlab_create_merge_request':
        result = await gitlabApi(`/projects/${p(args.project_id)}/merge_requests`, {
          method: 'POST',
          body: JSON.stringify({
            source_branch: args.source_branch,
            target_branch: args.target_branch || 'main',
            title: args.title,
            description: args.description || ''
          })
        });
        break;

      case 'gitlab_list_pipelines':
        result = await gitlabApi(`/projects/${p(args.project_id)}/pipelines${args.status ? '?status=' + args.status : ''}`);
        break;

      case 'gitlab_trigger_pipeline':
        result = await gitlabApi(`/projects/${p(args.project_id)}/pipeline`, {
          method: 'POST',
          body: JSON.stringify({ ref: args.ref, variables: args.variables || [] })
        });
        break;

      case 'gitlab_list_commits':
        result = await gitlabApi(`/projects/${p(args.project_id)}/repository/commits?ref_name=${args.ref_name || ''}&per_page=${args.per_page || 20}`);
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
server.connect(transport).catch((err) => {
  console.error('Failed to connect transport:', err);
  process.exit(1);
});
