"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const utils_1 = require("../utils");
const tools_1 = require("../tools");
const exec_1 = __importDefault(require("./exec"));
const passthrough_1 = __importDefault(require("./passthrough"));
const bootstrap_1 = __importDefault(require("./bootstrap"));
const enable_1 = __importDefault(require("./enable"));
const help_1 = __importDefault(require("./help"));
const contstants_1 = require("../contstants");
const pargs = utils_1.parseArgv();
let cmd = pargs._[0];
async function init() {
    let config = await tools_1.load(utils_1.simpleClone(contstants_1.CONFIG_DEFAULTS));
    // Define cli helpers to pass to external commands.
    const cli = {
        pargs,
        config,
        menu: {
            buildCommands: utils_1.buildMenu,
            buildOptions: utils_1.buildMenu,
            buildExamples: utils_1.buildExample,
            combineItems: utils_1.combineMenuItem
        },
        runner: tools_1.runner,
        writer: tools_1.writer,
        log: utils_1.log
    };
    // Extend with external commands.
    config = tools_1.externalCommands(config, pargs, cli);
    // Extend internal commands.
    config.commands.exec = exec_1.default(utils_1.simpleClone(pargs), config);
    config.commands.bootstrap = bootstrap_1.default(utils_1.simpleClone(pargs), config);
    config.commands.enable = enable_1.default(utils_1.simpleClone(pargs), config);
    // Check for global help.
    if (!pargs._raw.length || ((pargs.h || pargs.help) && !cmd)) {
        process.stdout.write(help_1.default(utils_1.simpleClone(pargs), config, config.commands || {}, true) + '\n');
        return;
    }
    // Get list of available commands.
    let cmdExists = false;
    // Look up command by alias if required.
    Object.keys(config.commands || {}).forEach(k => {
        const command = config.commands[k];
        if (command.name === cmd) {
            cmdExists = true;
        }
        else {
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
        return passthrough_1.default(utils_1.simpleClone(pargs), config);
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
init().catch(utils_1.catchError);
//# sourceMappingURL=index.js.map