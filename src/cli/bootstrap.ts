import { isScope, runner, log } from '../utils';
import { Command, ICommand, IScope, IMap } from '../types';
import { ConsoleTransport } from 'kricket';

const bootstrap: Command = (pargs, config) => {

  const isRoot = isScope(config.directory);

  function action() {

    if (!isRoot) {
      log.alert(`Bootstrap must be run from root directory.`);
      return;
    }

    const spargs = ['install', ...pargs.__];

    // Map of directory to scope
    // used for managing child processes.
    const map: IMap<IScope> = {};
    let scopes: string[] = (pargs.scope || pargs.scopes) || [];
    scopes = !Array.isArray(scopes) ? [scopes] : scopes;
    const defined = scopes.length ? scopes : Object.keys(config.scopes);

    const dirs = defined.map((k, i) => {
      const scope = config.scopes[k];
      if (!scopes.includes(scope.name))
        scopes.push(scope.name);
      map[scope.directory] = scope;
      return scope.directory;
    });

    // Add root directory.
    dirs.unshift(config.directory);

    const children = runner.run(spargs, dirs, { stdio: 'inherit' });

    children.forEach(child => {
      const scope = map[child.directory];
    });

  }

  return {
    name: 'bootstrap',
    description: 'bootstraps project(s).',
    alias: 'boot',
    action,
    options: [],
    examples: [
      '{{name}} bootstrap'
    ]
  } as ICommand;

};

export default bootstrap;