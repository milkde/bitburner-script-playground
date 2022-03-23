/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('sleep');
	ns.disableLog('scan');
	ns.disableLog('getServerRequiredHackingLevel');
	ns.disableLog('getHackingLevel');
	ns.disableLog('hasRootAccess');

	let scannedAndReady = [];
	let newServers = ns.scan(ns.getHostname());
	let helperArray = [];
	let counter = 10;

	// This is optional. It's here to filter out the players webservers
	async function filterSubstring(serverList, substring) {
		const filteredArray = [];

		for (let i in serverList) {
			if (!serverList[i].includes(substring)) {
				filteredArray.push(serverList[i]);
			}
		} return filteredArray // the original values + the unique ones
	}

	async function filterDuplicates(serverListA, serverListB) {
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

	async function mergeArrays(arrayA, arrayB) {
		for (let i in arrayB) {
			arrayA.push(arrayB[i]);
		} return arrayA
	}

	async function scanHost(host) {
		const hostScanArray = ns.scan(host);
		return hostScanArray
	}

	while (true) {
		counter--
		for (let i in newServers) {
			let array2 = [];
	
			array2 = array2.concat(await scanHost(newServers[i]));
			array2 = await filterDuplicates(scannedAndReady, array2);

			// Merging the arrays
			for (let j in array2) {
				helperArray.push(array2[j]);
			}

			scannedAndReady.push(newServers[i]);
			if (!ns.hasRootAccess(newServers[i]) && ns.getHackingLevel() > ns.getServerRequiredHackingLevel(newServers[i])) {
				ns.exec('/scripts/nuke.js', 'home', 1, newServers[i]);
				ns.print('Rooted a new server: ' + newServers[i]);
			}
		}
		newServers = helperArray;
		helperArray = [];

		if (counter == 0) {
			scannedAndReady = await filterSubstring(scannedAndReady, 'webmon');
			scannedAndReady = await filterSubstring(scannedAndReady, 'home');
			await ns.write('/db/spiderDB.txt', scannedAndReady, 'w');
			counter = 10;
		}
		await ns.sleep(50);
	}
}
