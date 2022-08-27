import { writeFileSync } from 'fs';
import logger from '../logger.js';
import { _STORE_FILE_PATH } from './load.js';

/**
 *
 * @param {Map<string, import('./transform/hacker.js').Hacker>} data
 */
export const commit = (data) => {
	const arr = Array.from(data.values()),
		string = JSON.stringify(arr);

	try {
		writeFileSync(_STORE_FILE_PATH, string);

		logger.info('committed', arr.length, 'hackers');
	} catch (e) {
		logger.error('could not commit store:', e);
	}
};
