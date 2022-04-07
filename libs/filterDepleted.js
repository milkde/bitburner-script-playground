export async function filterDepleted(serverArray) {
	const serverArray
	let filteredArray = [];
	let currentMoney = ns.getServerMoneyAvailable(serverArray[i]);

	for (let i in serverArray) {
		currentMoney = ns.getServerMoneyAvailable(serverArray[i]);
		
		if (currentMoney == 0) {
			filteredArray.push(serverArray[i]);
		}
	}
	return serverArray
}
