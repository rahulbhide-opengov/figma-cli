#!/usr/bin/env node
/**
 * Test script for FigJam Client
 * Run with: node test-figjam.js
 */

import { FigJamClient } from './src/figjam-client.js';

async function main() {
  const client = new FigJamClient();

  try {
    // List available pages
    console.log('Available FigJam pages:');
    const pages = await FigJamClient.listPages();
    pages.forEach(p => console.log('  -', p.title));

    if (pages.length === 0) {
      console.log('No FigJam pages open. Please open a FigJam file.');
      return;
    }

    // Connect to first FigJam page
    console.log('\nConnecting to:', pages[0].title);
    await client.connect(pages[0].title);

    // Get page info
    const info = await client.getPageInfo();
    console.log('\nPage info:', info);

    // List existing nodes
    const nodes = await client.listNodes(10);
    console.log('\nExisting nodes:');
    nodes.forEach(n => console.log('  -', n.type, n.id, n.name || '(unnamed)', 'at', n.x, n.y));

    // Create a sticky
    console.log('\nCreating sticky note...');
    const sticky = await client.createSticky('Hello from Claude!', 300, 100);
    console.log('Created:', sticky);

    // Create a shape
    console.log('\nCreating shape...');
    const shape = await client.createShape('FigJam Client Test', 300, 250, 250, 80);
    console.log('Created:', shape);

    // Connect them
    console.log('\nConnecting sticky to shape...');
    const connector = await client.createConnector(sticky.id, shape.id);
    console.log('Created connector:', connector);

    console.log('\nDone! Check your FigJam board.');

  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    client.close();
  }
}

main();
