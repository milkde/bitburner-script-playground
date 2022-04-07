export async function nFormatter(num) {
	if (num >= 1000000000000) {
		return (num / 1000000000000).toFixed(2).replace(/\.0$/, '') + 't';
	}
	if (num >= 1000000000) {
		return (num / 1000000000).toFixed(2).replace(/\.0$/, '') + 'b';
	}
	if (num >= 1000000) {
		return (num / 1000000).toFixed(2).replace(/\.0$/, '') + 'm';
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(2).replace(/\.0$/, '') + 'k';
	}

	return num;
}
