import { parse } from 'kawkah-parser';

const parsed = parse();
const argv = process.argv.slice(2);

export {
  parsed,
  argv
};
