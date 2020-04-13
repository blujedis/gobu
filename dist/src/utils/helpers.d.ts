/// <reference types="node" />
import cs from 'cross-spawn';
import { IMap, IScope, ICommand, ICommandItem } from '../types';
/**
 * Alias for process.cwd().
 */
export declare const cwd: string;
/**
 * Cross spawn instance.
 */
export declare const spawn: typeof cs;
/**
 * Cross spawn sync instance.
 */
export declare const spawnSync: typeof import("child_process").spawnSync;
/**
 * Checks if "yarn" is available.
 */
export declare const isYarn: any;
/**
 * Gets the current package manager.
 */
export declare const pkgmgr: string;
/**
 * Checks if a directory path is a known package directory.
 *
 * @param compare array of known package paths.
 * @param dir the directory path to inspect if is known.
 */
export declare function isScope(compare: string[], dir?: string): string;
/**
 * Checks if a directory path is a known package directory.
 *
 * @param compare a known package path.
 * @param dir the directory path to inspect if is known.
 */
export declare function isScope(compare: string, dir?: string): string;
/**
 * Gets scope by matching key and value.
 *
 * @param key the key in the scope to match against.
 * @param val the value of the key to use to compare.
 * @param map object containing values.
 */
export declare function getValueByKey<T>(key: keyof T, val: string, map: IMap<any>): T;
/**
 * Gets scope by matching directory.
 *
 * @param dir the directory to use to match loaded scope.
 * @param scopes object containing loaded scopes.
 */
export declare function getScopeByDir(dir: string, scopes: IMap<IScope>): IScope;
/**
 * Gets scope by matching directory.
 *
 * @param dirs the directories to use to match loaded scope.
 * @param scopes object containing loaded scopes.
 */
export declare function getScopesByDir(dirs: string[], scopes: IMap<IScope>): IScope[];
/**
 * Gets scope from collection by name.
 *
 * @param name the scope name to be found.
 * @param scopes the object collection of scopes.
 */
export declare function getScopeByName(name: string, scopes: IMap<IScope>): IScope;
/**
 * Gets scopes filtering by name.
 *
 * @param names the names to compare for filtering scopes.
 * @param scopes the scopes collection.
 */
export declare function getScopesByName(names: string[], scopes: IMap<IScope>): IScope[];
/**
 * Gets scripts for the provided scope.
 *
 * @param dir the path to compare to known package paths.
 * @param scopes the loaded scopes.
 */
export declare function getScriptsByDir(dir: string, scopes: IMap<IScope>): IMap<string>;
/**
 * Normalizes scopes to array ensuring correct format.
 *
 * @param scopes the scope or array of scopes passed from command.
 */
export declare function normalizeScopes(scopes?: string | string[]): string[];
/**
 * Wraps Promise returning object containing resulting data and/or Error.
 *
 * @param prom the Promise to be wrapped.
 */
export declare function promise<T>(prom: Promise<T>): Promise<{
    err: Error;
    data: T;
}>;
/**
 * Simple usings JSON to clone a simple object.
 *
 * @param obj the object to be cloned
 */
export declare function simpleClone<T extends object>(obj: T): any;
/**
 * Merges object literals.
 *
 * @param defaults when true respects defaults.
 * @param target the target object to merge to.
 * @param sources the source objects to merge from.
 */
export declare function merge<T extends object, S extends object>(defaults: boolean, target: T, ...sources: T[]): T;
/**
 * Merges object literals.
 *
 * @param defaults when true respects defaults.
 * @param target the target object to merge to.
 * @param sources the source objects to merge from.
 */
export declare function merge<T extends object, S extends object>(target: T, ...sources: T[]): T;
/**
 * Parses argv and command line tokens.
 */
export declare function parseArgv(): import("kawkah-parser").IKawkahParserResult;
/**
 * Simple template format, uses "g" RegExp flag to
 * replace all instances found.
 *
 * @param template the template to be formatted.
 * @param map the map containing key values to replace
 */
export declare function formatTemplate(template: string, map: IMap<string>): string;
/**
 * Builds simple string for help menu.
 *
 * @param obj object of commands or array of options to build menu for.
 * @param name name to replace in strings.
 * @param tabs the number of tabs after key name.
 */
export declare function buildMenu(obj: IMap<ICommand> | ICommand[] | ICommandItem[], name?: string, tabs?: number): string;
/**
 * Formats example menu items replacing {{name}} with provided value.
 *
 * @param examples array of examples for help menu.
 * @param name the name to replace {{name}} with.
 */
export declare function buildExample(examples: string[], name?: string): string;
/**
 * Reduces nested command key to single array.
 *
 * @param obj object containing commands.
 * @param key the nested array key to reduce.
 */
export declare function combineMenuItem<T>(obj: IMap<ICommand>, key: keyof ICommand, filter?: string[]): T[];
/**
 * Gets number within range.
 *
 * @param min the minimum number
 * @param max the maximum number
 * @param exclude numbers to exclude.
 */
export declare function randomNumber(min: any, max: any, exclude?: number[]): any;
