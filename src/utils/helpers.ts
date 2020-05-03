import commandExists from 'command-exists';
import { parse } from 'kawkah-parser';
import cs from 'cross-spawn';
import { resolve } from 'path';
import matcher from 'micromatch';
import { IMap, IScope, ICommand, ICommandItem } from '../types';


/**
 * Alias for process.cwd().
 */
export const cwd = process.cwd();

/**
 * Cross spawn instance.
 */
export const spawn = cs;

/**
 * Cross spawn sync instance.
 */
export const spawnSync = cs.sync;

/**
 * Checks if "yarn" is available.
 */
export const isYarn = commandExists.sync('yarn');

/**
 * Gets the current package manager.
 */
export const pkgmgr = isYarn ? 'yarn' : 'npm';

/**
 * Checks if a directory path is a known package directory.
 * 
 * @param compare array of known package paths.
 * @param dir the directory path to inspect if is known.
 */
export function isScope(compare: string[], dir?: string): string;

/**
 * Checks if a directory path is a known package directory.
 * 
 * @param compare a known package path.
 * @param dir the directory path to inspect if is known.
 */
export function isScope(compare: string, dir?: string): string;
export function isScope(compare: string | string[], dir: string = process.cwd()) {
  dir = resolve(dir).replace(/\/$/, '');
  if (!Array.isArray(compare))
    compare = [compare];
  return compare.find(c => dir === c);
}

/**
 * Gets scope by matching key and value.
 * 
 * @param key the key in the scope to match against.
 * @param val the value of the key to use to compare.
 * @param map object containing values.
 */
export function getValueByKey<T>(key: keyof T, val: string, map: IMap<any>): T {
  let result: T;
  map = map || {};
  for (const k in map) {
    if (!map.hasOwnProperty(k)) continue;
    if (result) break;
    const s = map[k];
    if (map[k][key] && map[k][key] === val)
      result = map[k];
  }
  return result;
}

/**
 * Gets scope by matching directory.
 * 
 * @param dir the directory to use to match loaded scope.
 * @param scopes object containing loaded scopes.
 */
export function getScopeByDir(dir: string, scopes: IMap<IScope>) {
  return getValueByKey<IScope>('directory', dir, scopes);
}

/**
 * Gets scope by matching directory.
 * 
 * @param dirs the directories to use to match loaded scope.
 * @param scopes object containing loaded scopes.
 */
export function getScopesByDir(dirs: string[], scopes: IMap<IScope>) {
  return dirs.map(d => getValueByKey<IScope>('directory', d, scopes)).filter(v => !!v);
}

/**
 * Gets scope from collection by name.
 * 
 * @param name the scope name to be found. 
 * @param scopes the object collection of scopes.
 */
export function getScopeByName(name: string, scopes: IMap<IScope>) {
  return getValueByKey<IScope>('name', name, scopes);
}

/**
 * Gets scopes filtering by name.
 * 
 * @param names the names to compare for filtering scopes.
 * @param scopes the scopes collection.
 */
export function getScopesByName(names: string[], scopes: IMap<IScope>) {
  return names.map(n => getValueByKey<IScope>('name', n, scopes));
}

/**
 * Gets scripts for the provided scope.
 * 
 * @param dir the path to compare to known package paths.
 * @param scopes the loaded scopes.
 */
export function getScriptsByDir(dir: string, scopes: IMap<IScope>): IMap<string> {
  if (!dir)
    return {};
  dir = resolve(dir).replace(/\/$/, '');
  const scope = getScopeByDir(dir, scopes);
  return (scope && scope.scripts) || {};
}

/**
 * Normalizes scopes to array ensuring correct format.
 * 
 * @param scopes the scope or array of scopes passed from command.
 */
export function normalizeScopes(scopes: string | string[] = []) {
  if (!Array.isArray(scopes))
    scopes = [scopes];
  return scopes.map(s => s.trim());
}

/**
 * Wraps Promise returning object containing resulting data and/or Error.
 * 
 * @param prom the Promise to be wrapped.
 */
export function promise<T>(prom: Promise<T>): Promise<{ err: Error, data: T }> {
  try {
    return prom.then(data => ({ err: null, data }))
      .catch(err => ({ err, data: null as T }));
  }
  catch (ex) {
    return Promise.resolve({ err: ex, data: null });
  }
}

/**
 * Simple usings JSON to clone a simple object.
 * 
 * @param obj the object to be cloned
 */
export function simpleClone<T extends object>(obj: T) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Merges object literals.
 * 
 * @param defaults when true respects defaults.
 * @param target the target object to merge to.
 * @param sources the source objects to merge from.
 */
export function merge<T extends object, S extends object>(defaults: boolean, target: T, ...sources: T[]): T;

/**
 * Merges object literals.
 * 
 * @param defaults when true respects defaults.
 * @param target the target object to merge to.
 * @param sources the source objects to merge from.
 */
