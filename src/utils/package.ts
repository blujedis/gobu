import { readFile, writeFile } from 'fs-extra';
import { join } from 'path';
import { root, promise } from './helpers';
import { log } from './log';

export async function readConfig<T = any>(dir: string = root, filename: string = 'gobu.json') {
  const { err, data } = await promise(readFile(join(dir, filename)));
  if (err)
    return null;
  return JSON.parse((data || '').toString());
}

/**
 * Reads a package.json file by passing it's directory.
 * 
 * @param dir the package directory.
 */
export async function readPkg<T = any>(dir: string = root): Promise<T> {
  const { err, data } = await promise(readFile(join(dir, 'package.json')));
  if (err)
    return null;
  return JSON.parse((data || '').toString());
}

/**
 * Writes a package.json file.
 * 
 * @param data the object to be written.
 * @param dir the directory to write to.
 */
export async function writePkg<T extends object>(data: string | T, dir: string = root) {
  const { err, data: result } = await promise(writeFile(join(dir, 'package.json'), data).then(res => true));
  if (err)
    return false;
  return true;
}

/**
 * Reads packages by directory roots.
 * 
 * @param dirs the directories of packages to be read.
 */
export async function readPkgs(dirs: string[]) {
  const result = await Promise.all(dirs.map(async (dir) => {
    const { err, data } = await promise(readFile(join(dir, 'package.json'), 'utf8'));
    if (err)
      return '';
    return JSON.parse(data.toString());
  }));
  return result.filter(v => !!v);
}

/**
 * Reads "scripts" keys by passing package directory roots.
 * 
 * @param dirs package directories to load scripts from.  
 */
export async function readScripts(dirs: string[]) {
  const result = await readPkgs(dirs);
  return result.map(pkg => {
    return {
      scope: pkg.name,
      scripts: pkg.scripts || {}
    };
  });
}

