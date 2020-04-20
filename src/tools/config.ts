import { read } from './file';
import { join, dirname, resolve } from 'path';
import findUp from 'find-up';
import glob from 'fast-glob';
import { IConfig, IPackage, IMap, IScope, Command, ICli } from '../types';
import { CHILD_KEYS } from '../contstants';
import { promise, merge, simpleClone } from '../utils/helpers';
import { log, catchError } from '../utils/log';
import { IKawkahParserResult } from 'kawkah-parser';

/**
 * Reads up finding matching files.
 * 
 * @param filename the file name to read up from.
 * @param maxLevels the max levels to recurse up (default: 5)
 */
async function readUp(filename: string, maxLevels: number = 5) {
  let ctr = 0;
  const found = [];
  await findUp(async dir => {
    if (ctr > maxLevels)
      return findUp.stop;
    const path = join(dir, filename);
    const hasPkg = await findUp.exists(path);
    ctr++;
    if (hasPkg)
      found.push(path);
    return dir;
  }, { type: 'file' });
  return found;
}

/**
 * Reads looking for root Gobu configuration.
 */
export async function readRoot() {

  const packages = await readUp('package.json');
  const configs = await readUp('gobu.json');
  let config: IConfig = null;

  // Assume last path is package path.
  if (packages.length) {
    const path = packages.pop();
    const pkg = await read<IPackage>(path, true);
    const gobu = pkg.gobu || {} as IConfig;
    config = { ...gobu } as IConfig;
    config.isExternal = false;
    config.path = path;
    config.directory = dirname(path);
    config.version = pkg.version;
    config.description = pkg.description;
    config.scripts = pkg.scripts;
    config.dependencies = pkg.dependencies || {};
    config.devDependencies = pkg.devDependencies || {};
    config.peerDependencies = pkg.peerDependencies || {};
    config.optionalDependencies = pkg.optionalDependencies || {};
  }

  // If config contains path a gobu.json config exists.
  // Allow gobu.json to override package.json "gobu" key.
  if (configs.length) {
    const gobu = await read<IConfig>(configs[0], true);
    config = { ...config, ...gobu };
    config.isExternal = true;
    config.path = configs[0];
    config.directory = dirname(configs[0]);
  }

  config.hoist = config.hoist || [];
  config.workspaces = config.workspaces || [];

  return config;

}

/**
 * Reads package.json
 * 
 * @param filename the path of the package to be found.
 */
export async function readPackage(filename: string) {
  filename = join(filename.replace(/package\.json$/, ''), 'package.json');
  return read(filename, true);
}

/**
 * Reads child workspaces or scopes using glob pattern matching.
 * 
 * @param globs the globs of paths representing scoped workspaces.
 */
export async function readScopes(globs: string[]) {
  if (!globs.includes('.'))
    globs.push('./*');
  const dirs = await glob(globs, { onlyDirectories: true, ignore: ['**/node_modules/**'] });
  const proms = dirs.map(async (path) => {
    const pkg = await readPackage(join(path, 'package.json')) as IMap<any>;
    const conf = (pkg && pkg.gobu) || {};
    if (pkg) {
      const scope: IScope = {
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        scripts: pkg.scripts || {},
        directory: resolve(path),
        path: join(path, 'package.json'),
        dependencies: pkg.dependencies || {},
        devDependencies: pkg.devDependencies || {},
        optionalDependencies: pkg.optionalDependencies || {},
        peerDependencies: pkg.peerDependencies || {}
      };
      CHILD_KEYS.forEach(k => {
        if (typeof conf[k] !== 'undefined')
          scope[k] = conf[k];
      });
      return scope;
    }

  });
  return (await Promise.all(proms)).filter(obj => {
    return typeof obj !== 'undefined' && obj !== null;
  });
}


/**
 * Imports commands for root or child scopes.
 * 
 * @param config the current loaded config.
 * @param pargs parsed result to pass to command init.
 * @param cli the cli object to pass to command init.
 */
export function externalCommands(config: IConfig, pargs: IKawkahParserResult, cli: ICli) {

  if (!config)
    return config;

  const entrypoints: string[] = [];

  if (config.entrypoint)
    entrypoints.push(join(config.directory, config.entrypoint));

  Object.keys(config.scopes || {}).forEach(k => {
    const scope = config.scopes[k];
    if (scope.entrypoint)
      entrypoints.push(join(scope.directory, scope.entrypoint));
  });

  entrypoints.forEach(entrypoint => {

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const commands = require(entrypoint) as IMap<Command>;

      for (const k in commands) {
        if (!commands.hasOwnProperty(k)) continue;
        const cmd = commands[k];
        config.commands[k] = commands[k](simpleClone(pargs), config, cli);
      }

    }
    catch (ex) {
      catchError(ex);
      log.alert(`Failed to extend commands using path "${config.entrypoint}".`);
      process.exit(1);
    }

  });

  return config;

}

/**
 * Reads scopes recursing up building project configuration.
 * 
 * @param defaults default values for the configuration.
 */
export async function load(defaults?: Partial<IConfig>) {

  let { data: config } = await promise(readRoot());

  if (!config)
    return { ...defaults };

  config = merge(true, { ...defaults } as IConfig, config);

  // Ensure scopes.
  if (!config.workspaces || !config.workspaces.length)
    config.workspaces = [...defaults.workspaces];

  // Change dir so we read scopes from top level down.
  const cwd = process.cwd();
  process.chdir(config.directory);
  const { data: scopes } = await promise(readScopes(config.workspaces));
  process.chdir(cwd);

  if (scopes && scopes.length) {
    config.scopes = scopes.reduce((obj, pkg) => {
      obj[pkg.name] = pkg;
      return obj;
    }, {} as IMap<IScope>);
  }
  else {
    config.scopes = {};
  }

  return config;

}
