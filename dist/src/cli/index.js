"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const utils_1 = require("../utils");
const exec_1 = __importDefault(require("./exec"));
const passthrough_1 = __importDefault(require("./passthrough"));
const help_1 = __importDefault(require("./help"));
const bootstrap_1 = __importDefault(require("./bootstrap"));
const pargs = utils_1.parseArgv();
let cmd = pargs._[0];
async function init() {
    let config = await utils_1.load();
    // Define cli helpers to pass to external commands.
    const cli = {
        pargs,
        config,
        pkgmgr: utils_1.pkgmgr,
        menu: {
            buildCommands: utils_1.buildMenu,
            buildOptions: utils_1.buildMenu,
            buildExamples: utils_1.buildExample,
            combineItems: utils_1.combineMenuItem
        },
        runner: utils_1.runner,
        writer: utils_1.writer,
        log: utils_1.log
    };
    config = utils_1.extendCommands(config, pargs, cli);
    // Extend any internal commands.
    config.commands.exec = exec_1.default(utils_1.simpleClone(pargs), config);
    config.commands.bootstrap = bootstrap_1.default(utils_1.simpleClone(pargs), config);
    // Check for global help.
    if (!pargs._raw.length || ((pargs.h || pargs.help) && !cmd)) {
        process.stdout.write(help_1.default(utils_1.simpleClone(pargs), config) + '\n');
        return;
    }
    config.commands.exec.help = help_1.default(utils_1.simpleClone(pargs), config);
    config.commands.bootstrap.help = help_1.default(utils_1.simpleClone(pargs), config);
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