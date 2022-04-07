export async function filterDuplicates(serverListA, serverListB) {
	const filteredArray = [];
	let isDuplicate = false;
	for (let i in serverListB) {
		isDuplicate = false;

		for (let j in serverListA) {
			if (serverListB[i] == serverListA[j]) {
				isDuplicate = true;
			}
		}
		if (isDuplicate != true) {
			filteredArray.push(serverListB[i])
		}
	} return filteredArray // only missing values
}
