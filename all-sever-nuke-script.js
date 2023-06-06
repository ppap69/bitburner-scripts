/** @param {NS} ns */
export async function main(ns) {
  
   // script needs 2.3GB to run on one thread
  
  async function getRoot(sever) {
    var portCrackers = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];
    var tools = [ns.brutessh, ns.ftpcrack, ns.relaysmtp, ns.httpworm, ns.sqlinject]
    var portsNeeded = ns.getServerNumPortsRequired(sever);
    var open = 0;
    if(portsNeeded==0){return true}
    for (var j = 0; j < portCrackers.length && open < portsNeeded; j++) {
      if (ns.fileExists(portCrackers[j], "home")) {
        tools[j](sever);
        open++
      }
    }
    if (open < portsNeeded) {ns.tprint("failed : "+sever); return false }
    ns.nuke(sever);
    ns.tprint("opened : "+sever)
    return true
  }

  async function newScan(sever) {
    var s = await ns.scan(sever)
    var out = []
    for (var i = 0; i < s.length; i++) {
      var sev = s[i]
      if (neighbors.indexOf(sev) == -1) {
        neighbors.push(sev)
        out.push(sev)
      }
    }
    return out
  }

  let neighbors = ["home"]
  let scann = await newScan(sever)

  while (scann.length>0) {
    var sever = scann[0]
    var n = await newScan(sever)
    getRoot(sever)
    for (var j = 0; j < n.length;j++) {
      scann.push(n[j])
    }
    scann.shift()
  }
  ns.tprint("done")
}
