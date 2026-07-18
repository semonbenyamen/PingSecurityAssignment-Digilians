const { pingHostService } = require("../utils/pingService");
const { parseXML, buildXML } = require("../utils/xmlHelper");
const { isValidHost } = require("../utils/hostValidator");
 
const sendXML = (res, status, payload) =>
  res.status(status).type("application/xml").send(buildXML("pingResponse", payload));
 
const pingHost = async (req, res) => {
  let parsed;
 
  try {
// The request is sent to parseXML to ensure that the XML is correct and secure.
    parsed = parseXML(req.body);
  } catch (err) {
    return sendXML(res, 400, { success: false, message: "Invalid XML payload." });
  }
 
// take the value of <host> found inside <pingRequest>.
  const host = parsed?.pingRequest?.host;

// Checking the type and length
  if (!host || typeof host !== "string") {
    return sendXML(res, 400, { success: false, message: "Host is required." });
  }
 
  const cleanHost = host.trim();
 
  if (cleanHost.length > 255) {
    return sendXML(res, 400, { success: false, message: "Host is too long." });
  }
 
// Final Verification
  if (!isValidHost(cleanHost)) {
    return sendXML(res, 400, { success: false, message: "Invalid hostname or IP address." });
  }
 
  try {
// Only after successful verification is the host sent to the ping service.
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