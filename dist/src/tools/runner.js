"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../utils/helpers");
function runScope(spargs, scopes, options) {
    if (!Array.isArray(scopes) && typeof scopes !== 'string') {
        options = scopes;
        scopes = undefined;
    }
    scopes = scopes || [];
    scopes = (!Array.isArray(scopes) ? [scopes] : scopes);
    options = options || {};
    if (!scopes.length) {
        return helpers_1.spawn(helpers_1.pkgmgr, spargs, options);
    }
    else {
        const result = [];
        for (const dir of scopes) {
            const opts = { ...options };
            opts.cwd = opts.cwd || dir;
            const child = helpers_1.spawn(helpers_1.pkgmgr, spargs, opts);
            child.directory = dir;
            result.push(child);
        }
        return result;
    }
}
function runScopeSync(spargs, scopes, options) {
    if (!Array.isArray(scopes) && typeof scopes !== 'string') {
        options = scopes;
        scopes = undefined;
    }
    scopes = scopes || [];
    scopes = (!Array.isArray(scopes) ? [scopes] : scopes);
    options = options || {};
    if (!scopes.length) {
        return helpers_1.spawnSync(helpers_1.pkgmgr, spargs, options);
    }
    else {
        const result = [];
        for (const dir of scopes) {
            const opts = { ...options };
            opts.cwd = dir;
            const child = helpers_1.spawnSync(helpers_1.pkgmgr, spargs, opts);
            child.directory = dir;
            result.push(child);
        }
        return result;
    }
}
function runCmd(cmd, args, options, sync = false) {
    if (typeof options === 'boolean') {
        sync = options;
        options = undefined;
    }
    options = options || {};
    if (sync)
        return helpers_1.spawnSync(cmd, args, options);
    return helpers_1.spawn(cmd, args, options);
}
exports.runner = {
    runScope,
    runScopeSync,
    runCmd
};
//# sourceMappingURL=runner.js.map