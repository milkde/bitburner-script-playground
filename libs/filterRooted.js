export async function filterRooted(serverArray) {
	const rootedServerDB = [];
	let counter = 0;
	for (let i in serverDB) {
		if (ns.hasRootAccess(serverArray[i])) {
			rootedServerDB[counter] = serverDB[i];
		}
		counter++;
	}
	return rootedServerDB
}
