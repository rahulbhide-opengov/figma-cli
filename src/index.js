#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { execSync, spawn } from 'child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createInterface } from 'readline';
import { homedir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));

const CONFIG_DIR = join(homedir(), '.figma-cli');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

const program = new Command();

// Helper: Prompt user
function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, answer => { rl.close(); resolve(answer); }));
}

// Helper: Load config
function loadConfig() {
  try {
    if (existsSync(CONFIG_FILE)) {
      return JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
    }
  } catch {}
  return {};
}

// Helper: Save config
function saveConfig(config) {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// Helper: Run figma-use command
function figmaUse(args, options = {}) {
  try {
    const result = execSync(`figma-use ${args}`, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return result;
  } catch (error) {
    if (options.silent) return null;
    throw error;
  }
}

// Helper: Check connection
function checkConnection() {
  const result = figmaUse('status', { silent: true });
  if (!result || result.includes('Not connected')) {
    console.log(chalk.red('\n✗ Not connected to Figma\n'));
    console.log(chalk.white('  Make sure Figma is running with remote debugging:'));
    console.log(chalk.cyan('  figma-cli connect\n'));
    process.exit(1);
  }
  return true;
}

// Helper: Check if figma-use is installed
function checkDependencies(silent = false) {
  try {
    execSync('which figma-use', { stdio: 'pipe' });
    return true;
  } catch {
    if (!silent) {
      console.log(chalk.yellow('  Installing figma-use...'));
      execSync('npm install -g figma-use', { stdio: 'inherit' });
    }
    return false;
  }
}

// Helper: Check if Figma is patched
function isFigmaPatched() {
  const config = loadConfig();
  return config.patched === true;
}

// Helper: Hex to Figma RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  };
}

program
  .name('figma-cli')
  .description('CLI for managing Figma design systems')
  .version(pkg.version);

// ============ WELCOME BANNER ============

function showBanner() {
  console.log(chalk.cyan(`
  ███████╗██╗ ██████╗ ███╗   ███╗ █████╗        ██████╗██╗     ██╗
  ██╔════╝██║██╔════╝ ████╗ ████║██╔══██╗      ██╔════╝██║     ██║
  █████╗  ██║██║  ███╗██╔████╔██║███████║█████╗██║     ██║     ██║
  ██╔══╝  ██║██║   ██║██║╚██╔╝██║██╔══██║╚════╝██║     ██║     ██║
  ██║     ██║╚██████╔╝██║ ╚═╝ ██║██║  ██║      ╚██████╗███████╗██║
  ╚═╝     ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝       ╚═════╝╚══════╝╚═╝
`));
  console.log(chalk.white(`  Design System CLI for Figma ${chalk.gray('v' + pkg.version)}`));
  console.log(chalk.gray(`  by Sil Bormüller • intodesignsystems.com\n`));
}

// ============ INIT (Interactive Onboarding) ============

program
  .command('init')
  .description('Interactive setup wizard')
  .action(async () => {
    showBanner();

    console.log(chalk.white('  Welcome! Let\'s get you set up.\n'));
    console.log(chalk.gray('  This takes about 30 seconds. No API key needed.\n'));

    // Step 1: Check Node version
    console.log(chalk.blue('Step 1/4: ') + 'Checking Node.js...');
    const nodeVersion = process.version;
    const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0]);
    if (nodeMajor < 18) {
      console.log(chalk.red(`  ✗ Node.js ${nodeVersion} is too old. Please upgrade to Node 18+`));
      process.exit(1);
    }
    console.log(chalk.green(`  ✓ Node.js ${nodeVersion}`));

    // Step 2: Install figma-use
    console.log(chalk.blue('\nStep 2/4: ') + 'Installing dependencies...');
    if (checkDependencies(true)) {
      console.log(chalk.green('  ✓ figma-use already installed'));
    } else {
      const spinner = ora('  Installing figma-use...').start();
      try {
        execSync('npm install -g figma-use', { stdio: 'pipe' });
        spinner.succeed('figma-use installed');
      } catch (error) {
        spinner.fail('Failed to install figma-use');
        console.log(chalk.gray('  Try manually: npm install -g figma-use'));
        process.exit(1);
      }
    }

    // Step 3: Patch Figma
    console.log(chalk.blue('\nStep 3/4: ') + 'Patching Figma Desktop...');
    const config = loadConfig();
    if (config.patched) {
      console.log(chalk.green('  ✓ Figma already patched'));
    } else {
      console.log(chalk.gray('  (This allows CLI to connect to Figma)'));
      const spinner = ora('  Patching...').start();
      try {
        execSync('figma-use patch', { stdio: 'pipe' });
        config.patched = true;
        saveConfig(config);
        spinner.succeed('Figma patched');
      } catch (error) {
        if (error.message?.includes('already patched')) {
          config.patched = true;
          saveConfig(config);
          spinner.succeed('Figma already patched');
        } else {
          spinner.fail('Patch failed');
          console.log(chalk.gray('  Try manually: figma-use patch'));
        }
      }
    }

    // Step 4: Start Figma
    console.log(chalk.blue('\nStep 4/4: ') + 'Starting Figma...');
    try {
      execSync('pkill -x Figma 2>/dev/null || true', { stdio: 'pipe' });
      await new Promise(r => setTimeout(r, 1000));
      execSync('open -a Figma --args --remote-debugging-port=9222', { stdio: 'pipe' });
      console.log(chalk.green('  ✓ Figma started'));

      // Wait for connection
      const spinner = ora('  Waiting for connection...').start();
      let connected = false;
      for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 1000));
        const result = figmaUse('status', { silent: true });
        if (result && result.includes('Connected')) {
          connected = true;
          break;
        }
      }

      if (connected) {
        spinner.succeed('Connected to Figma');
      } else {
        spinner.warn('Connection pending - open a file in Figma');
      }
    } catch (error) {
      console.log(chalk.yellow('  ! Could not start Figma automatically'));
      console.log(chalk.gray('    Start manually: open -a Figma --args --remote-debugging-port=9222'));
    }

    // Done!
    console.log(chalk.green('\n  ✓ Setup complete!\n'));

    console.log(chalk.white('  Quick start:\n'));
    console.log(chalk.gray('    Create Tailwind colors    ') + chalk.cyan('figma-cli tokens tailwind'));
    console.log(chalk.gray('    Create spacing scale      ') + chalk.cyan('figma-cli tokens spacing'));
    console.log(chalk.gray('    List all variables        ') + chalk.cyan('figma-cli var list'));
    console.log(chalk.gray('    Render JSX to Figma       ') + chalk.cyan('figma-cli render \'<Frame>...</Frame>\''));
    console.log(chalk.gray('    See all commands          ') + chalk.cyan('figma-cli --help'));
    console.log();
    console.log(chalk.gray('  Learn more: ') + chalk.cyan('https://intodesignsystems.com\n'));
  });

