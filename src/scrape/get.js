import { fetch } from 'undici';
import logger from '../logger.js';
import { transform } from '../transform/index.js';

const uri = 'https://hackerone-api.discord.workers.dev/thanks';

const getPage = async (page) => {
	const res = await fetch(`${uri}?page=${page}`),
		/**
		 * @type {any}
		 */
		json = await res.json();

	if (!res.ok) {
		logger.error('could not load hackers:', json);

		throw new Error();
	}

	return json;
};

export const getHackers = async () => {
	logger.info('fetching hackers');

	try {
		const json = await getPage(1).then(async (page) =>
			page?.concat(await getPage(2))
		);

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
