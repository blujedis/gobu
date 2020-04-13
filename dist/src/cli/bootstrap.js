"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const tools_1 = require("../tools");
const help_1 = __importDefault(require("./help"));
const bootstrap = (pargs, config) => {
    const isRoot = utils_1.isScope(config.directory);
    const _help = help_1.default(utils_1.simpleClone(pargs), config);
    function action() {
        if (!isRoot) {
            utils_1.log.alert(`Bootstrap must be run from root directory.`);
            return;
        }
        const spargs = ['install', ...pargs.__];
        // Map of directory to scope
        // used for managing child processes.
        const map = {};
        let scopes = (pargs.scope || pargs.scopes) || [];
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
        const children = tools_1.runner.run(spargs, dirs, { stdio: 'inherit' });
        children.forEach(child => {
            const scope = map[child.directory];
        });
    }
    return {
        name: 'bootstrap',
        description: 'bootstraps project(s).',
        alias: ['boot'],
        action,
        options: [],
        examples: [],
        help: _help
    };
};
exports.default = bootstrap;
//# sourceMappingURL=bootstrap.js.map