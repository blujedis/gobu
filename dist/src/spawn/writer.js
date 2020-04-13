"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
/**
 * Pads string to right for alignment.
 *
 * @param str the string to be padded.
 * @param max the max string length of longest item.
 */
function padRight(str, max = 13) {
    if (str.length < max)
        return ' '.repeat(max - str.length);
    return '';
}
/**
 * Wraps a string limiting line length.
 *
 * @param str the string to be wrapped.
 * @param max the max line length.
 */
function wrap(str, max = 90) {
    if (str.length < max)
        return str;
    function recurse(v, lines = []) {
        lines.push(v.slice(0, max));
        const rem = v.slice(max);
        if (rem.length < max) {
            lines.push(rem);
            return lines.join('\n');
        }
        return recurse(rem, lines).join('\n');
    }
    return recurse(str);
}
function write(name, transform, filters = [], labels = []) {
    if (Array.isArray(transform)) {
        if (typeof transform[0] === 'string')
            labels = transform;
        else
            filters = transform;
        transform = undefined;
    }
    if (typeof filters[0] === 'string') {
        labels = filters;
        filters = undefined;
    }
    transform = transform || ((v) => v);
    filters = filters || [];
    labels = labels || [];
    const padLen = labels.length ? maxLength(labels) : 0;
    return (chunk) => {
        // Remove trailing line return.
        chunk = (chunk.toString() || '')
            .replace(/\\n$/, '');
        // Check if is filtered before formatting.
        const filtered = filters.some(v => {
            if (v instanceof RegExp)
                return v.test(chunk);
            return v(chunk);
        });
        // Remove empty lines.
        if (!chunk || !chunk.length || filtered)
            return;
        // Split rows and format, wrap if too long.
        chunk = chunk.split('\n')
            .reduce((a, c) => {
            // Empty line ignore.
            if (!c || !c.length || c === '')
                return a;
            // Need to debug this to pretty it up.
            // if (c.length > maxLine)
            //   c = wrap(c);
            const suffix = padRight(name, padLen) + ' ' + c;
            c = transform(name) + suffix;
            return [...a, c];
        }, [])
            .join('\n');
        process.stderr.write(chunk + '\n');
    };
}
exports.writer = {
    maxLength,
    padRight,
    wrap,
    write
};
//# sourceMappingURL=writer.js.map