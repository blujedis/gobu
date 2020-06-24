"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readable_stream_1 = require("readable-stream");
const strip_ansi_1 = __importDefault(require("strip-ansi"));
const wrap_ansi_1 = __importDefault(require("wrap-ansi"));
/**
 * Gets the max length of an array of string.
 *
 * @param vals the values to calculate length for.
 */
function maxLength(vals) {
    return vals.reduce((a, c) => {
        c = c || '';
        if (c.length > a)
            return c.length;
        return a;
    }, 0);
}
exports.maxLength = maxLength;
/**
 * Pads string to right for alignment.
 *
 * @param str the string to be padded.
 * @param max the max string length of longest item.
 */
function padRight(str, max = 13) {
    const stripped = strip_ansi_1.default(str);
    if (stripped.length < max)
        return str + ' '.repeat(max - stripped.length);
    return str;
}
exports.padRight = padRight;
function createTransform(prefix, filters, options) {
    if (!Array.isArray(filters)) {
        options = filters;
        filters = undefined;
    }
    if (filters && !Array.isArray(filters))
        filters = [filters];
    prefix = prefix || '';
    options = options || {};
    // Set a sane value if nothing is set. 
    options.maxPrefix = typeof options.maxPrefix !== 'undefined' ? options.maxPrefix : 16;
    options.maxLine = options.maxLine || 90;
    options.encoding = options.encoding || 'utf8';
    const stream = new readable_stream_1.Transform(options);
    const { maxLine, maxPrefix } = options;
    prefix = padRight(prefix, maxPrefix);
    const prefixLen = strip_ansi_1.default(prefix).length;
    const padStr = ' '.repeat(prefixLen);
    const wrap = (str) => {
        return wrap_ansi_1.default(str, maxLine - prefixLen)
            .split('\n')
            .map((line, i) => {
            if (i === 0)
                return prefix + line;
            return padStr + line;
        }).join('\n');
    };
    const parseChunk = (chunk) => {
        return chunk.split('\n')
            .reduce((a, c) => {
            // Empty line ignore.
            if (!c || !c.length || c === '')
                return a;
            // If too long wrap the line.
            c = wrap(c);
            return [...a, c];
        }, []).join('\n');
    };
    stream._transform = (chunk, encoding, done) => {
        chunk = (encoding === 'utf8' ? chunk : chunk.toString());
        done(null, parseChunk(chunk) + '\n');
    };
    return stream;
}
exports.createTransform = createTransform;
;
//# sourceMappingURL=writer.js.map