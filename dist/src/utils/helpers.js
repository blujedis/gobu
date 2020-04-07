"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_exists_1 = __importDefault(require("command-exists"));
/**
 * Alias for process.cwd().
 */
exports.root = process.cwd();
/**
 * Checks if "yarn" is available.
 */
exports.isYarn = command_exists_1.default.sync('yarn');
/**
 * Gets the current package manager.
 */
exports.pkgmgr = exports.isYarn ? 'yarn' : 'npm';
/**
 * Wraps Promise returning object containing resulting data and/or Error.
 *
 * @param prom the Promise to be wrapped.
 */
function promise(prom) {
    return prom.then(data => ({ err: null, data }))
        .catch(err => ({ err, data: null }));
}
exports.promise = promise;
function merge(defaults, target, ...sources) {
    if (typeof defaults !== 'boolean') {
        if (typeof target !== 'undefined')
            sources.unshift(target);
        target = defaults;
    }
    // no other sources just return target.
    if (!sources.length)
        return target;
    const next = sources.shift();
    // skip go to next.
    if (typeof next !== 'object' || Array.isArray(next))
        return merge(target, ...sources);
    for (const k in next) {
        if (typeof next[k] === 'object' && !Array.isArray(next[k])) {
            if (typeof target[k] === 'undefined' || Array.isArray(target[k]) || typeof target[k] !== 'object')
                target[k] = next[k];
            else
                target[k] = merge(target[k], next[k]);
        }
        else if (defaults && typeof next[k] !== 'undefined') {
            target[k] = next[k];
        }
        else {
            target[k] = next[k];
        }
    }
    return target;
}
exports.merge = merge;
//# sourceMappingURL=helpers.js.map