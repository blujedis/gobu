"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_exists_1 = __importDefault(require("command-exists"));
const kawkah_parser_1 = require("kawkah-parser");
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const path_1 = require("path");
const micromatch_1 = __importDefault(require("micromatch"));
/**
 * Alias for process.cwd().
 */
exports.cwd = process.cwd();
/**
 * Cross spawn instance.
 */
exports.spawn = cross_spawn_1.default;
/**
 * Cross spawn sync instance.
 */
exports.spawnSync = cross_spawn_1.default.sync;
/**
 * Checks if "yarn" is available.
 */
exports.isYarn = command_exists_1.default.sync('yarn');
/**
 * Gets the current package manager.
 */
exports.pkgmgr = exports.isYarn ? 'yarn' : 'npm';
function isScope(compare, dir = process.cwd()) {
    dir = path_1.resolve(dir).replace(/\/$/, '');
    if (!Array.isArray(compare))
        compare = [compare];
    return compare.find(c => dir === c);
}
exports.isScope = isScope;
/**
 * Gets scope by matching key and value.
 *
 * @param key the key in the scope to match against.
 * @param val the value of the key to use to compare.
 * @param map object containing values.
 */
function getValueByKey(key, val, map) {
    let result;
    map = map || {};
    for (const k in map) {
        if (!map.hasOwnProperty(k))
            continue;
        if (result)
            break;
        const s = map[k];
        if (map[k][key] && map[k][key] === val)
            result = map[k];
    }
    return result;
}
exports.getValueByKey = getValueByKey;
/**
 * Gets scope by matching directory.
 *
 * @param dir the directory to use to match loaded scope.
 * @param scopes object containing loaded scopes.
 */
function getScopeByDir(dir, scopes) {
    return getValueByKey('directory', dir, scopes);
}
exports.getScopeByDir = getScopeByDir;
/**
 * Gets scope by matching directory.
 *
 * @param dirs the directories to use to match loaded scope.
 * @param scopes object containing loaded scopes.
 */
function getScopesByDir(dirs, scopes) {
    return dirs.map(d => getValueByKey('directory', d, scopes)).filter(v => !!v);
}
exports.getScopesByDir = getScopesByDir;
/**
 * Gets scope from collection by name.
 *
 * @param name the scope name to be found.
 * @param scopes the object collection of scopes.
 */
function getScopeByName(name, scopes) {
    return getValueByKey('name', name, scopes);
}
exports.getScopeByName = getScopeByName;
/**
 * Gets scopes filtering by name.
 *
 * @param names the names to compare for filtering scopes.
 * @param scopes the scopes collection.
 */
function getScopesByName(names, scopes) {
    return names.map(n => getValueByKey('name', n, scopes));
}
exports.getScopesByName = getScopesByName;
/**
 * Gets scripts for the provided scope.
 *
 * @param dir the path to compare to known package paths.
 * @param scopes the loaded scopes.
 */
function getScriptsByDir(dir, scopes) {
    if (!dir)
        return {};
    dir = path_1.resolve(dir).replace(/\/$/, '');
    const scope = getScopeByDir(dir, scopes);
    return (scope && scope.scripts) || {};
}
exports.getScriptsByDir = getScriptsByDir;
/**
 * Normalizes scopes to array ensuring correct format.
 *
 * @param scopes the scope or array of scopes passed from command.
 */
function normalizeScopes(scopes = []) {
    if (!Array.isArray(scopes))
        scopes = [scopes];
    return scopes.map(s => s.trim());
}
exports.normalizeScopes = normalizeScopes;
/**
 * Wraps Promise returning object containing resulting data and/or Error.
 *
 * @param prom the Promise to be wrapped.
 */
function promise(prom) {
    try {
        return prom.then(data => ({ err: null, data }))
            .catch(err => ({ err, data: null }));
    }
    catch (ex) {
        return Promise.resolve({ err: ex, data: null });
    }
}
exports.promise = promise;
/**
 * Simple usings JSON to clone a simple object.
 *
 * @param obj the object to be cloned
 */
function simpleClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.simpleClone = simpleClone;
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
/**
 * Parses argv and command line tokens.
 */
function parseArgv() {
    const parsed = kawkah_parser_1.parse();
    return parsed;
}
exports.parseArgv = parseArgv;
/**
 * Simple template format, uses "g" RegExp flag to
 * replace all instances found.
 *
 * @param template the template to be formatted.
 * @param map the map containing key values to replace
 */
function formatTemplate(template, map) {
    return Object.keys(map).reduce((tplt, key) => {
        return template.replace(new RegExp(`{{${key}}}`, 'gi'), map[key]);
    }, template);
}
exports.formatTemplate = formatTemplate;
/**
 * Builds simple string for help menu.
 *
 * @param obj object of commands or array of options to build menu for.
 * @param name name to replace in strings.
 * @param tabs the number of tabs after key name.
 */
function buildMenu(obj, name = 'Gobu', tabs = 8) {
    let arr = obj;
    if (!Array.isArray(obj))
        arr = Object.keys(obj).map(k => obj[k]);
    // Exclude when menu is false.
    const result = arr.filter(v => v.menu !== false).map(o => {
        o.alias = o.alias || [];
        o.description = o.description.replace(/{{name}}/gi, name);
        if (!Array.isArray(o.alias))
            o.alias = [o.alias];
        o.alias = o.params ? [...o.alias, o.params] : o.alias;
        o.alias = [...new Set([o.name, ...o.alias])]; // hack to remove ensure no dupes.
        return [o.alias.join(', '), (o.description || '')];
    });
    const max = result.reduce((a, c) => {
        if (c[0].length > a)
            return c[0].length;
        return a;
    }, 0);
    return result.map(v => {
        const len = v[0].length;
        if (len < max)
            v[0] = v[0] + ' '.repeat(max - len);
        return '  ' + v.join(' '.repeat(tabs));
    }).join('\n');
}
exports.buildMenu = buildMenu;
/**
 * Formats example menu items replacing {{name}} with provided value.
 *
 * @param examples array of examples for help menu.
 * @param name the name to replace {{name}} with.
 */
function buildExample(examples, name = 'gobu') {
    return examples.map(e => '  ' + formatTemplate(e, { name: name.toLowerCase() })).join('\n');
}
exports.buildExample = buildExample;
/**
 * Reduces nested command key to single array.
 *
 * @param obj object containing commands.
 * @param key the nested array key to reduce.
 */
function combineMenuItem(obj, key, filter = []) {
    return Object.keys(obj).reduce((a, c) => {
        if (filter.includes(c))
            return a;
        const cmd = obj[c];
        if (cmd[key] && Array.isArray(cmd[key]) && cmd[key].length)
            a = [...a, ...cmd[key]];
        return a;
    }, []);
}
exports.combineMenuItem = combineMenuItem;
/**
 * Gets number within range.
 *
 * @param min the minimum number
 * @param max the maximum number
 * @param exclude numbers to exclude.
 */
function randomNumber(min, max, exclude) {
    const run = () => {
        const num = Math.floor(Math.random() * (max - min) + min);
        if (exclude && exclude.includes(num)) {
            if (exclude.length < max)
                return run();
            throw new Error(`Too many iterations all excluded "[${exclude.sort().join(', ')}]"`);
        }
        return num;
    };
    return run();
}
exports.randomNumber = randomNumber;
/**
 * Parses modules object building install/add string for modules to be installed.
 *
 * @param modules the object containing the modules to be installed.
 * @param filters string array containing filters.
 */
function filterModules(modules, filters = []) {
    const keys = Object.keys(modules || {});
    filters = Array.from(new Set(filters));
    const matched = micromatch_1.default(keys, filters);
    const unmatched = keys.filter(k => !matched.includes(k));
    return {
        matched,
        unmatched
    };
}
exports.filterModules = filterModules;
//# sourceMappingURL=helpers.js.map