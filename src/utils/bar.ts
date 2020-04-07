import ProgressBar, { ProgressBarOptions } from 'progress';

/**
 * Creates a new progress bar.
 * 
 * @example Tokens
 * :bar - the progress bar itself.
 * :current - the current tick number.
 * :total - the total number of ticks.
 * :elapsed - the total elapsed time in seconds.
 * :percent - the completion percentage.
 * :eta - the estimated time until completion in seconds.
 * :rate - the rate of ticks per seconds.
 * 
 * @example Custom Tokens
 * bar = new ProgressBar(':bar :custom1 :custom2', { total: 10 });
 * bar.tick({
 *  custom1: 'Foo',
 *  custom2: 'Bar'
 * });
 * 
 * @see https://www.npmjs.com/package/progress
 * 
 * @param template the progress bar template string.
 * @param options progress bar options.
 */
export function createProgress(template: string, options: ProgressBarOptions) {
  const bar = new ProgressBar(template, options);
}