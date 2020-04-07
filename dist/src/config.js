"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
async function load(key = 'gobu') {
    let config = await utils_1.readConfig(utils_1.root);
    if (config)
        return config;
    config = await utils_1.readPkg(utils_1.root);
    return config[key] || null;
}
exports.load = load;
//# sourceMappingURL=config.js.map