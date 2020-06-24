import { FilterChunk } from '../types';
import { Transform, TransformOptions } from 'readable-stream';
import strip from 'strip-ansi';
import wrapansi from 'wrap-ansi';

export type TransformOptionsExt = TransformOptions & { maxPrefix?: number, maxLine?: number; };

/**
 * Gets the max length of an array of string.
 * 
 * @param vals the values to calculate length for.
 */
export function maxLength(vals: string[]) {
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
export function padRight(str: string, max: number = 13) {
  const stripped = strip(str);
  if (stripped.length < max)
    return str + ' '.repeat(max - stripped.length);
  return str;
}

export function createTransform(prefix: string, filters: FilterChunk[], options?: TransformOptionsExt): Transform;

export function createTransform(prefix: string, filter: FilterChunk, options?: TransformOptionsExt): Transform;

export function createTransform(prefix: string, options?: TransformOptionsExt): Transform;

export function createTransform(prefix: string, filters: FilterChunk | FilterChunk[] | TransformOptions, options?: TransformOptionsExt) {

  if (!Array.isArray(filters)) {
    options = filters as TransformOptionsExt;
    filters = undefined;
  }

  if (filters && !Array.isArray(filters))
    filters = [filters as FilterChunk];

  prefix = prefix || '';
  options = options || {};

  // Set a sane value if nothing is set. 
  options.maxPrefix = typeof options.maxPrefix !== 'undefined' ? options.maxPrefix : 16;
  options.maxLine = options.maxLine || 90;
  options.encoding = options.encoding || 'utf8';

  const stream = new Transform(options);
  const { maxLine, maxPrefix } = options;
  prefix = padRight(prefix, maxPrefix);
  const prefixLen = strip(prefix).length;
  const padStr = ' '.repeat(prefixLen);

  const wrap = (str: string) => {
    return wrapansi(str, maxLine - prefixLen)
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

};

