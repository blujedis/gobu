import { FilterChunk } from '../types';
import { Transform, TransformOptions } from 'readable-stream';
export declare type TransformOptionsExt = TransformOptions & {
    maxPrefix?: number;
    maxLine?: number;
};
/**
 * Gets the max length of an array of string.
 *
 * @param vals the values to calculate length for.
 */
export declare function maxLength(vals: string[]): number;
/**
 * Pads string to right for alignment.
 *
 * @param str the string to be padded.
 * @param max the max string length of longest item.
 */
export declare function padRight(str: string, max?: number): string;
export declare function createTransform(prefix: string, filters: FilterChunk[], options?: TransformOptionsExt): Transform;
export declare function createTransform(prefix: string, filter: FilterChunk, options?: TransformOptionsExt): Transform;
export declare function createTransform(prefix: string, options?: TransformOptionsExt): Transform;
