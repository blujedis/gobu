import { pkgmgr, spawn, spawnSync } from '../utils/helpers';
import { IRunner, RunnerResult } from '../types';
import { SpawnSyncReturns, SpawnSyncOptions, SpawnOptions, ChildProcess } from 'child_process';

function runScope(spargs: string[], scopes: string[], options?: SpawnOptions): RunnerResult<ChildProcess>[];
function runScope(spargs: string[], scope: string, options?: SpawnOptions): RunnerResult<ChildProcess>[];
function runScope(spargs: string[], options?: SpawnOptions): ChildProcess;
function runScope(spargs: string[], scopes?: string | string[] | SpawnOptions, options?: SpawnOptions): ChildProcess | RunnerResult<ChildProcess>[] {

  if (!Array.isArray(scopes) && typeof scopes !== 'string') {
    options = scopes;
    scopes = undefined;
  }

  scopes = scopes || [];
  scopes = (!Array.isArray(scopes) ? [scopes] : scopes) as string[];
  options = options || {};

  if (!(scopes as string[]).length) {
    return spawn(pkgmgr, spargs, options);
  }
  else {
    const result: RunnerResult<ChildProcess>[] = [];
    for (const dir of scopes as string[]) {
      const opts = { ...options };
      opts.cwd = opts.cwd || dir;
      const child = spawn(pkgmgr, spargs, opts);
      (child as any).directory = dir;
      result.push(child as RunnerResult<ChildProcess>);
    }
    return result;
  }

}

function runScopeSync(spargs: string[], scopes: string[], options?: SpawnSyncOptions): RunnerResult<SpawnSyncReturns<Buffer>>[];
function runScopeSync(spargs: string[], scope: string, options?: SpawnSyncOptions): RunnerResult<SpawnSyncReturns<Buffer>>[];
function runScopeSync(spargs: string[], options?: SpawnSyncOptions): SpawnSyncReturns<Buffer>;
function runScopeSync(spargs: string[], scopes?: string | string[] | SpawnSyncOptions, options?: SpawnSyncOptions): SpawnSyncReturns<Buffer> | RunnerResult<SpawnSyncReturns<Buffer>>[] {

  if (!Array.isArray(scopes) && typeof scopes !== 'string') {
    options = scopes;
    scopes = undefined;
  }

  scopes = scopes || [];
  scopes = (!Array.isArray(scopes) ? [scopes] : scopes) as string[];
  options = options || {};


  if (!(scopes as string[]).length) {
    return spawnSync(pkgmgr, spargs, options);
  }
  else {
    const result: RunnerResult<SpawnSyncReturns<Buffer>>[] = [];
    for (const dir of scopes as string[]) {
      const opts = { ...options };
      opts.cwd = dir;
      const child = spawnSync(pkgmgr, spargs, opts);
      (child as any).directory = dir;
      result.push(child as RunnerResult<SpawnSyncReturns<Buffer>>);
    }
    return result;
  }


}

function runCmd(cmd: string, args: any[], options: SpawnSyncOptions, sync: boolean): SpawnSyncReturns<Buffer>;
function runCmd(cmd: string, args: any[], sync: boolean): SpawnSyncReturns<Buffer>;
function runCmd(cmd: string, args: any[], options?: SpawnOptions): ChildProcess;
function runCmd(cmd: string, args: any[], options: SpawnSyncOptions | SpawnOptions | boolean, sync: boolean = false) {
  if (typeof options === 'boolean') {
    sync = options;
    options = undefined;
  }
  options = options || {};
  if (sync)
    return spawnSync(cmd, args, options as SpawnSyncOptions);
  return spawn(cmd, args, options as SpawnOptions);
}

export const runner: IRunner = {
  runScope,
  runScopeSync,
  runCmd
};