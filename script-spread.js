/** @param {NS} ns */
export async function main(ns) {

  // script needs 4.5GB to run on one thread
  // all other scripts are stoped on the severs
  // args 1-Inf are set to the scripts

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

  if (ns.args.length == 0) { ns.alert("have to have a file to execute for arg"); ns.exit() }
  var script = ns.args[0]
  if (!ns.fileExists(script)) { ns.alert("input file is not valid"); ns.exit() }
  var scriptArgs = ns.args
  scriptArgs.shift()

  var affectedSevers = 0;
  while (scann.length > 0) {
    var sever = scann[0]
    var n = await newScan(sever)
    for (var j = 0; j < n.length; j++) {
      scann.push(n[j])
    }
    scann.shift()

    if (!ns.hasRootAccess(sever)) { continue }
    ns.killall(sever);
    var ram = ns.getServerMaxRam(sever)
    var threadCount = Math.floor(ram / ns.getScriptRam(script, "home"));
    if (threadCount > 0) {
      affectedSevers++
      ns.scp(script, sever, "home")
      ns.exec(script, sever, threadCount, ...scriptArgs)
    }
  }
  ns.tprint("Scripts spread to " + affectedSevers + " severs.")
}
