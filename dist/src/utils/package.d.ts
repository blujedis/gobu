export declare function readConfig<T = any>(dir?: string, filename?: string): Promise<any>;
/**
 * Reads a package.json file by passing it's directory.
 *
 * @param dir the package directory.
 */
export declare function readPkg<T = any>(dir?: string): Promise<T>;
/**
 * Writes a package.json file.
 *
 * @param data the object to be written.
 * @param dir the directory to write to.
 */
export declare function writePkg<T extends object>(data: string | T, dir?: string): Promise<boolean>;
/**
 * Reads packages by directory roots.
 *
 * @param dirs the directories of packages to be read.
 */
export declare function readPkgs(dirs: string[]): Promise<any[]>;
/**
 * Reads "scripts" keys by passing package directory roots.
 *
 * @param dirs package directories to load scripts from.
 */
export declare function readScripts(dirs: string[]): Promise<{
    scope: any;
    scripts: any;
}[]>;
