import { IConfig, IScope, ICli } from '../types';
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
export declare function readScopes(globs: string[]): Promise<IScope[]>;
/**
 * Reads scopes recursing up building project configuration.
 *
 * @param defaults default values for the configuration.
 */
export declare function load(defaults?: Partial<IConfig>): Promise<IConfig>;
/**
 * Imports commands for root or child scopes.
 *
 * @param config the current loaded config.
 * @param pargs parsed result to pass to command init.
 * @param cli the cli object to pass to command init.
 */
export declare function extendCommands(config: IConfig, pargs: IKawkahParserResult, cli: ICli): IConfig;
