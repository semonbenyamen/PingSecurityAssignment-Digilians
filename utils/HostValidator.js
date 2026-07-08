const IPV4 = /^((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
const HOSTNAME =
  /^(?=.{1,253}$)(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*$/;
 
function isValidHost(host) {
  if (typeof host !== "string") return false;
  const h = host.trim();
  if (h.length === 0 || h.length > 255) return false;
  return IPV4.test(h) || HOSTNAME.test(h);
}
 
module.exports = { isValidHost };