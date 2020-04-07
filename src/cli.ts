import { root, parsed, argv, log } from './utils';
import { load } from './config';

(async function init() {

  const config = await load();

  if (!config){
    log.alert(`Failed to lookup config "gobu" in package.json or config "gobu.json".`);
    return;
  }

  

})();