export function merge<T extends object, S extends object>(target: T, ...sources: T[]): T;
export function merge(defaults: boolean | object, target: object, ...sources: object[]) {
  if (typeof defaults !== 'boolean') {
    if (typeof target !== 'undefined')
      sources.unshift(target);
    target = defaults;
  }
  // no other sources just return target.
  if (!sources.length)
    return target;
  const next = sources.shift();
  // skip go to next.
  if (typeof next !== 'object' || Array.isArray(next))
    return merge(target, ...sources);
  for (const k in next) {
    if (typeof next[k] === 'object' && !Array.isArray(next[k])) {
      if (typeof target[k] === 'undefined' || Array.isArray(target[k]) || typeof target[k] !== 'object')
        target[k] = next[k];
      else
        target[k] = merge(target[k], next[k]);
    }
    else if (defaults && typeof next[k] !== 'undefined') {
      target[k] = next[k];
    }
    else {
      target[k] = next[k];
    }
  }
  return target;
}

/**
 * Parses argv and command line tokens.
 */
export function parseArgv() {
  const parsed = parse();
  return parsed;
}

/**
 * Simple template format, uses "g" RegExp flag to
 * replace all instances found.
 * 
 * @param template the template to be formatted.
 * @param map the map containing key values to replace
 */
export function formatTemplate(template: string, map: IMap<string>) {
  return Object.keys(map).reduce((tplt, key) => {
    return template.replace(new RegExp(`{{${key}}}`, 'gi'), map[key]);
  }, template);
}

/**
 * Builds simple string for help menu.
 * 
 * @param obj object of commands or array of options to build menu for.
 * @param name name to replace in strings.
 * @param tabs the number of tabs after key name.
 */
export function buildMenu(obj: IMap<ICommand> | ICommand[] | ICommandItem[], name: string = 'Gobu', tabs: number = 8) {
  let arr = obj as ICommand[];
  if (!Array.isArray(obj))
    arr = Object.keys(obj).map(k => obj[k]);
  // Exclude when menu is false.
  const result = arr.filter(v => v.menu !== false).map(o => {
    o.alias = o.alias || [];
    o.description = o.description.replace(/{{name}}/gi, name);
    if (!Array.isArray(o.alias))
      o.alias = [o.alias];
    o.alias = o.params ? [...o.alias, o.params] : o.alias;
    o.alias = [...new Set([o.name, ...o.alias])]; // hack to remove ensure no dupes.
    return [o.alias.join(', '), (o.description || '')];
  });
  const max = result.reduce((a, c) => {
    if (c[0].length > a)
      return c[0].length;
    return a;
  }, 0);
  return result.map(v => {
    const len = v[0].length;
    if (len < max)
      v[0] = v[0] + ' '.repeat(max - len);
    return '  ' + v.join(' '.repeat(tabs));
  }).join('\n');
}

/**
 * Formats example menu items replacing {{name}} with provided value.
 * 
 * @param examples array of examples for help menu.
 * @param name the name to replace {{name}} with.
 */
export function buildExample(examples: string[], name: string = 'gobu') {
  return examples.map(e => '  ' + formatTemplate(e, { name: name.toLowerCase() })).join('\n');
}

/**
 * Reduces nested command key to single array.
 * 
 * @param obj object containing commands.
 * @param key the nested array key to reduce.
 */
export function combineMenuItem<T>(obj: IMap<ICommand>, key: keyof ICommand, filter: string[] = []) {
  return Object.keys(obj).reduce((a, c) => {
    if (filter.includes(c))
      return a;
    const cmd = obj[c];
    if (cmd[key] && Array.isArray(cmd[key]) && (cmd[key] as string[]).length)
      a = [...a, ...cmd[key as string]];
    return a;
  }, [] as T[]);
}

/**
 * Gets number within range.
 * 
 * @param min the minimum number
 * @param max the maximum number
 * @param exclude numbers to exclude.
 */
export function randomNumber(min, max, exclude?: number[]) {
  const run = () => {
    const num = Math.floor(Math.random() * (max - min) + min);
    if (exclude && exclude.includes(num)) {
      if (exclude.length < max)
        return run();
      throw new Error(`Too many iterations all excluded "[${exclude.sort().join(', ')}]"`);
    }
    return num;
  };
  return run();
}

/**
 * Parses modules object building install/add string for modules to be installed.
 * 
 * @param modules the object containing the modules to be installed.
 * @param filters string array containing filters. 
 */
export function filterModules(modules: IMap<string>, filters: string[] = []) {
  const keys = Object.keys(modules || {});
  filters = Array.from(new Set(filters));
  const matched = matcher(keys, filters);
  const unmatched = keys.filter(k => !matched.includes(k));
  return {
    matched,
    unmatched
  };
}