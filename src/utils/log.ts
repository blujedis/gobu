import { createLogger, LEVEL, ConsoleTransport, SPLAT } from 'kricket';
import { format } from 'util';
import { redBright, yellowBright, blueBright, magentaBright, bgRedBright } from 'ansi-colors';
import { error, warning, info, success } from 'log-symbols';

const styles = {
  fatal: bgRedBright,
  error: redBright,
  warn: yellowBright,
  info: blueBright,
  debug: magentaBright
};

const symbols = {
  alert: error,
  caution: warning,
  notice: info,
  success
};

const colorize = (key: string, val: string, template: string = '{{key}}:') =>
  styles[key](template.replace('{{key}}', key)) + ' ' + val;

const symbolize = (key: string, val: string, prepend: boolean = true) =>
  prepend ? symbols[key] + ' ' + val : val + ' ' + symbols[key];

const log = createLogger('logger', {
  levels: ['fatal', 'error', 'warn', 'info', 'debug', 'alert', 'caution', 'notice', 'success'],
  transports: [
    new ConsoleTransport()
  ]
});

log.transform((payload) => {
  payload.message = format(payload.message, ...payload[SPLAT]);
  if (['fatal', 'error', 'warn', 'info', 'debug'].includes(payload[LEVEL]))
    payload.message = colorize(payload[LEVEL], payload.message);
  if (['alert', 'caution', 'notice', 'success'].includes(payload[LEVEL]))
    payload.message = symbolize(payload[LEVEL], payload.message);
  return payload;
});

export {
  log
};

