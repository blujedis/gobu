"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const tools_1 = require("../tools");
const path_1 = require("path");
const fs_1 = require("fs");
const help_1 = __importDefault(require("./help"));
const contstants_1 = require("../contstants");
const enable = (pargs, config) => {
    // const isRoot = isScope(config.directory);
    const _help = help_1.default(utils_1.simpleClone(pargs), config);
    async function action() {
        const gobuPath = path_1.join(config.directory || process.cwd(), 'gobu.json');
        const pkgPath = path_1.join(config.directory || process.cwd(), 'package.json');
        let { data: pkgData } = await utils_1.promise(tools_1.read(pkgPath, true));
        // Package.json exists.
        if (pkgData || pargs.internal) {
            if (!pkgData && !(pargs.f || pargs.force)) {
                utils_1.log.caution(`Package.json NOT found enable config failed, try "${utils_1.pkgmgr} init".`);
                return;
            }
            const status = pkgData ? 'updated' : 'enabled';
            pkgData = pkgData || {};
            const mergedBase = { ...contstants_1.BASE_DEFAULTS, ...pkgData.gobu };
            const { name, command, workspaces, entrypoint, packageManager } = mergedBase;
            pkgData.gobu = { name, command, workspaces, entrypoint, packageManager };
            // Write back with defaults.
            const { err: serr } = await utils_1.promise(tools_1.write(path_1.join(config.directory || process.cwd(), 'package.json'), pkgData, true));
            if (serr)
                return utils_1.catchError(serr);
            utils_1.log.success(`Project ${status} at "package.json".`);
        }
        else {
            let current = {};
            let status = 'enabled';
            // Gobu path already exists.
            if (fs_1.existsSync(gobuPath)) {
                const { data } = await utils_1.promise(tools_1.read(gobuPath, true));
                if (data) {
                    current = data;
                    status = 'updated';
                }
            }
            const { err: gerr } = await utils_1.promise(tools_1.write(gobuPath, { ...contstants_1.BASE_DEFAULTS, ...current }, true));
            if (gerr)
                return utils_1.catchError(gerr);
            utils_1.log.success(`Project ${status} at "gobu.json".`);
        }
    }
    return {
        name: 'enable',
        description: 'enables project for use with {{name}}.',
        alias: ['en'],
        action,
        options: [
            {
                name: '--internal',
                description: 'use package instead of gobu.json',
                alias: []
            }
        ],
        examples: [],
        help: _help
    };
};
exports.default = enable;
//# sourceMappingURL=enable.js.map