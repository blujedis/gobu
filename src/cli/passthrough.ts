/**
 * Passes through commands to yarn or npm
 * whichever package manager is installed.
 */

import { Passthrough } from '../types';
import { isScope, log, getScriptsByDir, isYarn, getScopesByName, normalizeScopes } from '../utils';
import { runner } from '../tools';

const passthrough: Passthrough = (pargs, config) => {

  const cmd = pargs._raw.shift();
  const cwd = process.cwd();
  const isRoot = isScope(config.directory);
  const scopes = normalizeScopes(pargs.scope || pargs.scopes);
  const isParallel = (pargs.p || pargs.parallel) as boolean;

  // Load scripts from packages if applicable.
  let scripts = {};
  if (isRoot)
    scripts = config.scripts || {};
  else if (config.scopes)
    scripts = getScriptsByDir(cwd, config.scopes);

  const spargs = scripts[cmd] ? [...pargs.__] : [...pargs._raw];

  if (!isYarn)
    spargs.unshift('run');

  spargs.unshift(cmd);

  // Run scoped event.
  if (scopes.length) {

    const missing = [];
    const dirs = getScopesByName(scopes, config.scopes).filter((s, i) => {
      if (!s)
        missing.push(scopes[i]);
      return !!s;
    }).map(s => s.directory);

    // No matching scopes.
    if (!dirs.length) {
      log.alert(`Command "${cmd} aborting missing scope(s) "${missing.join(', ')}".`);
      return;
    }
    else if (missing.length) {
      log.caution(`Skipping unknown scope(s) "${missing.join(', ')}".`);
    }

    if (isParallel)
      runner.run(spargs, dirs, { stdio: 'inherit' });
    else
      runner.runSync(spargs, dirs, { stdio: 'inherit' });

  }

  // Run local script or fallthough to package manager task..
  else {
    if ((isRoot && ['add', 'install'].includes(cmd)) && !(pargs.f || pargs.force) && !(pargs.h || pargs.help)) {
      log.alert(`Command "${cmd}" failed in root, if sure try with -f or --force.`);
      return;
    }
    if (isParallel)
      runner.run(spargs, { stdio: 'inherit' });
    else
      runner.runSync(spargs, { stdio: 'inherit' });
  }

};

export default passthrough;