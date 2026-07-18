const { execFile } = require("child_process");
 
function pingHostService(host) {
  return new Promise((resolve) => {
    const args =
  // The ping command has different parameters depending on the operating system, The code specifies the system is Windows or Linux..
      process.platform === "win32"
        ? ["-n", "2", "-w", "2000", host]
        : ["-c", "2", "-W", "2", host];
 
    execFile(
      "ping",
      args,
      {
  // the process is stopped after five seconds
        timeout: 5000,
  // The output size is limited to 64 KB, This is additional protection against memory consumption
        maxBuffer: 1024 * 64,
      },
      (error) => {
        if (error) {
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