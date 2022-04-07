/** @param {NS} ns **/
export async function fileToArray (ns, filePath) {
	const file = await ns.read(filePath);
	let array = file.split(',');
	return array
}
