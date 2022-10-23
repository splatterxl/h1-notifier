import logger from '../logger.js';

export const debugReports = (arr) => {
	for (const report of arr) {
		switch (report.name) {
			case 'entry_keys': {
				logger.debug(
					'entry_keys ::',
					report.added.length,
					'added,',
					report.removed.length,
					'removed'
				);

				break;
			}
			case 'change': {
				logger.debug('reputation_change ::', report.changed.length, 'changed');

				break;
			}
			default: {
				logger.warn('unknown report type', report.name);
			}
		}
	}
};
