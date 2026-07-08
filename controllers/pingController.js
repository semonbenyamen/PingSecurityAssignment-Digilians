const { pingHostService } = require("../utils/pingService");
const { parseXML, buildXML } = require("../utils/xmlHelper");
const { isValidHost } = require("../utils/hostValidator");
 
const sendXML = (res, status, payload) =>
  res.status(status).type("application/xml").send(buildXML("pingResponse", payload));
 
const pingHost = async (req, res) => {
  let parsed;
 
  try {
    parsed = parseXML(req.body);
  } catch (err) {
    // Never reflect the raw payload or parser internals back to the client.
    return sendXML(res, 400, { success: false, message: "Invalid XML payload." });
  }
 
  const host = parsed?.pingRequest?.host;
 
  if (!host || typeof host !== "string") {
    return sendXML(res, 400, { success: false, message: "Host is required." });
  }
 
  const cleanHost = host.trim();
 
  if (cleanHost.length > 255) {
    return sendXML(res, 400, { success: false, message: "Host is too long." });
  }
 
  if (!isValidHost(cleanHost)) {
    return sendXML(res, 400, { success: false, message: "Invalid hostname or IP address." });
  }
 
  try {
    const result = await pingHostService(cleanHost);
    return sendXML(res, 200, {
      success: true,
      host: result.host,
      reachable: result.reachable,
      checkedAt: result.checkedAt,
    });
  } catch (err) {
    // Log details server-side only; the client gets a generic message.
    console.error("Ping execution error:", err.message);
    return sendXML(res, 500, { success: false, message: "Unable to check host." });
  }
};
 
module.exports = { pingHost };