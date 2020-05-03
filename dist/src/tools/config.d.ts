import { IConfig, IMap, IScope, ICli } from '../types';
import { IKawkahParserResult } from 'kawkah-parser';
/**
 * Reads looking for root Gobu configuration.
 */
export declare function readRoot(): Promise<IConfig>;
/**
 * Reads package.json
 *
 * @param filename the path of the package to be found.
 */
export declare function readPackage(filename: string): Promise<unknown>;
/**
 * Reads child workspaces or scopes using glob pattern matching.
 *
 * @param globs the globs of paths representing scoped workspaces.
 */
export declare function readScopes(globs?: string[]): Promise<IScope[]>;
/**
 * Imports commands for root or child scopes.
 *
 * @param config the current loaded config.
 * @param pargs parsed result to pass to command init.
 * @param cli the cli object to pass to command init.
 */
export declare function externalCommands(config: IConfig, pargs: IKawkahParserResult, cli: ICli): IConfig;
/**
 * Reads scopes recursing up building project configuration.
 *
 * @param defaults default values for the configuration.
 */
export declare function load(defaults?: Partial<IConfig>): Promise<{
    scopes?: IMap<IScope>;
    commands?: IMap<import("../types").ICommand>;
    isExternal?: boolean;
    packageManager?: "yarn" | "npm";
    name?: string;
    command?: string;
    workspaces?: string[];
    entrypoint?: string;
    nohoist?: string[];
    description?: string;
    version?: string;
    scripts?: IMap<string>;
    dependencies?: IMap<string>;
    devDependencies?: IMap<string>;
    peerDependencies?: IMap<string>;
    optionalDependencies?: IMap<string>;
    directory?: string;
    path?: string;
    color?: import("../types").Styles;
}>;
