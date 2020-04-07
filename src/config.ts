import { root, readPkg, readConfig } from './utils';

export async function load(key: string = 'gobu') {
  let config = await readConfig(root);
  if (config)
    return config;
  config = await readPkg(root);
  return config[key] || null;
}