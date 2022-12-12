const ALLOWED_DIFFERENCES = [2, 7, 15, 25, 50];

export const getDifferenceLabel = (diff) => {
	switch (diff) {
		case 2:
			return 'Duplicate Resolved';
		case 7:
			return 'Triage';
		case 15:
			return 'Low Severity Bounty';
		case 25:
			return 'Medium Severity Bounty';
		case 50:
			return '⚠️ High/Critical Severity Bounty';
		case -5:
			return 'N/A';
		case -7:
			return 'Informative/Duplicate';
		default:
			if (ALLOWED_DIFFERENCES.includes(diff - 7)) {
				return `Triage, ${getDifferenceLabel(diff - 7)}`;
			} else {
				return 'Unknown';
			}
	}
};
