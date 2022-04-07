export async function calculateThreats(ns, host, target, mode) {

	const hostInfo = {
		maxRam: () => ns.getServerMaxRam(host),
		useRam: () => ns.getServerUsedRam(host),
		rdyRam: () => ns.getServerMaxRam(host) - ns.getServerUsedRam(host)
	}

	const scriptStats = {
		usgRam: {
			scriptWeaken: ns.getScriptRam('weaken.js'),
			scriptGrow: ns.getScriptRam('grow.js'),
			scriptHack: ns.getScriptRam('hack.js')
		}
	}

	const serverInfo = {
		minSec: () => ns.getServerMinSecurityLevel(target),
		curSec: () => ns.getServerSecurityLevel(target),
		maxMon: () => ns.getServerMaxMoney(target),
		curMon: () => ns.getServerMoneyAvailable(target),
		maxThr: {
			maxWeak: Math.floor((hostInfo.rdyRam() / scriptStats.usgRam.scriptWeaken)),
			maxGrow: Math.floor((hostInfo.rdyRam() / scriptStats.usgRam.scriptGrow)),
			maxHack: Math.floor((hostInfo.rdyRam() / scriptStats.usgRam.scriptHack))
		}
	}

	let calculatedthreats = 1;

	switch (mode) {
		case 'weaken':
			// Calculate how many threats it takes to weaken down the difference of
			// the current security level and the minimum security level
			// weakenAnalyze: Returns the security decrease that would occur 
			// 				  if a weaken with this many threads happened.

			while (ns.weakenAnalyze(calculatedthreats) <= serverInfo.curSec() - serverInfo.minSec()) {
				calculatedthreats++;
			}

			// If the amount of threats exceed the servers capabilities
			// then reduce them until the script can be run
			if (calculatedthreats >= serverInfo.maxThr.maxWeak) {
				calculatedThreats = serverInfo.maxThr.maxWeak;
			}
			return calculatedthreats

		case 'grow':
			//For example, if you want to determine how many grow calls you need to double the amount of money on foodnstuff, you would use:
			//let growTimes = ns.growthAnalyze("foodnstuff", 2);
			//If this returns 100, then this means you need to call grow 100 times in order to double the money (or once with 100 threads).
			let growthUntilMax = serverInfo.maxMon() / serverInfo.curMon();
			calculatedThreats = ns.growthAnalyze(target, Math.ceil(growthUntilMax));

			// If the amount of threats exceed the servers capabilities
			// then reduce them until the script can be run
			if (calculatedthreats >= serverInfo.maxThr.maxGrow) {
				calculatedThreats = serverInfo.maxThr.maxGrow;
			}
			return calculatedThreats + 1

		case 'hack':
			// For example, assume the following returns 0.01:
			// const hackAmount = ns.hackAnalyze("foodnstuff");
			// This means that if hack the foodnstuff server using a single thread, 
			// then you will steal 1%, or 0.01 of its total money. 
			// If you hack using N threads, then you will steal N*0.01 times its total money.
			let moneyPerThreat = ns.hackAnalyze(target);

			// Example: Current money is 1000$. You gain 0.01 per threat.
			// You would gain 10$ per threat. If you divide 1000$ / 10$
			// then you will get the amount of threats("times") to fully
			// deplete it. Multiplied by 0.85 to prevent depleting servers
			// (works not with higher hacking levels and arguments)			
			calculatedThreats = Math.floor((serverInfo.curMon() / (serverInfo.curMon() * moneyPerThreat) * 0.85));
			if (calculatedThreats > serverInfo.maxThr.maxHack) {
				calculatedThreats = serverInfo.maxThr.maxHack;
			}
			return calculatedThreats + 1
	}
}
