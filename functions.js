/** @param {NS} ns **/
export async function main(ns) {
	let home = ns.scan(ns.getHostname());

	// This is optional. It's here to filter out the players webservers
	async function filterSubstring(serverList, substring) {
		const filteredArray = [];

		for (let i in serverList) {
			if (!serverList[i].includes(substring)) {
				filteredArray.push(serverList[i]);
			}
		} return filteredArray
	}

	async function filterDuplicates(serverListA, serverListB) {
		const filteredArray = [];
		for (let i in serverListB) {
			let isDuplicate = false;

			for (let j in serverListA) {
				if (serverListB[i] == serverListA[j]) {
					isDuplicate = true;
				}
			}
			if (isDuplicate != true) {
				filteredArray.push(serverListB[i])
			}
		} return filteredArray
	}

	/*	
	For reference of usage:
		const testArrayA = [1, 2, 4, 5, 6, 7, 9];
		const testArrayB = [2, 3, 4, 5, 6, 7, 8, 9];
		const testArrayC = testArrayA.concat(await filterDuplicates(testArrayA, testArrayB)); 
	*/


}
