"use strict";
/**
 * Passes through commands to yarn or npm
 * whichever package manager is installed.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const tools_1 = require("../tools");
const passthrough = (pargs, config) => {
    const cmd = pargs._raw.shift();
    const cwd = process.cwd();
    const isRoot = utils_1.isScope(config.directory);
    const scopes = utils_1.normalizeScopes(pargs.scope || pargs.scopes);
    const isParallel = (pargs.p || pargs.parallel);
    // Load scripts from packages if applicable.
    let scripts = {};
    if (isRoot)
        scripts = config.scripts || {};
    else if (config.scopes)
        scripts = utils_1.getScriptsByDir(cwd, config.scopes);
    const spargs = scripts[cmd] ? [...pargs.__] : [...pargs._raw];
    if (!utils_1.isYarn)
        spargs.unshift('run');
    spargs.unshift(cmd);
    // Run scoped event.
    if (scopes.length) {
        const missing = [];
        const dirs = utils_1.getScopesByName(scopes, config.scopes).filter((s, i) => {
            if (!s)
                missing.push(scopes[i]);
            return !!s;
        }).map(s => s.directory);
        // No matching scopes.
        if (!dirs.length) {
            utils_1.log.alert(`Command "${cmd} aborting missing scope(s) "${missing.join(', ')}".`);
            return;
        }
        else if (missing.length) {
            utils_1.log.caution(`Skipping unknown scope(s) "${missing.join(', ')}".`);
        }
        if (isParallel)
            tools_1.runner.runScope(spargs, dirs, { stdio: 'inherit' });
        else
            tools_1.runner.runScopeSync(spargs, dirs, { stdio: 'inherit' });
    }
    // Run local script or fallthough to package manager task..
    else {
        if ((isRoot && ['add', 'install'].includes(cmd)) && !(pargs.f || pargs.force) && !(pargs.h || pargs.help)) {
            utils_1.log.alert(`Command "${cmd}" failed in root, if sure try with -f or --force.`);
            return;
        }
        if (isParallel)
            tools_1.runner.runScope(spargs, { stdio: 'inherit' });
        else
            tools_1.runner.runScopeSync(spargs, { stdio: 'inherit' });
    }
};
exports.default = passthrough;
//# sourceMappingURL=passthrough.js.map