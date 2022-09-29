import logger from '../logger.js';

/**
 * @typedef {Object} RawHacker
 * @property {string} username
 * @property {`${number}`} user_id
 * @property {number} reputation
 * @property {string} profile_url
 */

/**
 * @type {[from: string, to: string | null, defaultValue: any, parse?: (val: any) => any][]}
 */
const _PROP_MAPPING = [
	['username', 'username', null],
	['user_id', 'id', null, (val) => parseInt(val)],
	['reputation', 'rep', 0],
	['profile_url', null, (obj) => obj.username]
];

/**
 * @typedef {Object} Hacker
 * @property {string} username
 * @property {number} id
 * @property {number} rep
 * @property {number} position
 */

/**
 * Transform a possibly optional API object into a full object we can work with with position data
 *
 * @param {RawHacker} hacker
 * @param {number} ind
 *
 * @returns {Hacker | null}
 */
export const transformHacker = (hacker, ind) => {
	/**
	 * @type {Hacker}
	 */
	// @ts-ignore
	const obj = {
		position: ind + 1
	};

	for (const [from, to, defaultValue, transform] of _PROP_MAPPING) {
		if (hacker[from] == null) {
			logger.warn(
				'possibly malformed data for',
				_ensureHackerUsername(hacker),
				'- key',
				from,
				hacker[from] === undefined ? 'is missing' : 'is nullish'
			);

			if (!to) continue;

			if (defaultValue === null) {
				logger.debug(
					'skipping',
					_ensureHackerUsername(hacker),
					'because required key is missing'
				);

				return null;
			} else {
				if (typeof defaultValue === 'function') {
					obj[to] = defaultValue(obj);
				} else {
					obj[to] = defaultValue;
				}
				continue;
			}
		}

		if (!to) continue;

		if (transform) {
			obj[to] = transform(hacker[from]);
		} else {
			obj[to] = hacker[from];
		}
	}

	return obj;
};

const _ensureHackerUsername = ({ username }) => username ?? ['unknown'];
