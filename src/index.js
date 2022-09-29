import logger from './logger.js';
import { run, schedule } from './run.js';

logger.info('running initial scrape');

run();
schedule();
