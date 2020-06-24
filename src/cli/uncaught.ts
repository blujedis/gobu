import { log } from '../utils';

const exceptionHandler = (err) => {
  log.fatal(err.stack);
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
