"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = require("ansi-colors");
const utils_1 = require("../utils");
const help = (pargs, config) => {
    const command = config.command || 'Gobu';
    const cmds = { ...config.commands };
    const commandStr = utils_1.buildMenu(cmds);
    const helpConfig = {
        name: '--help',
        alias: '-h',
        description: 'shows help menu.'
    };
    const optionConfigs = utils_1.combineMenuItem(cmds, 'options');
    optionConfigs.push(helpConfig);
    const optionStr = utils_1.buildMenu(optionConfigs);
    const exampleStr = utils_1.buildExample(utils_1.combineMenuItem(cmds, 'examples'), command);
    const template = `
-----------------------------------------------------------------------
 ${ansi_colors_1.blueBright(config.name.charAt(0).toUpperCase() + config.name.slice(1))} Menu
-----------------------------------------------------------------------

$ usage: ${command.toLowerCase()} <command> [options...]

${ansi_colors_1.cyanBright('Commands')}:
${commandStr}

${ansi_colors_1.cyanBright('Options')}:
${optionStr}

${ansi_colors_1.cyanBright('Examples')}:
${exampleStr}
`;
    return template;
};
exports.default = help;
//# sourceMappingURL=help.js.map