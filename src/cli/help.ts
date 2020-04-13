import { blueBright, cyanBright } from 'ansi-colors';
import { Help, ICommandItem, ICommand } from '../types';
import { buildMenu, buildExample, combineMenuItem } from '../utils';

const help: Help = (pargs, config, commands, isRoot) => {

  const command = config.command || 'Gobu';
  const cmds = { ...config.commands };
  const commandStr = buildMenu(cmds);
  const helpConfig = {
    name: '--help',
    alias: '-h',
    description: 'shows help menu.'
  } as ICommandItem;

  const optionConfigs = [...combineMenuItem<ICommandItem>(cmds, 'options'), { ...helpConfig }];
  const optionStr = buildMenu({ ...optionConfigs } as ICommandItem[]);
  const exampleStr = buildExample(combineMenuItem(cmds, 'examples'), command);

  const template = `
-----------------------------------------------------------------------
 ${blueBright(config.name.charAt(0).toUpperCase() + config.name.slice(1))} Menu
-----------------------------------------------------------------------

$ usage: ${command.toLowerCase()} <command> [options...]

${cyanBright('Commands')}:
${commandStr}

${cyanBright('Options')}:
${optionStr}

${cyanBright('Examples')}:
${exampleStr}
`;

  return template;

};

export default help;

