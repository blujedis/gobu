import { readJSON, readFile, writeFile, writeJSON } from 'fs-extra';
import { promise } from './helpers';

/**
 * Reads file.
 * 
 * @param path the path to the file to read.
 * @param asJSON returns/reads as JSON object.
 */
export async function read<T>(path: string, asJSON: true): Promise<T>;

/**
 * Reads file.
 * 
 * @param path the path to the file to read.
 */
export async function read(path: string): Promise<string>;
export async function read<T>(path: string, asJSON?: true): Promise<T | string> {
  if (!asJSON) {
    const { data } = await promise(readFile(path));
    return ((data && data.toString()) || null) as string;
  }
  else {
    const { data } = await promise(readJSON(path));
    return (data || null) as T;
  }
}

/**
 * Writes a file to path.
 * 
 * @param path the path to the file to read.
 * @param data the data to be written.
 * @param asJSON when true object is written as JSON.
 */
export async function write(path: string, data: any, asJSON?: true): Promise<boolean>;

/**
 * Writes a file to path.
 * 
 * @param path the path to the file to read.
 * @param data the data to be written.
 */
export async function write(path: string, data: any): Promise<boolean>;
export async function write(path: string, data: any, asJSON?: true) {
  if (!asJSON) {
    const { err } = await promise(writeFile(path, data));
    if (err)
      return false;
  }
  else {
    const { err } = await promise(writeJSON(path, data));
    if (err)
      return false;
  }
  return true;
}

