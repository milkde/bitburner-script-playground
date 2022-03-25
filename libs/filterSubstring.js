/** @param {NS} ns **/
export async function filterSubstring(serverList, substring) {
	const filteredArray = [];

	for (let i in serverList) {
		if (!serverList[i].includes(substring)) {
			filteredArray.push(serverList[i]);
		}
	} return filteredArray // the original values + the unique ones
}