// ============ SETUP (alias for init) ============

program
  .command('setup')
  .description('Setup Figma for CLI access (alias for init)')
  .action(() => {
    // Redirect to init
    execSync('figma-cli init', { stdio: 'inherit' });
  });

// ============ STATUS ============

program
  .command('status')
  .description('Check connection to Figma')
  .action(() => {
    // Check if first run
    const config = loadConfig();
    if (!config.patched && !checkDependencies(true)) {
      console.log(chalk.yellow('\n⚠ First time? Run the setup wizard:\n'));
      console.log(chalk.cyan('  figma-cli init\n'));
      return;
    }
    figmaUse('status');
  });

// ============ CONNECT ============

program
  .command('connect')
  .description('Start Figma with remote debugging enabled')
  .action(async () => {
    // Check if first run
    const config = loadConfig();
    if (!config.patched) {
      console.log(chalk.yellow('\n⚠ First time? Run the setup wizard:\n'));
      console.log(chalk.cyan('  figma-cli init\n'));
      return;
    }

    console.log(chalk.blue('Starting Figma...'));
    try {
      execSync('pkill -x Figma 2>/dev/null || true', { stdio: 'pipe' });
      await new Promise(r => setTimeout(r, 500));
    } catch {}

    execSync('open -a Figma --args --remote-debugging-port=9222');
    console.log(chalk.green('✓ Figma started\n'));

    // Wait and check connection
    const spinner = ora('Waiting for connection...').start();
    for (let i = 0; i < 8; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const result = figmaUse('status', { silent: true });
      if (result && result.includes('Connected')) {
        spinner.succeed('Connected to Figma');
        console.log(chalk.gray(result.trim()));
        return;
      }
    }
    spinner.warn('Open a file in Figma to connect');
  });

