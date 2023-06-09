import { RequestManager, RESTClient } from '@fuwa/rest';
import { RouteBases, Routes } from 'discord-api-types/v10';
import logger from '../logger.js';
import { getDifferenceLabel } from '../util/getDifferenceLabel.js';

const rest = new RequestManager(
	new RESTClient({
		baseURL: RouteBases.api,
		auth: process.env.DISCORD_TOKEN
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
 * @param {Map<string, import('../transform/hacker.js').Hacker>} old
 * @param {Map<string, import('../transform/hacker.js').Hacker>} newValue
 */
export const postReports = (arr, old, newValue) => {
	let embeds = [];

	for (const report of arr) {
		switch (report.name) {
			case 'entry_keys': {
				const { added, removed } = report,
					body = makeEntryKeysBody([old, newValue], added, removed);

				if (body) embeds = embeds.concat(body);

				break;
			}
			case 'change': {
				const { changed } = report,
					body = makeChangeBody([old, newValue], changed);

				if (body) embeds = embeds.concat(body);

				break;
			}
			default: {
				logger.warn('unknown report type', report.name);
			}
		}
	}

	return doReport({ embeds });
};

const doReport = async (body, retry = 5) => {
	if (!body?.embeds?.length) return;

	try {
		await rest.queue(Routes.channelMessages(process.env.DISCORD_CHANNEL), {
			method: 'POST',
			body: { embeds: body.embeds.slice(0, 10) }
		});
	} catch (e) {
		console.error(e);

		logger.warn('could not send report');

		if (retry < 5) return;
		else {
			logger.debug('retrying');

			return new Promise((resolve) => {
				setTimeout(() => {
					doReport(body, retry + 1).then(resolve);
				}, 3e3);
			});
		}
	}
};

const _USER_AVATAR = (username) =>
	`https://hackerone-api.discord.workers.dev/user-avatars/${username}`;

/**
 *
 * @param {Map<string, import('../transform/hacker.js').Hacker>[]} hackers
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
			title: 'Added',
			description: `New hacker **@${user}** with \`${
				hacker.rep
			}\` reputation (${getDifferenceLabel(hacker.rep)})`,
			thumbnail: {
				url: _USER_AVATAR(user)
			},
			fields: [
				{
					name: 'Profile',
					value: `https://hackerone.com/${user}`
				},
				{ name: 'Position', value: `${hacker.position}/200` }
			]
		});
	}

	for (const user of removed) {
		const hacker = old.get(user);

		if (!hacker) {
			logger.warn('user removed without map entry');
			continue;
		}

		embeds.push({
			color: 0xc94242, // bright red
			title: 'Removed',
			description: ` **@${user}** was removed with \`${hacker.rep}\` reputation`,
			thumbnail: {
				url: _USER_AVATAR(user)
			},
			fields: [
				{
					name: 'Profile',
					value: `https://hackerone.com/${user}`
				},
				{
					name: 'Position',
					value: `${hacker.position}/200`
				}
			]
		});
	}

	return embeds.length ? embeds : null;
}

/**
 *
 * @param {Map<string, import('../transform/hacker.js').Hacker>[]} param0
 * @param {string[]} changed
 */
export function makeChangeBody([old, newValue], changed) {
	/**
	 * @type {import('discord-api-types/v10').APIEmbed[]}
	 */
	const embeds = [];

	for (const user of changed) {
		const oldHacker = old.get(user),
			newHacker = newValue.get(user);

		if (!oldHacker || !newHacker) {
			logger.warn('no hacker entry for', user, '(reputation_change)');

			continue;
		}

		const difference = newHacker.rep - oldHacker.rep;

		embeds.push({
			color: difference < 0 ? 0xc94242 : 0x3ea7c2, // cool blue
			title: 'Reputation change',
			description: `**@${user}**'s reputation changed: \`${
				oldHacker.rep
			}\` -> \`${newHacker.rep}\` (**${difference}**: ${getDifferenceLabel(
				difference
			)})`,
			thumbnail: {
				url: _USER_AVATAR(user)
			},
			fields: [
				{
					name: 'Profile',
					value: `https://hackerone.com/${user}`
				},
				{
					name: 'Position',
					value: `${newHacker.position}/200`
				}
			]
		});
	}

	return embeds.length ? embeds : null;
}
