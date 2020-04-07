"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kricket_1 = require("kricket");
const util_1 = require("util");
const ansi_colors_1 = require("ansi-colors");
const log_symbols_1 = require("log-symbols");
const styles = {
    fatal: ansi_colors_1.bgRedBright,
    error: ansi_colors_1.redBright,
    warn: ansi_colors_1.yellowBright,
    info: ansi_colors_1.blueBright,
    debug: ansi_colors_1.magentaBright
};
const symbols = {
    alert: log_symbols_1.error,
    caution: log_symbols_1.warning,
    notice: log_symbols_1.info,
    success: log_symbols_1.success
};
const colorize = (key, val, template = '{{key}}:') => styles[key](template.replace('{{key}}', key)) + ' ' + val;
const symbolize = (key, val, prepend = true) => prepend ? symbols[key] + ' ' + val : val + ' ' + symbols[key];
const log = kricket_1.createLogger('logger', {
    levels: ['fatal', 'error', 'warn', 'info', 'debug', 'alert', 'caution', 'notice', 'success'],
    transports: [
        new kricket_1.ConsoleTransport()
    ]
});
exports.log = log;
log.transform((payload) => {
    payload.message = util_1.format(payload.message, ...payload[kricket_1.SPLAT]);
    if (['fatal', 'error', 'warn', 'info', 'debug'].includes(payload[kricket_1.LEVEL]))
        payload.message = colorize(payload[kricket_1.LEVEL], payload.message);
    if (['alert', 'caution', 'notice', 'success'].includes(payload[kricket_1.LEVEL]))
        payload.message = symbolize(payload[kricket_1.LEVEL], payload.message);
    return payload;
});
//# sourceMappingURL=log.js.map