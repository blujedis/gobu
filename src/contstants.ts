import { IConfig } from "./types";

export const CONFIG_DEFAULTS: IConfig = {
  name: 'Gobu',
  workspaces: ['./packages/*'],
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

