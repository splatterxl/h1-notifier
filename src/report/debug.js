import logger from '../logger.js';

export const debugReports = (arr) => {
	for (const report of arr) {
		switch (report.name) {
      case 'entry_keys': {
        logger.debug('entry_keys ::', report.added.length, 'added,', report.removed.length, 'removed')

				break;
			}
			default: {
				logger.warn('unknown report type', report.name);
			}
		}
	}
};
