import { filterSubstring } from '/libs/filterSubstring.js';
import { filterDuplicates } from '/libs/filterDuplicates.js';

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('sleep');
	ns.disableLog('scan');
	ns.disableLog('getServerRequiredHackingLevel');
	ns.disableLog('getHackingLevel');
	ns.disableLog('hasRootAccess');
	ns.clearLog();

	let scannedAndReady = [];
	let newServers = ns.scan(ns.getHostname());
	let helperArray = [];
	let counter = 10;

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
			} else { ns.print(newServers[i] + ' is already rooted.') }
		}
		newServers = helperArray;
		helperArray = [];

		if (counter == 0) {
			scannedAndReady = await filterSubstring(scannedAndReady, 'webmon');
			scannedAndReady = await filterSubstring(scannedAndReady, 'home');
			await ns.write('/db/spiderDB.txt', scannedAndReady, 'w');
			ns.print('New list written into spiderDB.txt: \n' + scannedAndReady);
			counter = 10;
		}
		await ns.sleep(50);
	}
}
