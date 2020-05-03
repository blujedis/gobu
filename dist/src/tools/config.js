"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("./file");
const path_1 = require("path");
const find_up_1 = __importDefault(require("find-up"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const contstants_1 = require("../contstants");
const helpers_1 = require("../utils/helpers");
const log_1 = require("../utils/log");
/**
 * Reads up finding matching files.
 *
 * @param filename the file name to read up from.
 * @param maxLevels the max levels to recurse up (default: 5)
 */
async function readUp(filename, maxLevels = 5) {
    let ctr = 0;
    const found = [];
    await find_up_1.default(async (dir) => {
        if (ctr > maxLevels)
            return find_up_1.default.stop;
        const path = path_1.join(dir, filename);
        const hasPkg = await find_up_1.default.exists(path);
        ctr++;
        if (hasPkg)
            found.push(path);
        return dir;
    }, { type: 'file' });
    return found;
}
/**
 * Reads looking for root Gobu configuration.
 */
async function readRoot() {
    const packages = await readUp('package.json');
    const configs = await readUp('gobu.json');
    let config = null;
    // Assume last path is package path.
    if (packages.length) {
        const path = packages.pop();
        const pkg = await file_1.read(path, true);
        const gobu = pkg.gobu || {};
        config = { ...gobu };
        config.isExternal = false;
        config.path = path;
        config.directory = path_1.dirname(path);
        config.version = pkg.version;
        config.description = pkg.description;
        config.scripts = pkg.scripts;
        config.dependencies = pkg.dependencies || {};
        config.devDependencies = pkg.devDependencies || {};
        config.peerDependencies = pkg.peerDependencies || {};
        config.optionalDependencies = pkg.optionalDependencies || {};
    }
    // If config contains path a gobu.json config exists.
    // Allow gobu.json to override package.json "gobu" key.
    if (configs.length) {
        const gobu = await file_1.read(configs[0], true);
        config = { ...config, ...gobu };
        config.isExternal = true;
        config.path = configs[0];
        config.directory = path_1.dirname(configs[0]);
    }
    config.nohoist = config.nohoist || [];
    config.workspaces = config.workspaces || [];
    // @ts-ignore
    config.packageManager = helpers_1.pkgmgr;
    return config;
}
exports.readRoot = readRoot;
/**
 * Reads package.json
 *
 * @param filename the path of the package to be found.
 */
async function readPackage(filename) {
    filename = path_1.join(filename.replace(/package\.json$/, ''), 'package.json');
    return file_1.read(filename, true);
}
exports.readPackage = readPackage;
/**
 * Reads child workspaces or scopes using glob pattern matching.
 *
 * @param globs the globs of paths representing scoped workspaces.
 */
async function readScopes(globs = []) {
    globs = globs.map(v => './' + v.replace(/^\.?\/?/, ''));
    const dirs = await fast_glob_1.default(globs, { onlyDirectories: true, ignore: ['**/node_modules/**'] });
    const proms = dirs.map(async (path) => {
        const pkg = await readPackage(path_1.join(path, 'package.json'));
        const conf = (pkg && pkg.gobu) || {};
        if (pkg) {
            const scope = {
                name: pkg.name,
                version: pkg.version,
                description: pkg.description,
                scripts: pkg.scripts || {},
                directory: path_1.resolve(path),
                path: path_1.join(path, 'package.json'),
                dependencies: pkg.dependencies || {},
                devDependencies: pkg.devDependencies || {},
                optionalDependencies: pkg.optionalDependencies || {},
                peerDependencies: pkg.peerDependencies || {},
                nohoist: conf.hoist || []
            };
            contstants_1.CHILD_KEYS.forEach(k => {
                if (typeof conf[k] !== 'undefined')
                    scope[k] = conf[k];
            });
            return scope;
        }
    });
    return (await Promise.all(proms)).filter(obj => {
        return typeof obj !== 'undefined' && obj !== null;
    });
}
exports.readScopes = readScopes;
/**
 * Imports commands for root or child scopes.
 *
 * @param config the current loaded config.
 * @param pargs parsed result to pass to command init.
 * @param cli the cli object to pass to command init.
 */
function externalCommands(config, pargs, cli) {
    if (!config)
        return config;
    const entrypoints = [];
    if (config.entrypoint)
        entrypoints.push(path_1.join(config.directory, config.entrypoint));
    Object.keys(config.scopes || {}).forEach(k => {
        const scope = config.scopes[k];
        if (scope.entrypoint)
            entrypoints.push(path_1.join(scope.directory, scope.entrypoint));
    });
    entrypoints.forEach(entrypoint => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const commands = require(entrypoint);
            for (const k in commands) {
                if (!commands.hasOwnProperty(k))
                    continue;
                const cmd = commands[k];
                config.commands[k] = commands[k](helpers_1.simpleClone(pargs), config, cli);
            }
        }
        catch (ex) {
            log_1.catchError(ex);
            log_1.log.alert(`Failed to extend commands using path "${config.entrypoint}".`);
            process.exit(1);
        }
    });
    return config;
}
exports.externalCommands = externalCommands;
/**
 * Reads scopes recursing up building project configuration.
 *
 * @param defaults default values for the configuration.
 */
async function load(defaults) {
    let { data: config } = await helpers_1.promise(readRoot());
    if (!config)
        return { ...defaults };
    config = helpers_1.merge(true, { ...defaults }, config);
    // Ensure scopes.
    if (!config.workspaces || !config.workspaces.length)
        config.workspaces = [...defaults.workspaces];
    // Change dir so we read scopes from top level down.
    const cwd = process.cwd();
    process.chdir(config.directory);
    const { data: scopes } = await helpers_1.promise(readScopes(config.workspaces));
    process.chdir(cwd);
    if (scopes && scopes.length) {
        config.scopes = scopes.reduce((obj, pkg) => {
            obj[pkg.name] = pkg;
            return obj;
        }, {});
    }
    else {
        config.scopes = {};
    }
    if (!config.command)
        config.command = helpers_1.pkgmgr;
    return config;
}
exports.load = load;
//# sourceMappingURL=config.js.map