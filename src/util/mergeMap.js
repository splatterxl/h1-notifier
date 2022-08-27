/**
 *
 * @param  {Map[]} maps
 */
export const mergeMap = (...maps) => {
	const ret = new Map();

	for (const map of maps)
		for (const [key, value] of map.entries()) ret.set(key, value);

	return ret;
};
