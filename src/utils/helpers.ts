import commandExists from 'command-exists';

/**
 * Alias for process.cwd().
 */
export const root = process.cwd();

/**
 * Checks if "yarn" is available.
 */
export const isYarn = commandExists.sync('yarn');

/**
 * Gets the current package manager.
 */
export const pkgmgr = isYarn ? 'yarn' : 'npm';

/**
 * Wraps Promise returning object containing resulting data and/or Error.
 * 
 * @param prom the Promise to be wrapped.
 */
export function promise<T>(prom: Promise<T>) {
  return prom.then(data => ({ err: null, data }))
    .catch(err => ({ err, data: null as T }));
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