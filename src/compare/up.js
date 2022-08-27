/**
 * @param {Map<string, import('../transform/hacker.js').Hacker>} base
 * @param {Map<string, import('../transform/hacker.js').Hacker>} now
 */
export const reputationChange = (base, now) => {
	/**
	 * @type {{ changed: string[] }}
	 */
	const obj = {
		// @ts-ignore
		name: 'change',
		changed: []
	};

	for (const hacker of base.values()) {
		const newHacker = now.get(hacker.username);

		if (!newHacker) continue;
		else if (hacker.rep != newHacker.rep) obj.changed.push(hacker.username);
	}

  return obj
};
