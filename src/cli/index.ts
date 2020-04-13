/* eslint-disable no-console */
import {
  parseArgv, buildExample, buildMenu, pkgmgr, log, combineMenuItem, simpleClone, catchError,
} from '../utils';
import { externalCommands, load, runner, writer } from '../tools';
import { ICli, IConfig } from '../types';
import exec from './exec';
import passthrough from './passthrough';
import bootstrap from './bootstrap';
import enable from './enable';
import help from './help';
import { CONFIG_DEFAULTS } from '../contstants';

const pargs = parseArgv();
let cmd = pargs._[0];

async function init() {

  let config = await load(simpleClone(CONFIG_DEFAULTS)) as IConfig;

  // Define cli helpers to pass to external commands.
  const cli: ICli = {
    pargs,
    config,
    menu: {
      buildCommands: buildMenu,
      buildOptions: buildMenu,
      buildExamples: buildExample,
      combineItems: combineMenuItem
    },
    runner,
    writer,
    log
  };

  // Extend with external commands.
  config = externalCommands(config, pargs, cli);

  // Extend internal commands.
  config.commands.exec = exec(simpleClone(pargs), config);
  config.commands.bootstrap = bootstrap(simpleClone(pargs), config);
  config.commands.enable = enable(simpleClone(pargs), config);

  // Check for global help.
  if (!pargs._raw.length || ((pargs.h || pargs.help) && !cmd)) {
    process.stdout.write(help(simpleClone(pargs), config, config.commands || {}, true) + '\n');
    return;
  }

  // Get list of available commands.
  let cmdExists = false;

  // Look up command by alias if required.
  Object.keys(config.commands || {}).forEach(k => {
    const command = config.commands[k];
    if (command.name === cmd) {
      cmdExists = true;
    } else {
      let arr = command.alias ? command.alias : [];
      if (arr && !Array.isArray(arr))
        arr = [arr];
      if (arr.includes(cmd)) {
        cmd = command.name;
        cmdExists = true;
      }
    }
  });

  if (!cmdExists)
    return passthrough(simpleClone(pargs), config);

  // Show help for command if exists.
  if ((pargs.h || pargs.help) && config.commands[cmd]) {
    if (config.commands[cmd].help)
      process.stdout.write(config.commands[cmd].help + '\n');
    else
      process.stdout.write(`No help menu found for command "${cmd}".`);
    return;
  }

  return config.commands[cmd].action();

}

init().catch(catchError);