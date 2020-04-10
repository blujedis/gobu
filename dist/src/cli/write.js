"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_colors_1 = __importDefault(require("ansi-colors"));
function padRight(val, max) {
    if (val.length < 13)
        return ' '.repeat(13 - val.length);
    return '';
}
exports.padRight = padRight;
function wrap(val, max) {
    if (val.length < 90)
        return val;
    function recurse(v, lines = []) {
        lines.push(v.slice(0, 90));
        const rem = v.slice(max);
        if (rem.length < 90) {
            lines.push(rem);
            return lines.join('\n');
        }
        return recurse(rem, lines).join('\n');
    }
    return recurse(val);
}
exports.wrap = wrap;
function write(type, color, filters) {
    return (chunk) => {
        chunk = (chunk.toString() || '')
            .replace(/\\n$/, '');
        if (!chunk || !chunk.length)
            return;
        chunk = chunk.split('\n')
            .reduce((a, c) => {
            if (!c || !c.length || c === '')
                return a;
            // Need to debug this to pretty it up.
            // if (c.length > maxLine)
            //   c = wrap(c);
            c = ansi_colors_1.default[color](type) + padRight(type) + ' ' + c;
            return [...a, c];
        }, [])
            .join('\n');
        if (filters.some(v => v.test(chunk)))
            return;
        process.stdout.write(chunk + '\n');
    };
}
exports.write = write;
//# sourceMappingURL=write.js.map