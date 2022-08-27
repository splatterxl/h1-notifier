import { newHacker } from './new.js';

const comparators = [newHacker];

export const compare = (base, now) => {
	const reports = [];

	for (const compare of comparators) {
		reports.push(compare(base, now));
	}

	return reports;
};