// ============ VARIABLES ============

const variables = program
  .command('variables')
  .alias('var')
  .description('Manage design tokens/variables');

variables
  .command('list')
  .description('List all variables')
  .action(() => {
    checkConnection();
    figmaUse('variable list');
  });

variables
  .command('create <name>')
  .description('Create a variable')
  .requiredOption('-c, --collection <id>', 'Collection ID')
  .requiredOption('-t, --type <type>', 'Type: COLOR, FLOAT, STRING, BOOLEAN')
  .option('-v, --value <value>', 'Initial value')
  .action((name, options) => {
    checkConnection();
    let cmd = `variable create "${name}" --collection "${options.collection}" --type ${options.type}`;
    if (options.value) cmd += ` --value "${options.value}"`;
    figmaUse(cmd);
  });

variables
  .command('find <pattern>')
  .description('Find variables by name pattern')
  .action((pattern) => {
    checkConnection();
    figmaUse(`variable find "${pattern}"`);
  });

// ============ COLLECTIONS ============

const collections = program
  .command('collections')
  .alias('col')
  .description('Manage variable collections');

collections
  .command('list')
  .description('List all collections')
  .action(() => {
    checkConnection();
    figmaUse('collection list');
  });

collections
  .command('create <name>')
  .description('Create a collection')
  .action((name) => {
    checkConnection();
    figmaUse(`collection create "${name}"`);
  });

// ============ TOKENS (PRESETS) ============

const tokens = program
  .command('tokens')
  .description('Create design token presets');

