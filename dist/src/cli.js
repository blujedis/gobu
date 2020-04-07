"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const config_1 = require("./config");
(async function init() {
    const config = await config_1.load();
    if (!config) {
        utils_1.log.alert(`Failed to lookup config "gobu" in package.json or config "gobu.json".`);
        return;
    }
})();
//# sourceMappingURL=cli.js.map