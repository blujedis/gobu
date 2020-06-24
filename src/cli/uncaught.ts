import { redBright } from 'ansi-colors';

const exceptionHandler = (err) => {
  process.stderr.write(redBright(err.stack + '\n'));
};

export function enableExceptions(handler = exceptionHandler) {

  process.on('uncaughtException', handler);
  process.on('unhandledRejection', handler);

  // Disable handler.
  return () => {
    process.removeListener('uncaughtException', handler);
    process.removeListener('unhandledRejection', handler);
  };

}

export default enableExceptions;
