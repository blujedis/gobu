"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const tools_1 = require("../tools");
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const contstants_1 = require("../contstants");
const help_1 = __importDefault(require("./help"));
const exec = (pargs, config) => {
    pargs._raw.shift(); // first arg is "exec" we don't need it.
    const script = pargs._raw[0]; // the script name to be run.
    let scopes = utils_1.normalizeScopes(pargs.scope || pargs.scopes);
    scopes = scopes.length ? scopes : Object.keys(config.scopes).map(k => config.scopes[k].name);
    const isParallel = (pargs.p || pargs.parallel);
    const isRoot = utils_1.isScope(config.directory);
    const _help = help_1.default(utils_1.simpleClone(pargs), config);
    function action() {
        if (!isRoot) {
            utils_1.log.alert(`Cannot exec script "${script}", the directory is not root.`);
            return;
        }
        if (!script) {
            utils_1.log.alert(`Cannot exec script of "undefined".`);
            return;
        }
        const spargs = [script, ...pargs.__];
        if (config.command === 'npm')
            spargs.unshift('run');
        // Container for missing scope/script commands.
        const missing = [];
        // Map of directory to scope
        // used for managing child processes.
        const map = {};
        const dirs = utils_1.getScopesByName(scopes, config.scopes).filter((s, i) => {
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
            utils_1.log.alert(`Command exec using "${script} aborting, no scopes defined.`);
            return;
        }
        else if (missing.length) {
            utils_1.log.caution(`Skipping scope(s) "${missing.join(', ')}" unknown or missing script "${script}".`);
        }
        if (isParallel) {
            const options = {};
            if (!isParallel)
                options.stdio = 'inherit';
            const children = tools_1.runner.runScope(spargs, dirs);
            const nums = [];
            children.forEach(child => {
                const scope = map[child.directory];
                const num = utils_1.randomNumber(0, contstants_1.BASE_COLORS.length, nums);
                nums.push(num);
                const transform = ansi_colors_1.default[scope.color] || ansi_colors_1.default[contstants_1.BASE_COLORS[num]];
                if (child.stdout && child.stdout.on)
                    child.stdout.on('data', tools_1.writer.write(scope.name, transform, scopes));
            });
        }
        else {
            tools_1.runner.runScopeSync(spargs, dirs, { stdio: 'inherit' });
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
    };
};
exports.default = exec;
//# sourceMappingURL=exec.js.map