const { execFile } = require("child_process");
 
function pingHostService(host) {
  return new Promise((resolve) => {
    // execFile (not exec) with an argument array means the host string is
    // never passed through a shell, so shell metacharacters (;, |, &&, `` ` ``,
    // $()) cannot be used to chain or inject additional commands.
    const args =
      process.platform === "win32"
        ? ["-n", "2", "-w", "2000", host]
        : ["-c", "2", "-W", "2", host];
 
    execFile(
      "ping",
      args,
      {
        timeout: 5000, // kill the process if it hangs -> prevents resource-exhaustion DoS
        maxBuffer: 1024 * 64, // cap stdout/stderr size
      },
      (error) => {
        if (error) {
          // Non-zero exit / timeout just means "unreachable", not a server fault.
          return resolve({
            host,
            reachable: false,
            checkedAt: new Date().toISOString(),
          });
        }
 
        resolve({
          host,
          reachable: true,
          checkedAt: new Date().toISOString(),
        });
      }
    );
  });
}
 
module.exports = { pingHostService };