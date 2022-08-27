import logger from './logger.js';
import { doInitialRun, schedule } from './run/initial.js';

logger.info('running initial scrape');

doInitialRun();
schedule();
