import { log, promise, catchError, simpleClone, pkgmgr } from '../utils';
import { write, read } from '../tools';
import { join } from 'path';
import { Command, ICommand, IPackage, IConfig } from '../types';
import { existsSync } from 'fs';
import help from './help';
import { BASE_DEFAULTS } from '../contstants';

const enable: Command = (pargs, config) => {

  // const isRoot = isScope(config.directory);
  const _help = help(simpleClone(pargs), config);

  async function action() {

    const gobuPath = join(config.directory || process.cwd(), 'gobu.json');
    const pkgPath = join(config.directory || process.cwd(), 'package.json');

    let { data: pkgData } = await promise(read<IPackage>(pkgPath, true));

    // Package.json exists.
    if (pkgData || pargs.internal) {

      if (!pkgData && !(pargs.f || pargs.force)) {
        log.caution(`Package.json NOT found enable config failed, try "${pkgmgr} init".`);
        return;
      }

      const status = pkgData ? 'updated' : 'enabled';

      pkgData = pkgData || {} as any;

      const mergedBase = { ...BASE_DEFAULTS, ...pkgData.gobu };
      const { name, command, workspaces, entrypoint, packageManager } = mergedBase;
      pkgData.gobu = { name, command, workspaces, entrypoint, packageManager } as IConfig;

      // Write back with defaults.
      const { err: serr } = await promise(write(join(config.directory || process.cwd(), 'package.json'), pkgData, true));

      if (serr)
        return catchError(serr);

      log.success(`Project ${status} at "package.json".`);

    }
    else {

      let current = {};

      let status = 'enabled';

      // Gobu path already exists.
      if (existsSync(gobuPath)) {
        const { data } = await promise(read<IPackage>(gobuPath, true));
        if (data) {
          current = data;
          status = 'updated';
        }
      }

      const { err: gerr } = await promise(write(gobuPath, { ...BASE_DEFAULTS, ...current }, true));

      if (gerr)
        return catchError(gerr);

      log.success(`Project ${status} at "gobu.json".`);

    }

  }

  return {
    name: 'enable',
    description: 'enables project for use with {{name}}.',
    alias: ['en'],
    action,
    options: [
      {
        name: '--internal',
        description: 'use package instead of gobu.json',
        alias: []
      }
    ],
    examples: [],
    help: _help
  } as ICommand;

};

export default enable;