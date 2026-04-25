#!/usr/bin/env node

/**
 * API Load Tester (Node.js Edition)
 * 
 * Performs HTTP load testing with configurable concurrency, measuring latency,
 * throughput, and error rates. Specifically optimized for Node.js backends.
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');
const { performance } = require('perf_hooks');

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
Usage:
  node api_load_tester.js <url> [options]

Options:
  --concurrency, -c  Number of concurrent requests (default: 10)
  --duration, -d     Test duration in seconds (default: 10)
  --method, -m      HTTP method (GET, POST, etc.) (default: GET)
  --body, -b        Request body (string)
  --header, -H      HTTP header (format: "Name: Value")
  --help, -h        Show this help message
`);
}

if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  printHelp();
  process.exit(0);
}

const targetUrl = args[0];
let concurrency = 10;
let duration = 10;
let method = 'GET';
let body = null;
const headers = {};

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--concurrency' || args[i] === '-c') concurrency = parseInt(args[++i]);
  else if (args[i] === '--duration' || args[i] === '-d') duration = parseInt(args[++i]);
  else if (args[i] === '--method' || args[i] === '-m') method = args[++i].toUpperCase();
  else if (args[i] === '--body' || args[i] === '-b') body = args[++i];
  else if (args[i] === '--header' || args[i] === '-H') {
    const [h, v] = args[++i].split(':');
    headers[h.trim()] = v.trim();
  }
}

const results = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  latencies: [],
  errors: {},
};

let eventLoopLag = 0;
let lastCheck = Date.now();

function checkEventLoopLag() {
  const now = Date.now();
  eventLoopLag = Math.max(0, now - lastCheck);
  lastCheck = now;
  if (!shouldStop) setTimeout(checkEventLoopLag, 100);
}

let shouldStop = false;
const startTime = performance.now();

async function sendRequest() {
  if (shouldStop) return;

  const requestStartTime = performance.now();
  const urlObj = new URL(targetUrl);
  const client = urlObj.protocol === 'https:' ? https : http;

  const options = {
    method,
    headers: {
      'User-Agent': 'Nodejs-Load-Tester/1.0',
      ...headers,
    },
    timeout: 30000,
  };

  if (body) {
    options.headers['Content-Length'] = Buffer.byteLength(body);
  }

  return new Promise((resolve) => {
    const req = client.request(targetUrl, options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        const latency = performance.now() - requestStartTime;
        results.totalRequests++;
        if (res.statusCode >= 200 && res.statusCode < 300) {
          results.successfulRequests++;
          results.latencies.push(latency);
        } else {
          results.failedRequests++;
          const errCode = `HTTP ${res.statusCode}`;
          results.errors[errCode] = (results.errors[errCode] || 0) + 1;
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      results.totalRequests++;
      results.failedRequests++;
      results.errors[err.message] = (results.errors[err.message] || 0) + 1;
      resolve();
    });

    if (body) req.write(body);
    req.end();
  });
}

async function worker() {
  while (!shouldStop) {
    await sendRequest();
  }
}

console.log(`Starting Load Test: ${targetUrl}`);
console.log(`Concurrency: ${concurrency}, Duration: ${duration}s\n`);

checkEventLoopLag();

const workers = Array(concurrency).fill(0).map(() => worker());

setTimeout(() => {
  shouldStop = true;
  const totalDuration = (performance.now() - startTime) / 1000;
  
  Promise.all(workers).then(() => {
    const sortedLatencies = results.latencies.sort((a, b) => a - b);
    const p = (pct) => {
      if (sortedLatencies.length === 0) return 0;
      const index = Math.ceil((pct / 100) * sortedLatencies.length) - 1;
      return sortedLatencies[index];
    };

    const avgLatency = sortedLatencies.length > 0 
      ? sortedLatencies.reduce((a, b) => a + b, 0) / sortedLatencies.length 
      : 0;

    console.log('=' * 40);
    console.log('LOAD TEST RESULTS');
    console.log('=' * 40);
    console.log(`Requests/sec:   ${(results.totalRequests / totalDuration).toFixed(2)}`);
    console.log(`Total Requests: ${results.totalRequests}`);
    console.log(`Successful:     ${results.successfulRequests}`);
    console.log(`Failed:         ${results.failedRequests}`);
    console.log(`\nLATENCY (ms):`);
    console.log(`  Avg:      ${avgLatency.toFixed(2)}`);
    console.log(`  P50:      ${p(50).toFixed(2)}`);
    console.log(`  P95:      ${p(95).toFixed(2)}`);
    console.log(`  P99:      ${p(99).toFixed(2)}`);
    console.log(`\nESTIMATED EVENT LOOP LAG: ${eventLoopLag}ms`);
    
    if (Object.keys(results.errors).length > 0) {
      console.log(`\nERRORS:`);
      for (const [err, count] of Object.entries(results.errors)) {
        console.log(`  ${err}: ${count}`);
      }
    }
  });
}, duration * 1000);
