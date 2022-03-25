/** @param {NS} ns **/
import { filterSubstring } from '/libs/filterSubstringFromArray.js';

export async function main(ns) {
	ns.disableLog('getServerMaxRam'); ns.disableLog('getServerUsedRam'); ns.disableLog('hackAnalyze'); ns.disableLog('getServerMaxMoney');
	ns.disableLog('getServerMoneyAvailable'); ns.disableLog('sleep'); ns.disableLog('getServerSecurityLevel'); ns.disableLog('getHostname');
	ns.disableLog('getScriptRam'); //ns.disableLog('');
	ns.clearLog();



	const serverDBPath = ns.ls(ns.getHostname(), 'db.');
	const scriptLibPath = ns.ls(ns.getHostname(), 'lib.');
	const threatToMoneyThreshold = ns.args[1];
	let serverList = [];

	async function Server(server) {
		this.name = server;
		this.minSecurityLevel = ns.minSecurityLevel(server);
		this.curSecurityLevel = ns.getServerSecurityLevel(server);
		this.maxMoney = ns.getServerMaxMoney(server);
		this.curMoney = ns.getServerMoneyAvailable(server);
		this.maxRam = ns.getServerMaxRam(server);
		this.useRam = ns.getServerUsedRam(server);
		this.moneyPerThreat = ns.hackAnalyze(server);
		this.approvedThreats = async function calculateThreats() {
			let threatsAmountAllowed = (this.curMoney * threatToMoneyThreshold) / moneyPerThreat;
			return threatsAmountAllowed;
		}
		this.hasMoney = maxMoney > 0;
		this.hasRam = maxRam > 0;
	}

	async function Script(scriptPath) {
		this.path = scriptPath;
		this.memUsg = ns.getScriptRam(scriptPath, ns.getHostname());
	}

	async function initializeLists(dbPaths) {	
		for (let i in dbPaths) {
			let dbContent = await ns.read(dbPaths[i]);
			dbContent = dbContent.split(',');

			for (let n in dbContent) {
				serverList.push(dbContent[n]);
				
			}ns.print(typeof serverList);
		}
	} 

	// Gather all servers and remove duplicates
	ns.print(initializeLists(serverDBPath));
	serverList = [...new Set(serverList)];
	
	// filter webmons from serverlist
	ns.print(await filterSubstring(serverList, 'webmon'));
	
}
