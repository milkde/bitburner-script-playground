// simple script handler
import { nFormatter } from 'libs/nFormatter.js';

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('getServerSecurityLevel'); ns.disableLog('getServerMinSecurityLevel'); 
	ns.disableLog('getServerMoneyAvailable'); ns.disableLog('getServerMaxMoney'); 
	ns.disableLog('sleep');	ns.disableLog('getServerUsedRam'); 
	ns.disableLog('getScriptRam'); ns.disableLog('isRunning'); 
	ns.disableLog('hackAnalyze'); ns.disableLog('exec'); 
	ns.disableLog('getServerMaxRam'); 
	ns.clearLog();

	const symbols = [/*'█',*/'■', '·', '[', ']'];
	let moneyMeter = '[';
	const server = ns.args[0];
	const host = ns.getHostname();
	const fps = 50;
	const barRes = 40;
	const version = '0.3.42';

	// object for the server - might be transformed into a constructor in the future
	const serverInfo = {
		minSec: () => ns.getServerMinSecurityLevel(server),
		curSec: () => ns.getServerSecurityLevel(server),
		maxMon: () => ns.getServerMaxMoney(server),
		curMon: () => ns.getServerMoneyAvailable(server),
		maxRam: () => ns.getServerMaxRam(host),
		useRam: () => ns.getServerUsedRam(host),
		curScr: ['weaken.js', 'grow.js', 'hack.js'],
		curStg: ''
	}

	async function drawStats(arg1, arg2) {
		let moneyMeter = symbols[2];
		let secMeter = symbols[2];
		let actualMaxMoney = ns.getServerMaxMoney(server);
		let actualMinSecLvl = (ns.getServerMinSecurityLevel(server)).toFixed(2) * 1;
		let oneMoneyBlock = actualMaxMoney / barRes;
		let oneSecurityBlock = serverInfo.curSec() / barRes;
		let i = (Math.ceil(serverInfo.curMon() / oneMoneyBlock)).toFixed(0);
		let j = (Math.ceil(actualMinSecLvl / oneSecurityBlock)).toFixed(0);

		while (i > 0) {
			moneyMeter = moneyMeter + symbols[0];
			i--;
		}
		while (j > 0) {
			secMeter = secMeter + symbols[0];
			j--;
		}
		while (moneyMeter.length < 41) {
			moneyMeter = moneyMeter + symbols[1];
		}
		while (secMeter.length < 41) {
			secMeter = secMeter + symbols[1];
		}
		if (moneyMeter.length > 41) {
			moneyMeter = moneyMeter.slice(1, 41);
		}
		if (secMeter.length > 41) {
			secMeter = secMeter.slice(1, 41);
		}
		moneyMeter = moneyMeter + symbols[3];
		secMeter = secMeter + symbols[3];

		ns.print('simpleHandler.js version ' + version + '\\ @' + host);
		ns.print('⩶⩶⩶⩶⩶⩶⩶⩶⩶⩶\n');
		ns.print(server);
		ns.print('⩶⩶⩶⩶⩶⩶⩶⩶⩶⩶\n');
		ns.print('Mininmum security level ' + ' / ' + 'Current Security level');
		ns.print(secMeter + ' ⚰ ' + actualMinSecLvl.toFixed(2) + ' / ' + serverInfo.curSec().toFixed(2) + '\n');
		ns.print('Current available money' + ' / ' + 'Maximum Money');
		ns.print(moneyMeter + ' ⚰  ' + await nFormatter(serverInfo.curMon().toFixed(2)) + ' / ' + await nFormatter(actualMaxMoney.toFixed(2)) + '\n');
		ns.print('⩶⩶⩶⩶⩶⩶⩶⩶⩶⩶');
		ns.print('Currently running: ' + serverInfo.curStg + ' ' + arg1 + 'x threats\n');
		ns.print('⩶⩶⩶⩶⩶⩶⩶⩶⩶⩶\n');
	}

	async function calculateThreats(script) {
		let maxThreats = 0;

		switch (script) {
			case 'grow.js':
				let possibleMaxThreats = Math.floor(((serverInfo.maxRam() - serverInfo.useRam()) / ns.getScriptRam('grow.js')));

				let growthUntilMax = serverInfo.maxMon() / serverInfo.curMon();

				let calculatedThreats = ns.growthAnalyze(server, Math.ceil(growthUntilMax));

				while (possibleMaxThreats < calculatedThreats) {
					calculatedThreats--;
				}
				return calculatedThreats + 1

			case 'weaken.js':
				let i = 1;
				maxThreats = Math.floor(((serverInfo.maxRam() - serverInfo.useRam()) / ns.getScriptRam('weaken.js')));

				while (ns.weakenAnalyze(i) <= serverInfo.curSec() - serverInfo.minSec()) {
					i++;
					if (ns.weakenAnalyze(i) >= maxThreats) {
						return ib + 1
					}
				}
				return i + 1

			case 'hack.js':
				let moneyPerThreat = ns.hackAnalyze(server);
				let allowedAmountThreats = Math.floor(serverInfo.curMon() / (serverInfo.curMon() * moneyPerThreat));

				maxThreats = Math.floor(((serverInfo.maxRam() - serverInfo.useRam()) / ns.getScriptRam('hack.js'))); // 90% of possible power
				let rdyRam = serverInfo.maxRam() - serverInfo.useRam();
				if (allowedAmountThreats > rdyRam) {
					allowedAmountThreats = maxThreats;
				}
				return allowedAmountThreats + 1

		}
	}

	if (ns.hasRootAccess(server)) {
		while (true) {
			let threats = 0;
			let weakenCounter = 2;


			//GROW////////////////////////////////////////////////////////////////////////////////////////////////
			while (serverInfo.curMon() < serverInfo.maxMon()) {
				if (weakenCounter == 2) {
					while (serverInfo.curSec() > serverInfo.minSec()) {

						if (!ns.isRunning('weaken.js', host, server)) {
							serverInfo.curStg = 'weaken.js';
							threats = (await calculateThreats(serverInfo.curStg)).toFixed(0);
							ns.exec('weaken.js', host, Math.abs(threats), server);
							await ns.sleep(fps);
						}
						while (ns.isRunning('weaken.js', host, server)) {
							serverInfo.curStg = 'weaken.js';
							await drawStats(threats);
							await ns.sleep(fps);
							ns.clearLog();
						}
					}
					weakenCounter = 0;
				}
				if (!ns.isRunning('grow.js', host, server)) {
					serverInfo.curStg = 'grow.js';
					threats = (await calculateThreats(serverInfo.curStg)).toFixed(0);
					if (threats <= 0) { break; }
					ns.exec('grow.js', host, Math.abs(threats), server);
					weakenCounter++
					await ns.sleep(fps);
				}
				while (ns.isRunning('grow.js', host, server)) {
					serverInfo.curStg = 'grow.js';
					await drawStats(threats);
					await ns.sleep(fps);
					ns.clearLog();
				}
				await drawStats(threats);
				await ns.sleep(fps);
				ns.clearLog();
				//End of while loop
			}

			while (serverInfo.curSec() > serverInfo.minSec()) {
				if (!ns.isRunning('weaken.js', host, server)) {
					serverInfo.curStg = 'weaken.js';
					threats = (await calculateThreats(serverInfo.curStg)).toFixed(0);
					ns.exec('weaken.js', host, Math.abs(threats), server);
					await ns.sleep(fps);
				}
				while (ns.isRunning('weaken.js', host, server)) {
					serverInfo.curStg = 'weaken.js';
					await drawStats(threats);
					await ns.sleep(fps);
					ns.clearLog();
				}
				await drawStats(threats);
			}

			if (!ns.isRunning('hack.js', host, server)) {
				serverInfo.curStg = 'hack.js';
				threats = (await calculateThreats(serverInfo.curStg)).toFixed(0);
				ns.exec('hack.js', host, Math.abs(threats), server);
				await ns.sleep(fps);
			}

			while (ns.isRunning('hack.js', host, server)) {
				serverInfo.curStg = 'hack.js';
				await drawStats(threats);
				await ns.sleep(fps);
				ns.clearLog();
			}
		}
	} else { ns.print('No root access for server. Aborting script.'); }
}
