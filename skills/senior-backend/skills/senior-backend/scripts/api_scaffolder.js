#!/usr/bin/env node

/**
 * API Scaffolder (Node.js & MongoDB Edition)
 * 
 * Generates API routes, controllers, Mongoose models, and Zod validation 
 * from OpenAPI specifications (YAML/JSON).
 * 
 * Based on the Python reference implementation for Senior Backend Engineer.
 */

const fs = require('fs');
const path = require('path');

/**
 * Basic YAML to JSON parser (subset)
 * Avoids external dependencies for portability.
 */
function loadYamlAsJson(content) {
  const lines = content.split('\n');
  const result = {};
  const stack = [{ obj: result, indent: -1 }];
  
  for (let line of lines) {
    const stripped = line.trim();
    if (!stripped || stripped.startsWith('#')) continue;

    const indent = line.search(/\S/);
    
    // Pop stack until we find the parent level
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const current = stack[stack.length - 1].obj;

    if (stripped.startsWith('- ')) {
      // Array item
      const value = stripped.substring(2).trim();
      if (!Array.isArray(current)) {
        // This is a simplification; assuming the parent is an array for '- '
        // In real YAML, it's more complex.
      } else {
        if (value.includes(':')) {
          const [k, v] = value.split(':').map(s => s.trim());
          const newObj = { [k]: v.replace(/^["']|["']$/g, '') };
          current.push(newObj);
          stack.push({ obj: newObj, indent: indent + 2 });
        } else {
          current.push(value.replace(/^["']|["']$/g, ''));
        }
      }
    } else if (stripped.includes(':')) {
      const splitIdx = stripped.indexOf(':');
      const key = stripped.substring(0, splitIdx).trim();
      let value = stripped.substring(splitIdx + 1).trim();

      if (value === '') {
        const newObj = stripped.endsWith(':') ? {} : []; // Heuristic
        // Better check for next line's '-' or key
        const nextLine = lines.find((l, i) => i > lines.indexOf(line) && l.trim() && !l.trim().startsWith('#'));
        const isNextLineArray = nextLine && nextLine.trim().startsWith('-');
        
        const target = isNextLineArray ? [] : {};
        current[key] = target;
        stack.push({ obj: target, indent });
      } else {
        // Simple value
        value = value.replace(/^["']|["']$/g, '');
        if (value.toLowerCase() === 'true') value = true;
        else if (value.toLowerCase() === 'false') value = false;
        else if (!isNaN(value) && value !== '') value = Number(value);
        current[key] = value;
      }
    }
  }
  return result;
}

/**
 * Convert OpenAPI schema to TypeScript
 */
function openapiTypeToTs(schema) {
  if (!schema) return 'any';
  if (schema.$ref) return schema.$ref.split('/').pop();

  const typeMap = {
    string: 'string',
    integer: 'number',
    number: 'number',
    boolean: 'boolean',
    object: 'Record<string, any>',
    array: 'any[]',
  };

  const type = schema.type || 'any';

  if (type === 'array') {
    return `${openapiTypeToTs(schema.items)}[]`;
  }

  if (type === 'object' && schema.properties) {
    const props = Object.entries(schema.properties).map(([name, prop]) => {
      const isRequired = schema.required && schema.required.includes(name);
      return `  ${name}${isRequired ? '' : '?'}: ${openapiTypeToTs(prop)};`;
    });
    return `{\n${props.join('\n')}\n}`;
  }

  if (schema.enum) {
    return schema.enum.map(v => `'${v}'`).join(' | ');
  }

  return typeMap[type] || 'any';
}

/**
 * Generate Zod Schema string
 */
function generateZodSchema(schema, name) {
  function toZod(s) {
    if (!s) return 'z.any()';
    if (s.$ref) return `${s.$ref.split('/').pop()}Schema`;

    const type = s.type || 'any';
    let zod = 'z.any()';

    if (type === 'string') {
      zod = 'z.string()';
      if (s.format === 'email') zod += '.email()';
      if (s.format === 'uuid') zod += '.uuid()';
      if (s.enum) zod = `z.enum([${s.enum.map(v => `'${v}'`).join(', ')}])`;
    } else if (type === 'integer' || type === 'number') {
      zod = 'z.number()';
      if (type === 'integer') zod += '.int()';
    } else if (type === 'boolean') {
      zod = 'z.boolean()';
    } else if (type === 'array') {
      zod = `z.array(${toZod(s.items)})`;
    } else if (type === 'object' && s.properties) {
      const props = Object.entries(s.properties).map(([k, p]) => {
        let pZod = toZod(p);
        if (!(s.required && s.required.includes(k))) pZod += '.optional()';
        return `  ${k}: ${pZod},`;
      });
      zod = `z.object({\n${props.join('\n')}\n})`;
    }
    return zod;
  }

  return `export const ${name}Schema = ${toZod(schema)};\nexport type ${name} = z.infer<typeof ${name}Schema>;`;
}

/**
 * Generate Mongoose Schema string
 */
function generateMongooseSchema(schema, name) {
  function toMongoose(s) {
    if (!s) return '{ type: Schema.Types.Mixed }';
    if (s.$ref) return `{ type: Schema.Types.ObjectId, ref: '${s.$ref.split('/').pop()}' }`;

    const type = s.type || 'any';
    if (type === 'string') return '{ type: String }';
    if (type === 'number' || type === 'integer') return '{ type: Number }';
    if (type === 'boolean') return '{ type: Boolean }';
    if (type === 'array') return `[{ ${toMongoose(s.items).slice(1, -1)} }]`;
    if (type === 'object' && s.properties) {
      const props = Object.entries(s.properties).map(([k, p]) => `${k}: ${toMongoose(p)}`);
      return `{ ${props.join(', ')} }`;
    }
    return '{ type: Schema.Types.Mixed }';
  }

  return `const ${name}Schema = new Schema(${toMongoose(schema)}, { timestamps: true });\nexport const ${name}Model = model('${name}', ${name}Schema);`;
}

function toCamelCase(s) {
  return s.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()).replace(/^[A-Z]/, c => c.toLowerCase());
}

function toPascalCase(s) {
  const camel = toCamelCase(s);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

class APIScaffolder {
  constructor(specPath, outputDir, options = {}) {
    this.specPath = specPath;
    this.outputDir = outputDir;
    this.framework = options.framework || 'fastify';
    this.db = options.db || 'mongodb';
    this.spec = null;
  }

  async run() {
    console.log(`Scaffolding API from ${this.specPath}...`);
    this.loadSpec();
    this.ensureDir(this.outputDir);

    this.generateTypes();
    this.generateValidators();
    if (this.db === 'mongodb') this.generateModels();
    this.generateRoutes();
    
    console.log('Scaffolding complete.');
  }

  loadSpec() {
    const content = fs.readFileSync(this.specPath, 'utf8');
    if (this.specPath.endsWith('.yaml') || this.specPath.endsWith('.yml')) {
      this.spec = loadYamlAsJson(content);
    } else {
      this.spec = JSON.parse(content);
    }
  }

  ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  getSchemas() {
    return (this.spec.components && this.spec.components.schemas) || {};
  }

  getOperations() {
    const operations = [];
    const paths = this.spec.paths || {};
    for (const [pathUrl, methods] of Object.entries(paths)) {
      for (const [method, details] of Object.entries(methods)) {
        if (!['get', 'post', 'put', 'patch', 'delete'].includes(method.toLowerCase())) continue;
        operations.push({
          path: pathUrl,
          method: method.toLowerCase(),
          operationId: details.operationId || `${method}${pathUrl.replace(/\//g, '_')}`,
          tags: details.tags || ['default'],
          summary: details.summary || '',
          requestBody: details.requestBody,
        });
      }
    }
    return operations;
  }

  generateTypes() {
    const schemas = this.getSchemas();
    let content = `// Auto-generated TypeScript types\n\n`;
    for (const [name, schema] of Object.entries(schemas)) {
      const ts = openapiTypeToTs(schema);
      content += `export interface ${name} ${ts}\n\n`;
    }
    fs.writeFileSync(path.join(this.outputDir, 'types.ts'), content);
  }

  generateValidators() {
    const schemas = this.getSchemas();
    let content = `import { z } from 'zod';\n\n`;
    for (const [name, schema] of Object.entries(schemas)) {
      content += `${generateZodSchema(schema, name)}\n\n`;
    }
    fs.writeFileSync(path.join(this.outputDir, 'validators.ts'), content);
  }

  generateModels() {
    const schemas = this.getSchemas();
    let content = `import { Schema, model } from 'mongoose';\n\n`;
    for (const [name, schema] of Object.entries(schemas)) {
      content += `${generateMongooseSchema(schema, name)}\n\n`;
    }
    fs.writeFileSync(path.join(this.outputDir, 'models.ts'), content);
  }

  generateRoutes() {
    const ops = this.getOperations();
    const tags = [...new Set(ops.flatMap(o => o.tags))];

    for (const tag of tags) {
      const tagOps = ops.filter(o => o.tags.includes(tag));
      const content = this.framework === 'fastify' 
        ? this.generateFastifyRoutes(tag, tagOps)
        : this.generateExpressRoutes(tag, tagOps);
      fs.writeFileSync(path.join(this.outputDir, `${toCamelCase(tag)}.routes.ts`), content);
    }
  }

  generateFastifyRoutes(tag, ops) {
    let content = `import { FastifyInstance, FastifyPluginOptions } from 'fastify';\n`;
    content += `import * as validators from './validators';\n\n`;
    content += `export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {\n`;
    
    for (const op of ops) {
      const routePath = op.path.replace(/\{(\w+)\}/g, ':$1');
      content += `  // ${op.summary}\n`;
      content += `  fastify.${op.method}('${routePath}', async (request, reply) => {\n`;
      content += `    // TODO: Implement ${op.operationId}\n`;
      content += `    return { message: 'OK' };\n`;
      content += `  });\n\n`;
    }
    
    content += `}\n`;
    return content;
  }

  generateExpressRoutes(tag, ops) {
    let content = `import { Router } from 'express';\n`;
    content += `const router = Router();\n\n`;
    
    for (const op of ops) {
      const routePath = op.path.replace(/\{(\w+)\}/g, ':$1');
      content += `// ${op.summary}\n`;
      content += `router.${op.method}('${routePath}', async (req, res) => {\n`;
      content += `  // TODO: Implement ${op.operationId}\n`;
      content += `  res.json({ message: 'OK' });\n`;
      content += `});\n\n`;
    }
    
    content += `export default router;\n`;
    return content;
  }
}

// CLI Logic
const args = process.argv.slice(2);
if (args.includes('--help') || args.length < 1) {
  console.log('Usage: node api_scaffolder.js <spec.yaml> --output <dir> [--framework fastify|express] [--db mongodb]');
  process.exit(0);
}

const spec = args[0];
const output = args[args.indexOf('--output') + 1] || './generated';
const framework = args.includes('--framework') ? args[args.indexOf('--framework') + 1] : 'fastify';
const db = args.includes('--db') ? args[args.indexOf('--db') + 1] : 'mongodb';

new APIScaffolder(spec, output, { framework, db }).run().catch(console.error);
