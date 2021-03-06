import { isScope, normalizeScopes, log, getScopesByName, randomNumber, simpleClone } from '../utils';
import { runner, createTransform, maxLength, padRight } from '../tools';
import ansi from 'ansi-colors';
import { BASE_COLORS } from '../contstants';
import help from './help';
import { Command, ICommand, IMap, IScope } from '../types';

const exec: Command = (pargs, config) => {

  pargs._raw.shift(); // first arg is "exec" we don't need it.
  const script = pargs._raw[0]; // the script name to be run.
  let scopes = normalizeScopes(pargs.scope || pargs.scopes);
  const scopeNames = [...scopes];
  scopes = scopes.length ? scopes : Object.keys(config.scopes).map(k => config.scopes[k].name);
  const isParallel = (pargs.p || pargs.parallel) as boolean;
  const isRoot = isScope(config.directory);
  const _help = help(simpleClone(pargs), config);

  function action() {

    if (!isRoot) {
      log.alert(`Cannot exec script "${script}", the directory is not root.`);
      return;
    }

    if (!script) {
      log.alert(`Cannot exec script of "undefined".`);
      return;
    }

    const spargs = [script, ...pargs.__];

    if (config.command === 'npm')
      spargs.unshift('run');

    // Container for missing scope/script commands.
    const missing = [];

    // Map of directory to scope
    // used for managing child processes.
    const map: IMap<IScope> = {};

    const maxPrefix = maxLength(scopeNames) + 2;

    const dirs = getScopesByName(scopes, config.scopes).filter((s, i) => {
      if (!s) {
        missing.push(scopes[i]);
        return false;
      }
      const scripts = s.scripts || {};
      // Ensure the script exists.
      if (!scripts[script])
        missing.push(scopes[i]);
      map[s.directory] = s;
      return s;
    }).map(s => s.directory);

    // No matching scopes.
    if (!dirs.length) {
      log.alert(`Command exec using "${script} aborting, no scopes defined.`);
      return;
    }
    else if (missing.length) {
      log.caution(`Skipping scope(s) "${missing.join(', ')}" unknown or missing script "${script}".`);
    }

    if (isParallel) {

      const children = runner.runScope(spargs, dirs);
      const nums = [];

      children.forEach(child => {

        const scope = map[child.directory];
        const num = randomNumber(0, BASE_COLORS.length, nums);
        nums.push(num);

        const prefix = ansi[scope.color] || ansi[BASE_COLORS[num]];
        const out = createTransform(prefix(scope.name), { maxPrefix });
        const err = createTransform(prefix(scope.name), { maxPrefix });

        if (child.stdout) {
          child.stdout.pipe(out).pipe(process.stdout);
        }

        if (child.stderr) {
          child.stderr.pipe(err).pipe(process.stderr);

        }

      });
    }
    else {
      runner.runScopeSync(spargs, dirs, { stdio: 'inherit' });
    }

  }

  return {
    name: 'exec',
    description: 'executes in all packages.',
    alias: 'ex',
    action,
    options: [
      {
        name: '--scope',
        alias: [],
        params: '<name>',
        description: 'limits to specified packages.'
      },
      {
        name: '--force',
        alias: ['-f'],
        description: 'forces action/command'
      }
    ],
    examples: [
      '{{name}} exec build',
      '{{name}} exec build --scope app2',
      '{{name}} exec build --scope={app1,app2}',
    ],
    help: _help
  } as ICommand;

};

export default exec;