import { RequestManager, RESTClient } from '@fuwa/rest';
import { RouteBases, Routes } from 'discord-api-types/v10';
import logger from '../logger.js';

const rest = new RequestManager(
	new RESTClient({
		baseURL: RouteBases.api,
		auth: 'Bot MTAwMjkyNzQ2MTQyMTU1NTcyMw.GZKHbJ.Wn0T05yRJmG7ykP8ihmLHSe41vuddGnPI822YA'
	}),
	{
		timings: true,
		logger: {
			debug: console.log,
			header: '[rest]',
			trace: console.log
		}
	}
);

/**
 *
 * @param {*} arr
 * @param {Map<string, import('../store/transform/hacker.js').Hacker>} old
 * @param {Map<string, import('../store/transform/hacker.js').Hacker>} newValue
 */
export const postReports = (arr, old, newValue) => {
	for (const report of arr) {
		switch (report.name) {
			case 'entry_keys': {
				const { added, removed } = report,
					body = makeEntryKeysBody([old, newValue], added, removed);

				if (!body) continue;

				rest.queue(Routes.channelMessages('993589083832078438'), {
					method: 'POST',
					body
				});

				break;
			}
		}
	}
};

/**
 *
 * @param {Map<string, import('../store/transform/hacker.js').Hacker>[]} hackers
 * @param {string[]} added
 * @param {string[]} removed
 */
function makeEntryKeysBody([old, newValue], added, removed) {
	/**
	 * @type {import('discord-api-types/v10').APIEmbed[]}
	 */
	const embeds = [];

	for (const user of added) {
		const hacker = newValue.get(user);

		if (!hacker) {
			logger.warn('user added without map entry');
			continue;
		}

		embeds.push({
			color: 0x42c966, // bright green
			title: `@${hacker.username}`,
			description: 'the'
		});
	}

	return embeds.length ? { embeds } : null;
}
