
import { IKawkahParserResult } from 'kawkah-parser';
import { StylesType } from 'ansi-colors';
import { log } from './utils';
import { ChildProcess, SpawnSyncReturns, SpawnSyncOptions, SpawnOptions } from 'child_process';
import { Logger, LogMethod, LogMethods } from 'kricket';

export type Command = (pargs?: IKawkahParserResult, config?: IConfig, cli?: ICli) => ICommand;

export type Passthrough = (pargs?: IKawkahParserResult, config?: IConfig) => void;

export type Help = (pargs?: IKawkahParserResult, config?: IConfig) => string;

export type Filter = RegExp | ((str: string) => boolean);

export type Transform = (val: string) => string;

export type Styles = keyof StylesType<any> | keyof StylesType<any>[];

export interface IMap<T> {
  [key: string]: T;
}

export interface IPackage {
  name?: string;
  description?: string;
  version?: string;
  scripts?: IMap<string>;
  dependencies?: IMap<string>;
  devDependencies?: IMap<string>;
  peerDependencies?: IMap<string>;
  optionalDependencies?: IMap<string>;
  gobu?: IConfig;
}

export interface IScope {
  name: string;
  version: string;
  description: string;
  scripts: IMap<string>;
  dependencies: IMap<string>;
  devDependencies: IMap<string>;
  optionalDependencies: IMap<string>;
  peerDependencies: IMap<string>;
  path: string;
  directory: string;
  color?: Styles;
  entrypoint?: string;
}

export interface ICommandItem {
  name: string;
  alias?: string | string[];
  description?: string;
}

export interface ICommand extends ICommandItem {
  options?: ICommandItem[];
  examples?: string[];
  help?: string;
  menu?: boolean;
  action: () => void;
}

export interface IConfig {
  name: string;
  command?: string;
  description?: string;
  version?: string;
  scripts: IMap<string>;
  dependencies: IMap<string>;
  devDependencies: IMap<string>;
  optionalDependencies: IMap<string>;
  peerDependencies: IMap<string>;
  path?: string;
  isExternal?: boolean;
  directory?: string;
  package?: IPackage;
  workspaces?: string[];
  scopes?: IMap<IScope>;
  entrypoint?: string;
  commands?: IMap<ICommand>;
}

export interface IWriter {

  /**
   * Gets the max length of an array of string.
   * 
   * @param vals the values to calculate length for.
   */
  maxLength(vals: string[]): number;

  /**
   * Pads string to right for alignment.
   * 
   * @param str the string to be padded.
   * @param max the max string length of longest item.
   */
  padRight(str: string, max?: number): string

  /**
   * Wraps a string limiting line length.
   * 
   * @param str the string to be wrapped.
   * @param max the max line length.  
   */
  wrap(str: string, max?: number): string;

  /**
   * Writes/outputs to stdout.
   * 
   * @param name the name of the scope/project running.
   * @param transform optional ansi-color.
   * @param filters array of expressions or functions used to filter.
   * @param labels all possible prefix labels used for padding.
   */
  write(name: string, transform: Transform, filters: Filter[], labels?: string[]): (chunk: string) => void;

  /**
   * Writes/outputs to stdout.
   * 
   * @param name the name of the scope/project running.
   * @param transform optional ansi-color.
   * @param labels all possible prefix labels used for padding.
   */
  write(name: string, transform: Transform, filters: Filter[], labels?: string[]): (chunk: string) => void;

  /**
   * Writes/outputs to stdout.
   * 
   * @param name the name of the scope/project running.
   * @param filters array of expressions or functions used to filter.
   * @param labels all possible prefix labels used for padding.
   */
  write(name: string, filters: Filter[], labels?: string[]): (chunk: string) => void;

  /**
   * Writes/outputs to stdout.
   * 
   * @param name the name of the scope/project running.
   * @param labels all possible prefix labels used for padding.
   */
  write(name: string, labels?: string[]): (chunk: string) => void;

}

export type RunnerResult<T> = T & { directory: string };

export interface IRunner {

  run(spargs: string[], scopes: string[], options?: SpawnOptions): RunnerResult<ChildProcess>[];

  run(spargs: string[], options?: SpawnOptions): ChildProcess;

  runSync(spargs: string[], scopes: string[], options?: SpawnSyncOptions): RunnerResult<SpawnSyncReturns<Buffer>>[];

  runSync(spargs: string[], options?: SpawnSyncOptions): SpawnSyncReturns<Buffer>;

  runSpawn(cmd: string, args: any[], options: SpawnSyncOptions, sync: boolean): SpawnSyncReturns<Buffer>;

  runSpawn(cmd: string, args: any[], sync: boolean): SpawnSyncReturns<Buffer>;

  runSpawn(cmd: string, args: any[], options?: SpawnOptions): ChildProcess;

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
   * The name of the package manager.
   * either 'npm' or 'yarn'.
   */
  pkgmgr: string;

  /**
   * Runs spawn and spawnSync.
   */
  runner: IRunner;

  /**
   * Helper for writing out to terminal.
   */
  writer: IWriter;


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
    buildCommands(obj: IMap<ICommand> | ICommand[] | ICommandItem[], tabs?: number): string;

    /**
     * Builds simple string for help menu.
     * 
     * @param obj object of commands or array of options to build menu for.
     * @param tabs the number of tabs after key name.
     */
    buildOptions(obj: IMap<ICommand> | ICommand[] | ICommandItem[], tabs?: number): string;


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


  }




}
