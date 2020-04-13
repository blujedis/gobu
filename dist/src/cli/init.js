"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const tools_1 = require("../tools");
const path_1 = require("path");
const fs_1 = require("fs");
const contstants_1 = require("../contstants");
const enable = (pargs, config) => {
    // const isRoot = isScope(config.directory);
    async function action() {
        const gobuPath = path_1.join(process.cwd(), 'gobu.json');
        // Package.json exists.
        if (config.directory || pargs.internal) {
            if (!pargs.internal) {
                // Read the package.
                const { err: rerr, data: rdata } = await utils_1.promise(tools_1.read(config.directory, true));
                if (rerr)
                    return utils_1.catchError(rerr);
                // Write back with defaults.
                const { err: serr } = await utils_1.promise(tools_1.write(config.directory, { ...contstants_1.CONFIG_DEFAULTS, ...rdata.gobu }, true));
                if (serr)
                    return utils_1.catchError(serr);
                utils_1.log.success(`Project enabled at "package.json"`);
            }
        }
        else {
            // Gobu path already exists.
            if (fs_1.existsSync(gobuPath))
                return utils_1.log.alert(`Cannot enable project config, the path "gobu.json" already exists.`);
            const { err: gerr } = await utils_1.promise(tools_1.write(gobuPath, contstants_1.CONFIG_DEFAULTS, true));
            if (gerr)
                return utils_1.catchError(gerr);
            utils_1.log.success('Project enabled at "gobu.json".');
        }
    }
    return {
        name: 'enable',
        description: 'enables project for use with Gobu.',
        alias: 'boot',
        action,
        options: [
            {
                name: '--internal',
                description: 'use package instead of gobu.json',
                alias: []
            }
        ],
        examples: [
            '{{name}} enable'
        ]
    };
};
exports.default = enable;
//# sourceMappingURL=init.js.map