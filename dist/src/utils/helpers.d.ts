/**
 * Alias for process.cwd().
 */
export declare const root: string;
/**
 * Checks if "yarn" is available.
 */
export declare const isYarn: any;
/**
 * Gets the current package manager.
 */
export declare const pkgmgr: string;
/**
 * Wraps Promise returning object containing resulting data and/or Error.
 *
 * @param prom the Promise to be wrapped.
 */
export declare function promise<T>(prom: Promise<T>): Promise<{
    err: any;
    data: T;
} | {
    err: any;
    data: T;
}>;
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
