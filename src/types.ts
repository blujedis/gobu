
import { IKawkahParserResult } from 'kawkah-parser';
import { StylesType } from 'ansi-colors';
import { ChildProcess, SpawnSyncReturns, SpawnSyncOptions, SpawnOptions } from 'child_process';
import { Logger, LogMethods } from 'kricket';

export type Command = (pargs?: IKawkahParserResult, config?: IConfig, cli?: ICli) => ICommand;

export type Passthrough = (pargs?: IKawkahParserResult, config?: IConfig) => void;

export type Help = (pargs?: IKawkahParserResult, config?: IConfig, commands?: IMap<ICommand>, isRoot?: boolean) => string;

export type FilterChunk = RegExp | ((chunk: string) => string);

export type Styles = keyof StylesType<any> | keyof StylesType<any>[];

export interface IMap<T> {
  [key: string]: T;
}

export interface ICommandItem {
  name: string;
  alias?: string | string[];
  description?: string;
  params?: string;
}

export interface ICommand extends ICommandItem {
  options?: ICommandItem[];
  examples?: string[];
  help?: string;
  menu?: boolean;
  action: () => void;
}

export interface IPackage {

  /**
   * Name of the package.
   */
  name: string;

  /**
   * Description of the package.
   */
  description?: string;

  /**
   * Version of the package.
   */
  version?: string;

  /**
   * Scripts from package.json.
   */
  scripts: IMap<string>;

  /**
   * Package.json dependencies.
   */
  dependencies: IMap<string>;

  /**
   * Package.json development dependencies.
   */
  devDependencies: IMap<string>;

  /**
   * Package.json peer dependencies.
   */
  peerDependencies: IMap<string>;

  /**
   * Package.json optional dependencies.
   */
  optionalDependencies: IMap<string>;

  /**
   * Gobu configuration object.
   */
  gobu?: IConfigBase;

}

export interface IScope extends Omit<IPackage, 'gobu'> {

  /**
   * The directory where the scope resides.
   */
  directory?: string;

  /**
   * The path to package.json
   */
  path?: string;

  /**
   * Entrypoint where commands should be required and extended from.
   */
  entrypoint?: string;

  /**
   * The color to use in logs when running async.
   */
  color?: Styles;

  /**
   * Packages that should NOT be hoisted to the root supports globs.
   */
  nohoist?: string[];

}

export interface IConfigBase {

  /**
   * Then name of the repo.
   */
  name: string;

  /**
   * The command name to use (default: gobu)
   */
  command?: string;

  /**
   * Array of globs where workspace/packages reside.
   */
  workspaces?: string[];


  /**
   * Entrypoint where commands should be required and extended from.
   */
  entrypoint?: string;

  /**
   * Packages that should NOT be hoisted to the root supports globs.
   */
  nohoist?: string[];

}

export interface IConfig extends IConfigBase, Omit<IScope, 'hoist'> {

  /**
   * Map of loaded scopes.
   */
  scopes?: IMap<IScope>;

  /**
   * Map of all commands both internal and extended from repo.
   */
  commands?: IMap<ICommand>;

  /**
   * Indicates if is external config.
   */
  isExternal?: boolean;

  /**
   * The package manager to be used for fallback installations etc.
   * pnpm will be supported in next minor version.
   */
  readonly packageManager?: 'yarn' | 'npm' | null;

}

export type RunnerResult<T> = T & { directory: string; };

export interface IRunner {

  runScope(spargs: string[], scopes: string[], options?: SpawnOptions): RunnerResult<ChildProcess>[];

  runScope(spargs: string[], scope: string, options?: SpawnOptions): RunnerResult<ChildProcess>[];

  runScope(spargs: string[], options?: SpawnOptions): ChildProcess;

  runScopeSync(spargs: string[], scopes: string[], options?: SpawnSyncOptions): RunnerResult<SpawnSyncReturns<Buffer>>[];

  runScopeSync(spargs: string[], scope: string, options?: SpawnSyncOptions): RunnerResult<SpawnSyncReturns<Buffer>>[];

  runScopeSync(spargs: string[], options?: SpawnSyncOptions): SpawnSyncReturns<Buffer>;

  runCmd(cmd: string, args: any[], options: SpawnSyncOptions, sync: boolean): SpawnSyncReturns<Buffer>;

  runCmd(cmd: string, args: any[], sync: boolean): SpawnSyncReturns<Buffer>;

  runCmd(cmd: string, args: any[], options?: SpawnOptions): ChildProcess;

}

type Level = "fatal" | "error" | "warn" | "info" | "debug" | "alert" | "caution" | "notice" | "success";

export interface ICli {

  /**
   * Parsed arguments from the command line.
   */
  pargs: IKawkahParserResult;

  /**
   * Current loaded configuration.
   */
  config: IConfig;

  /**
   * Runs spawn and spawnSync.
   */
  runner: IRunner;

  /**
   * Built in logger.
   */
  log: Logger<Level> & LogMethods<Logger<Level>, Level>;


  /**
   * Helpers for building simple menus.
   */
  menu: {

    /**
     * Builds simple string for help menu.
     * 
     * @param obj object of commands or array of options to build menu for.
     * @param tabs the number of tabs after key name.
     */
    buildCommands(obj: IMap<ICommand> | ICommand[] | ICommandItem[], name?: string, tabs?: number): string;

    /**
     * Builds simple string for help menu.
     * 
     * @param obj object of commands or array of options to build menu for.
     * @param tabs the number of tabs after key name.
     */
    buildOptions(obj: IMap<ICommand> | ICommand[] | ICommandItem[], name?: string, tabs?: number): string;


    /**
     * Formats example menu items replacing {{name}} with provided value.
     * 
     * @param examples array of examples for help menu.
     * @param name the name to replace {{name}} with.
     */
    buildExamples(examples: string[], name?: string): string;

    /**
     * Combines a nested command key into single array.
     * 
     * @param obj object containing commands.
     * @param key the nested array key to reduce.
     * @param filter array of commands to filter.
     */
    combineItems<T>(obj: IMap<ICommand>, key: keyof ICommand, filter?: string[]): T[];


  };

}
