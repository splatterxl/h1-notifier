import logger from '../logger.js';
import { transformHacker } from './hacker.js';

/**
 *
 * @param {any[]} arr
 * @returns {Map<string, import('./hacker.js').Hacker>}
 */
export const transform = (arr) => {
	const map = new Map();

	for (let i = 0; i < arr.length; i++) {
		const entry = arr[i],
			value = transformHacker(entry, i);

		if (value === null) continue;

		if (map.has(value.username)) {
			logger.warn('duplicate hacker', value.username);
		}

		map.set(value.username, value);
	}

	return map;
};

/**
 *
 * @param {import('./hacker.js').Hacker[]} arr
 * @returns {Map<string, import('./hacker.js').Hacker>}
 */
export const transformMap = (arr) =>
	new Map(arr.map((hacker) => [hacker.username, hacker]));
