"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG_DEFAULTS = {
    name: 'Gobu',
    workspaces: ['./packages/*'],
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