"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const CWD_NAME = path_1.parse(process.cwd()).name;
exports.BASE_DEFAULTS = {
    name: CWD_NAME,
    command: 'gobu',
    workspaces: ['./packages/*'],
    packageManager: undefined,
    entrypoint: undefined
};
exports.CONFIG_DEFAULTS = {
    name: CWD_NAME,
    command: 'gobu',
    workspaces: ['./packages/*'],
    packageManager: undefined,
    entrypoint: undefined,
    scopes: {},
    commands: {},
    scripts: {},
    dependencies: {},
    devDependencies: {},
    peerDependencies: {},
    optionalDependencies: {}
};
/**
 * Allowed keys in package.json "gobu" property
 * for child scope/package.
 */
exports.CHILD_KEYS = ['color', 'entrypoint'];
/**
 * Base ansi colors.
 */
exports.BASE_COLORS = ['yellowBright', 'cyanBright', 'blueBright', 'greenBright', 'magentaBright'];
//# sourceMappingURL=contstants.js.map