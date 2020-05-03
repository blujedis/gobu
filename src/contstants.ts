import { IConfig, IConfigBase } from './types';
import { parse } from 'path';

const CWD_NAME = parse(process.cwd()).name;

export const BASE_DEFAULTS: IConfigBase = {
  name: CWD_NAME,
  command: 'gobu',
  workspaces: ['./packages/*'],
  entrypoint: undefined
};

export const CONFIG_DEFAULTS: IConfig = {
  name: CWD_NAME,
  command: 'gobu',
  workspaces: ['./packages/*'],
  entrypoint: undefined,
  scopes: {},
  commands: {},
  scripts: {},
  dependencies: {},
  devDependencies: {},
  peerDependencies: {},
  optionalDependencies: {}
};

/**
 * Allowed keys in package.json "gobu" property
 * for child scope/package.
 */
export const CHILD_KEYS = ['color', 'entrypoint'];

/**
 * Base ansi colors.
 */
export const BASE_COLORS = ['yellowBright', 'cyanBright', 'blueBright', 'greenBright', 'magentaBright'];

