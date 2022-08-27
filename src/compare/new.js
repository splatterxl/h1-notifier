/**
 * @param {Map} base
 * @param {Map} now
 */
export const newHacker = (base, now) => {
	/**
	 * @type {[string[],string[]]}
	 */
	const _data = [[...base.keys()], [...now.keys()]],
		[oldNames, newNames] = _data;

	/**
	 * @type {EntryKeysReport}
	 */
	const report = {
		name: 'entry_keys',
		added: [],
		removed: []
	};

	for (const name of oldNames) {
		if (!newNames.includes(name)) {
			report.removed.push(name);
		}
	}

	for (const name of newNames) {
		if (!oldNames.includes(name)) {
			report.added.push(name);
		}
	}

	return report;
};

/**
 * @typedef {Object} EntryKeysReport
 * @property {string} name
 * @property {string[]} added
 * @property {string[]} removed
 */
