import { compare } from '../compare/index.js';
import logger from '../logger.js';
import { debugReports } from '../report/debug.js';
import { postReports } from '../report/postReports.js';
import { getHackers } from '../scrape/get.js';
import { commit } from '../store/commit.js';
import { load } from '../store/load.js';
import { mergeMap } from '../util/mergeMap.js';

export const doInitialRun = async () => {
	const store = load(),
		fetchedData = await getHackers();

	commit(fetchedData);

	if (!store) {
		logger.info('dry run since no store exists');

		return;
	} else {
		const reports = compare(store, fetchedData);

		debugReports(reports);
		postReports(reports, store,fetchedData);
	}
};

export function schedule() {
  setInterval(doInitialRun, 2e3 * 60);
}
