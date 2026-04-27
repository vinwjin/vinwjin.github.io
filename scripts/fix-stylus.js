'use strict';

/**
 * Patch stylus utils.find to handle UNC/WSL paths.
 * glob.sync fails on UNC paths (\\wsl.localhost\...), use fs instead.
 */

const path = require('path');
const fs = require('fs');

function hasGlob(p) {
  return /[*?\[\]{}!]/.test(p);
}

// Simple glob expansion for patterns like "dir/*.styl" or "dir/*"
function expandGlob(pattern) {
  try {
    const dir = path.dirname(pattern);
    const base = path.basename(pattern);

    if (!fs.statSync(dir).isDirectory()) return [];

    // Convert glob pattern to regex
    let regexStr = base
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')  // Escape regex special chars
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    const regex = new RegExp('^' + regexStr + '$', 'i');

    return fs.readdirSync(dir)
      .filter(f => regex.test(f) && f !== '.' && f !== '..')
      .map(f => path.join(dir, f))
      .filter(f => fs.statSync(f).isFile());
  } catch (e) {
    return [];
  }
}

function patchStylusUtils() {
  const stylusUtilsPath = path.join(
    __dirname,
    '../node_modules/hexo-renderer-stylus/node_modules/stylus/lib/utils'
  );

  let stylusUtils;
  try {
    stylusUtils = require(stylusUtilsPath);
  } catch (e) {
    try {
      stylusUtils = require(path.join(__dirname, '../node_modules/stylus/lib/utils'));
    } catch (e2) {
      hexo.log.warn('[fix-stylus] Could not locate stylus utils');
      return;
    }
  }

  const origFind = stylusUtils.find;
  const origLookup = stylusUtils.lookup;

  stylusUtils.find = function(filePath, paths, ignore) {
    // For absolute paths without glob, use fs directly
    if (stylusUtils.absolute(filePath)) {
      if (hasGlob(filePath)) {
        return expandGlob(filePath).length ? expandGlob(filePath) : undefined;
      }
      if (fs.existsSync(filePath)) {
        return [filePath];
      }
      return;
    }

    // For simple relative paths (no glob), try fs first
    if (!hasGlob(filePath)) {
      for (let i = paths.length - 1; i >= 0; i--) {
        const lookup = path.join(paths[i], filePath);
        if (lookup === ignore) continue;
        if (fs.existsSync(lookup)) {
          return [lookup];
        }
      }
      return;
    }

    // For glob patterns, expand manually (glob.sync fails on UNC paths)
    for (let i = paths.length - 1; i >= 0; i--) {
      const lookup = path.join(paths[i], filePath);
      const expanded = expandGlob(lookup);
      if (expanded.length) return expanded;
    }

    return;
  };

  stylusUtils.lookup = function(filePath, paths, ignore) {
    if (stylusUtils.absolute(filePath)) {
      if (hasGlob(filePath)) {
        return expandGlob(filePath)[0] || undefined;
      }
      if (fs.existsSync(filePath)) {
        return filePath;
      }
      return;
    }
    // For simple relative paths, try fs first
    if (!hasGlob(filePath)) {
      for (let i = paths.length - 1; i >= 0; i--) {
        const lookup = path.join(paths[i], filePath);
        if (lookup === ignore) continue;
        if (fs.existsSync(lookup)) return lookup;
      }
      return;
    }
    return origLookup.call(this, filePath, paths, ignore);
  };

  hexo.log.info('[fix-stylus] Patched stylus utils for UNC/WSL compatibility');
}

patchStylusUtils();
