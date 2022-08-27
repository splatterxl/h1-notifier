import { newHacker } from './new.js';
import { reputationChange } from './up.js';

const comparators = [newHacker, reputationChange];

export const compare = (base, now) => {
	const reports = [];

	for (const compare of comparators) {
		reports.push(compare(base, now));
	}

	return reports;
};
