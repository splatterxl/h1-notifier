import { fetch } from 'undici';
import logger from '../logger.js';
import { transform } from '../transform/index.js';

const uri = 'https://hackerone-api.discord.workers.dev/thanks';

export const getHackers = async () => {
	logger.info('fetching hackers');

	try {
		const res = await fetch(uri),
			/**
			 * @type {any}
			 */
			json = await res.json();

		if (!res.ok) {
			logger.error('could not load hackers:', json);

			throw new Error();
		}

		return transform(json);
	} catch {
		logger.error('could not send request, retrying');

		return new Promise((resolve) => {
			setTimeout(() => {
				getHackers().then(resolve);
			}, 3e3);
		});
	}
};
