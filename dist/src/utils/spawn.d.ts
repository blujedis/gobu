/// <reference types="node" />
import cs from 'cross-spawn';
declare const spawn: typeof cs;
declare const spawnSync: typeof import("child_process").spawnSync;
export { spawn, spawnSync };
