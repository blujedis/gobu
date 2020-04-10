/* eslint-disable no-console */
import {
  parseArgv, buildExample, buildMenu, pkgmgr, log, combineMenuItem,
  runner, writer, simpleClone, load, catchError, extendCommands
} from '../utils';
import exec from './exec';
import passthrough from './passthrough';
import help from './help';
import { ICli } from '../types';
import bootstrap from './bootstrap';

const pargs = parseArgv();
let cmd = pargs._[0];

async function init() {

  let config = await load();

  // Define cli helpers to pass to external commands.
  const cli: ICli = {
    pargs,
    config,
    pkgmgr,
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


  config = extendCommands(config, pargs, cli);

  // Extend any internal commands.
  config.commands.exec = exec(simpleClone(pargs), config);
  config.commands.bootstrap = bootstrap(simpleClone(pargs), config);

  // Check for global help.
  if (!pargs._raw.length || ((pargs.h || pargs.help) && !cmd)) {
    process.stdout.write(help(simpleClone(pargs), config) + '\n');
    return;
  }

  config.commands.exec.help = help(simpleClone(pargs), config);
  config.commands.bootstrap.help = help(simpleClone(pargs), config);

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