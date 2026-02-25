/**
 * Figma Patch
 *
 * Patches Figma Desktop to enable remote debugging.
 * Newer Figma versions block --remote-debugging-port by default.
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Figma app.asar locations by platform
const ASAR_PATHS = {
  darwin: '/Applications/Figma.app/Contents/Resources/app.asar',
  win32: `${process.env.LOCALAPPDATA}\\Figma\\resources\\app.asar`,
  linux: '/opt/figma/resources/app.asar'
};

// The string that blocks remote debugging
const BLOCK_STRING = Buffer.from('removeSwitch("remote-debugging-port")');
// The patched string (changes "port" to "Xort" to disable the block)
const PATCH_STRING = Buffer.from('removeSwitch("remote-debugXing-port")');

/**
 * Get the path to Figma's app.asar file
 */
export function getAsarPath() {
  return ASAR_PATHS[process.platform] || null;
}

/**
 * Check if Figma is patched
 * @returns {boolean|null} true=patched, false=not patched, null=can't determine
 */
export function isPatched() {
  const asarPath = getAsarPath();
  if (!asarPath) return null;

  try {
    const content = readFileSync(asarPath);

    if (content.includes(PATCH_STRING)) {
      return true; // Already patched
    }

    if (content.includes(BLOCK_STRING)) {
      return false; // Needs patching
    }

    return null; // Can't determine (maybe old Figma version)
  } catch {
    return null;
  }
}

/**
 * Patch Figma to enable remote debugging
 * @returns {boolean} true if patched successfully
 */
export function patchFigma() {
  const asarPath = getAsarPath();
  if (!asarPath) {
    throw new Error('Cannot detect Figma installation path for this platform');
  }

  const content = readFileSync(asarPath);
  const blockIndex = content.indexOf(BLOCK_STRING);

  if (blockIndex < 0) {
    // Check if already patched
    if (content.includes(PATCH_STRING)) {
      return true; // Already patched
    }
    throw new Error('Could not find the string to patch. Figma version may be incompatible.');
  }

  // Apply patch
  PATCH_STRING.copy(content, blockIndex);
  writeFileSync(asarPath, content);

  // On macOS, re-sign the app
  if (process.platform === 'darwin') {
    try {
      execSync('codesign --force --deep --sign - /Applications/Figma.app', { stdio: 'ignore' });
    } catch {
      // Codesign might fail but patch might still work
    }
  }

  return true;
}

/**
 * Get the command to start Figma with remote debugging
 */
export function getFigmaCommand(port = 9222) {
  switch (process.platform) {
    case 'darwin':
      return `open -a Figma --args --remote-debugging-port=${port}`;
    case 'win32':
      return `"%LOCALAPPDATA%\\Figma\\Figma.exe" --remote-debugging-port=${port}`;
    case 'linux':
      return `figma --remote-debugging-port=${port}`;
    default:
      return null;
  }
}

/**
 * Get the path to Figma binary
 */
export function getFigmaBinaryPath() {
  switch (process.platform) {
    case 'darwin':
      return '/Applications/Figma.app/Contents/MacOS/Figma';
    case 'win32':
      return `${process.env.LOCALAPPDATA}\\Figma\\Figma.exe`;
    case 'linux':
      return '/usr/bin/figma';
    default:
      return null;
  }
}

export default {
  getAsarPath,
  isPatched,
  patchFigma,
  getFigmaCommand,
  getFigmaBinaryPath
};
