"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const tools_1 = require("../tools");
const bootstrap = (pargs, config) => {
    const isRoot = utils_1.isScope(config.directory);
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
        alias: 'boot',
        action,
        options: [],
        examples: [
            '{{name}} bootstrap'
        ]
    };
};
exports.default = bootstrap;
//# sourceMappingURL=bootstrap copy.js.map