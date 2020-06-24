"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const exceptionHandler = (err) => {
    utils_1.log.fatal(err.stack);
};
function enableExceptions(handler = exceptionHandler) {
    process.on('uncaughtException', handler);
    process.on('unhandledRejection', handler);
    // Disable handler.
    return () => {
        process.removeListener('uncaughtException', handler);
        process.removeListener('unhandledRejection', handler);
    };
}
exports.enableExceptions = enableExceptions;
exports.default = enableExceptions;
//# sourceMappingURL=uncaught.js.map