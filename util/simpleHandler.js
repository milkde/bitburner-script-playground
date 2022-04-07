// simple script handler
import { nFormatter } from 'libs/nFormatter.js';
import { calculateThreats } from 'libs/calculateThreats.js';

/** @param {NS} ns **/
export async function main(ns) {
	ns.disableLog('getServerSecurityLevel'); ns.disableLog('getServerMinSecurityLevel');
	ns.disableLog('getServerMoneyAvailable'); ns.disableLog('getServerMaxMoney');
	ns.disableLog('sleep'); ns.disableLog('getServerUsedRam');
	ns.disableLog('getScriptRam'); ns.disableLog('isRunning');
	ns.disableLog('hackAnalyze'); ns.disableLog('exec');
	ns.disableLog('getServerMaxRam');
	ns.clearLog();

	const symbols = [/*'█',*/'■', '·', '[', ']'];
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
		curStg: '',
		mode: ['weaken', 'grow', 'hack']
	}

	async function drawStats(arg1, arg2) {
		let moneyMeter = symbols[2];
		let secMeter = symbols[2];
		let actualMaxMoney = ns.getServerMaxMoney(server);
		let actualMinSecLvl = ns.getServerMinSecurityLevel(server) * 1;
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
		ns.print(secMeter + ' ⚰ ' + actualMinSecLvl + ' / ' + serverInfo.curSec() + '\n');
		ns.print('Current available money' + ' / ' + 'Maximum Money');
		ns.print(moneyMeter + ' ⚰  ' + await nFormatter(serverInfo.curMon()) + ' / ' + await nFormatter(actualMaxMoney) + '\n');
		ns.print('⩶⩶⩶⩶⩶⩶⩶⩶⩶⩶');
		ns.print('Currently running: ' + serverInfo.curStg + ' ' + arg1 + 'x threats\n');
		ns.print('⩶⩶⩶⩶⩶⩶⩶⩶⩶⩶\n');
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
							
							threats = await calculateThreats(ns, host, server, serverInfo.mode[0]);
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
					threats = await calculateThreats(ns, host, server, serverInfo.mode[1]);
					if (threats <= 0) { break; }
					ns.exec('grow.js', host, Math.abs(threats), server);
					weakenCounter++
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
					threats = await calculateThreats(ns, host, server, serverInfo.mode[0]);
					ns.exec('weaken.js', host, Math.abs(threats), server);
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
				threats = await calculateThreats(ns, host, server, serverInfo.mode[2]);
				ns.exec('hack.js', host, Math.abs(threats), server);
			}

			while (ns.isRunning('hack.js', host, server)) {
				serverInfo.curStg = 'hack.js';
				await drawStats(threats);
				await ns.sleep(fps);
				ns.clearLog();
			}
		}
	} else { ns.tprint('No root access for server. Aborting script.'); }
}
