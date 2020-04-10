/**
 * Reads file.
 *
 * @param path the path to the file to read.
 * @param asJSON returns/reads as JSON object.
 */
export declare function read<T>(path: string, asJSON: true): Promise<T>;
/**
 * Reads file.
 *
 * @param path the path to the file to read.
 */
export declare function read(path: string): Promise<string>;
/**
 * Writes a file to path.
 *
 * @param path the path to the file to read.
 * @param data the data to be written.
 * @param asJSON when true object is written as JSON.
 */
export declare function write(path: string, data: any, asJSON?: true): Promise<boolean>;
/**
 * Writes a file to path.
 *
 * @param path the path to the file to read.
 * @param data the data to be written.
 */
export declare function write(path: string, data: any): Promise<boolean>;
