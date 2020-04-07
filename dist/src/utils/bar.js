"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const progress_1 = __importDefault(require("progress"));
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
function createProgress(template, options) {
    const bar = new progress_1.default(template, options);
}
exports.createProgress = createProgress;
//# sourceMappingURL=bar.js.map