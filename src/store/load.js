import { readFileSync } from 'fs';
import { join } from 'path';
import logger from '../logger.js';
import { transformMap } from '../transform/index.js';

export const _STORE_FILE_PATH = join(process.cwd(), '__hackers.json');

/**
 * Loads JSON from the file, handling errors gracefully by returning an {@link Option},
 * but does not transform into any typed struct yet.
 */
const _loadSync = () => {
	try {
		const data = readFileSync(_STORE_FILE_PATH, 'utf8'),
			json = JSON.parse(data);

		return json;
	} catch (e) {
		logger.warn('could not load store file:', e.toString());

		return null;
	}
};

/**
 *
 * @returns {Map<string, import('../transform/hacker.js').Hacker>|null}
 */
export const load = () => {
	const value = _loadSync();

	return value && transformMap(value);
};

export const loadOrEmpty = () => load() ?? new Map();
