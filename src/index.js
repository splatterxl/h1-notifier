import logger from './logger.js';
import { doInitialRun } from './run/initial.js';

logger.info('running initial scrape');

doInitialRun();
