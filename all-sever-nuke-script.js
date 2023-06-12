/** @param {NS} ns */
export async function main(ns) {
  // sever needs 2.35 GB ram to run on one thread  

  function formatRAM(inGB, decimal = 3) {
    // https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript 
    // heavily modified
    if (inGB < 1024) return (inGB).toFixed(decimal) + " GB";
    else if (inGB < 1048576) return (inGB / 1024).toFixed(decimal) + " TB";
    else return (inGB / 1048576).toFixed(decimal) + " PB";
  }

  async function getRoot(sever) {
    var portCrackers = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];
    var tools = [ns.brutessh, ns.ftpcrack, ns.relaysmtp, ns.httpworm, ns.sqlinject]
    var portsNeeded = ns.getServerNumPortsRequired(sever);
    var open = 0;
    for (var j = 0; j < portCrackers.length && open < portsNeeded; j++) {
      if (ns.fileExists(portCrackers[j], "home")) {
        tools[j](sever);
        open++
      }
    }
    if (open < portsNeeded) { return false }
    ns.nuke(sever);
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
  var totalRam = 0
  while (scann.length > 0) {
    var sever = scann[0]
    var ram = ns.getServerMaxRam(sever)
    if (ram > 0) {
      totalRam += ram
    } else {
      neighbors.slice(neighbors.indexOf(sever), 1)
    }

    var n = await newScan(sever)
    getRoot(sever)
    for (var j = 0; j < n.length; j++) {
      scann.push(n[j])
    }
    scann.shift()
  }
  var str = ""
  for (var j = 0; j < neighbors.length; j++) {
    str += (String(neighbors[j]) + "\n")
  }
  ns.write("Data/severs.txt", str, "w")
  ns.tprint("total ram : " + formatRAM(totalRam))
}