tokens
  .command('tailwind')
  .description('Create Tailwind CSS color palette')
  .option('-c, --collection <name>', 'Collection name', 'Color - Primitive')
  .action((options) => {
    checkConnection();
    const spinner = ora('Creating Tailwind color palette...').start();

    const tailwindColors = {
      slate: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' },
      gray: { 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827', 950: '#030712' },
      zinc: { 50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b', 950: '#09090b' },
      neutral: { 50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5', 300: '#d4d4d4', 400: '#a3a3a3', 500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717', 950: '#0a0a0a' },
      stone: { 50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1', 400: '#a8a29e', 500: '#78716c', 600: '#57534e', 700: '#44403c', 800: '#292524', 900: '#1c1917', 950: '#0c0a09' },
      red: { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d', 950: '#450a0a' },
      orange: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12', 950: '#431407' },
      amber: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f', 950: '#451a03' },
      yellow: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#eab308', 600: '#ca8a04', 700: '#a16207', 800: '#854d0e', 900: '#713f12', 950: '#422006' },
      lime: { 50: '#f7fee7', 100: '#ecfccb', 200: '#d9f99d', 300: '#bef264', 400: '#a3e635', 500: '#84cc16', 600: '#65a30d', 700: '#4d7c0f', 800: '#3f6212', 900: '#365314', 950: '#1a2e05' },
      green: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d', 950: '#052e16' },
      emerald: { 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b', 950: '#022c22' },
      teal: { 50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a', 950: '#042f2e' },
      cyan: { 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63', 950: '#083344' },
      sky: { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e', 950: '#082f49' },
      blue: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554' },
      indigo: { 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81', 950: '#1e1b4b' },
      violet: { 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065' },
      purple: { 50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8', 900: '#581c87', 950: '#3b0764' },
      fuchsia: { 50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc', 400: '#e879f9', 500: '#d946ef', 600: '#c026d3', 700: '#a21caf', 800: '#86198f', 900: '#701a75', 950: '#4a044e' },
      pink: { 50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843', 950: '#500724' },
      rose: { 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337', 950: '#4c0519' }
    };

    const code = `
const colors = ${JSON.stringify(tailwindColors)};
function hexToRgb(hex) {
  const r = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
  return { r: parseInt(r[1], 16) / 255, g: parseInt(r[2], 16) / 255, b: parseInt(r[3], 16) / 255 };
}
let col = figma.variables.getLocalVariableCollections().find(c => c.name === '${options.collection}');
if (!col) col = figma.variables.createVariableCollection('${options.collection}');
const modeId = col.modes[0].modeId;
let count = 0;
Object.entries(colors).forEach(([colorName, shades]) => {
  Object.entries(shades).forEach(([shade, hex]) => {
    const existing = figma.variables.getLocalVariables().find(v => v.name === colorName + '/' + shade);
    if (!existing) {
      const v = figma.variables.createVariable(colorName + '/' + shade, col.id, 'COLOR');
      v.setValueForMode(modeId, hexToRgb(hex));
      count++;
    }
  });
});
'Created ' + count + ' color variables in ${options.collection}'
`;

    try {
      const result = figmaUse(`eval "${code.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, { silent: true });
      spinner.succeed(result?.trim() || 'Created Tailwind palette');
    } catch (error) {
      spinner.fail('Failed to create palette');
      console.error(error.message);
    }
  });

tokens
  .command('spacing')
  .description('Create spacing scale (4px base)')
  .option('-c, --collection <name>', 'Collection name', 'Spacing')
  .action((options) => {
    checkConnection();
    const spinner = ora('Creating spacing scale...').start();

    const spacings = {
      '0': 0, '0.5': 2, '1': 4, '1.5': 6, '2': 8, '2.5': 10,
      '3': 12, '3.5': 14, '4': 16, '5': 20, '6': 24, '7': 28,
      '8': 32, '9': 36, '10': 40, '11': 44, '12': 48,
      '14': 56, '16': 64, '20': 80, '24': 96, '28': 112,
      '32': 128, '36': 144, '40': 160, '44': 176, '48': 192
    };

    const code = `
const spacings = ${JSON.stringify(spacings)};
let col = figma.variables.getLocalVariableCollections().find(c => c.name === '${options.collection}');
if (!col) col = figma.variables.createVariableCollection('${options.collection}');
const modeId = col.modes[0].modeId;
let count = 0;
Object.entries(spacings).forEach(([name, value]) => {
  const existing = figma.variables.getLocalVariables().find(v => v.name === 'spacing/' + name);
  if (!existing) {
    const v = figma.variables.createVariable('spacing/' + name, col.id, 'FLOAT');
    v.setValueForMode(modeId, value);
    count++;
  }
});
'Created ' + count + ' spacing variables'
`;

    try {
      const result = figmaUse(`eval "${code.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, { silent: true });
      spinner.succeed(result?.trim() || 'Created spacing scale');
    } catch (error) {
      spinner.fail('Failed to create spacing scale');
    }
  });

tokens
  .command('radii')
  .description('Create border radius scale')
  .option('-c, --collection <name>', 'Collection name', 'Radii')
  .action((options) => {
    checkConnection();
    const spinner = ora('Creating border radii...').start();

    const radii = {
      'none': 0, 'sm': 2, 'default': 4, 'md': 6, 'lg': 8,
      'xl': 12, '2xl': 16, '3xl': 24, 'full': 9999
    };

    const code = `
const radii = ${JSON.stringify(radii)};
let col = figma.variables.getLocalVariableCollections().find(c => c.name === '${options.collection}');
if (!col) col = figma.variables.createVariableCollection('${options.collection}');
const modeId = col.modes[0].modeId;
let count = 0;
Object.entries(radii).forEach(([name, value]) => {
  const existing = figma.variables.getLocalVariables().find(v => v.name === 'radius/' + name);
  if (!existing) {
    const v = figma.variables.createVariable('radius/' + name, col.id, 'FLOAT');
    v.setValueForMode(modeId, value);
    count++;
  }
});
'Created ' + count + ' radius variables'
`;

    try {
      const result = figmaUse(`eval "${code.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, { silent: true });
      spinner.succeed(result?.trim() || 'Created border radii');
    } catch (error) {
      spinner.fail('Failed to create radii');
    }
  });

// ============ CREATE ============

const create = program
  .command('create')
  .description('Create Figma elements');

create
  .command('frame <name>')
  .description('Create a frame')
  .option('-w, --width <n>', 'Width', '100')
  .option('-h, --height <n>', 'Height', '100')
  .option('--fill <color>', 'Fill color')
  .option('--radius <n>', 'Corner radius')
  .action((name, options) => {
    checkConnection();
    let cmd = `create frame --name "${name}" --width ${options.width} --height ${options.height}`;
    if (options.fill) cmd += ` --fill "${options.fill}"`;
    if (options.radius) cmd += ` --cornerRadius ${options.radius}`;
    figmaUse(cmd);
  });

create
  .command('icon <name>')
  .description('Create an icon from Iconify (e.g., lucide:star, mdi:home)')
  .option('-s, --size <n>', 'Size', '24')
  .option('-c, --color <color>', 'Color', '#000000')
  .action((name, options) => {
    checkConnection();
    figmaUse(`create icon ${name} --size ${options.size} --color "${options.color}"`);
  });

// ============ RENDER ============

program
  .command('render <jsx>')
  .description('Render JSX to Figma')
  .action((jsx) => {
    checkConnection();
    execSync(`echo '${jsx}' | figma-use render --stdin`, { stdio: 'inherit' });
  });

// ============ EXPORT ============

const exp = program
  .command('export')
  .description('Export from Figma');

exp
  .command('screenshot')
  .description('Take a screenshot')
  .option('-o, --output <file>', 'Output file', 'screenshot.png')
  .action((options) => {
    checkConnection();
    figmaUse(`export screenshot --output "${options.output}"`);
  });

exp
  .command('css')
  .description('Export variables as CSS custom properties')
  .action(() => {
    checkConnection();
    const code = `
const vars = figma.variables.getLocalVariables();
const css = vars.map(v => {
  const val = Object.values(v.valuesByMode)[0];
  if (v.resolvedType === 'COLOR') {
    const hex = '#' + [val.r, val.g, val.b].map(n => Math.round(n*255).toString(16).padStart(2,'0')).join('');
    return '  --' + v.name.replace(/\\//g, '-') + ': ' + hex + ';';
  }
  return '  --' + v.name.replace(/\\//g, '-') + ': ' + val + (v.resolvedType === 'FLOAT' ? 'px' : '') + ';';
}).join('\\n');
':root {\\n' + css + '\\n}'
`;
    const result = figmaUse(`eval "${code.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, { silent: true });
    console.log(result);
  });

exp
  .command('tailwind')
  .description('Export color variables as Tailwind config')
  .action(() => {
    checkConnection();
    const code = `
const vars = figma.variables.getLocalVariables().filter(v => v.resolvedType === 'COLOR');
const colors = {};
vars.forEach(v => {
  const val = Object.values(v.valuesByMode)[0];
  const hex = '#' + [val.r, val.g, val.b].map(n => Math.round(n*255).toString(16).padStart(2,'0')).join('');
  const parts = v.name.split('/');
  if (parts.length === 2) {
    if (!colors[parts[0]]) colors[parts[0]] = {};
    colors[parts[0]][parts[1]] = hex;
  } else {
    colors[v.name.replace(/\\//g, '-')] = hex;
  }
});
JSON.stringify({ theme: { extend: { colors } } }, null, 2)
`;
    const result = figmaUse(`eval "${code.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, { silent: true });
    console.log(result);
  });

// ============ EVAL ============

program
  .command('eval <code>')
  .description('Execute JavaScript in Figma plugin context')
  .action((code) => {
    checkConnection();
    figmaUse(`eval "${code.replace(/"/g, '\\"')}"`);
  });

// ============ PASSTHROUGH ============

program
  .command('raw <command...>')
  .description('Run raw figma-use command')
  .action((command) => {
    checkConnection();
    figmaUse(command.join(' '));
  });

program.parse();
