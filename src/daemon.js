#!/usr/bin/env node

/**
 * Figma CLI Daemon
 *
 * Keeps a persistent connection to Figma for fast command execution.
 * Started automatically by `connect` command.
 */

import { createServer } from 'http';
import { FigmaClient } from './figma-client.js';

const PORT = parseInt(process.env.DAEMON_PORT) || 3456;

let client = null;
let isConnecting = false;

// Get or create FigmaClient
async function getClient() {
  if (client) return client;
  if (isConnecting) {
    // Wait for connection
    while (isConnecting) {
      await new Promise(r => setTimeout(r, 100));
    }
    return client;
  }

  isConnecting = true;
  try {
    client = new FigmaClient();
    await client.connect();
    console.log('[daemon] Connected to Figma');
  } finally {
    isConnecting = false;
  }
  return client;
}

// Handle requests
async function handleRequest(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', connected: !!client }));
    return;
  }

  // Execute command
  if (req.url === '/exec' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { action, code, jsx, jsxArray } = JSON.parse(body);
        const figma = await getClient();
        let result;

        switch (action) {
          case 'eval':
            result = await figma.eval(code);
            break;
          case 'render':
            result = await figma.render(jsx);
            break;
          case 'render-batch':
            result = [];
            for (const j of jsxArray) {
              result.push(await figma.render(j));
            }
            break;
          default:
            throw new Error(`Unknown action: ${action}`);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ result }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // Not found
  res.writeHead(404);
  res.end('Not found');
}

// Start server
const server = createServer(handleRequest);

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[daemon] Figma CLI daemon running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[daemon] Shutting down...');
  if (client) client.close();
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[daemon] Shutting down...');
  if (client) client.close();
  server.close(() => process.exit(0));
});

// Pre-connect to Figma
getClient().catch(err => {
  console.error('[daemon] Initial connection failed:', err.message);
});
