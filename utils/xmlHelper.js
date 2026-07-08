const { XMLParser } = require("fast-xml-parser");
const { create } = require("xmlbuilder2");
 
// Secure parser configuration:
// - processEntities: false -> disables entity expansion entirely, which is the
//   root cause of classic XXE and "billion laughs" style entity-bomb attacks.
// - ignoreAttributes: true -> we don't need attributes for this simple payload,
//   reducing parser surface area.
const parser = new XMLParser({
  ignoreAttributes: true,
  processEntities: false,
  allowBooleanAttributes: false,
});
 
// Defense in depth: fast-xml-parser does not resolve external entities/DTDs by
// default, but we explicitly reject any DOCTYPE/ENTITY declaration before the
// payload ever reaches the parser. This blocks XXE and entity-expansion
// payloads outright, independent of parser library behavior/version.
const DOCTYPE_PATTERN = /<!DOCTYPE/i;
const ENTITY_PATTERN = /<!ENTITY/i;
 
function parseXML(xml) {
  if (typeof xml !== "string" || xml.length === 0) {
    throw new Error("Invalid XML payload.");
  }
 
  if (DOCTYPE_PATTERN.test(xml) || ENTITY_PATTERN.test(xml)) {
    throw new Error("DOCTYPE/ENTITY declarations are not allowed.");
  }
 
  return parser.parse(xml);
}
 
// xmlbuilder2 escapes text content automatically, which prevents XML
// injection when echoing values (e.g. the requested host) back to the client.
function buildXML(rootName, data) {
  return create({ version: "1.0", encoding: "UTF-8" })
    .ele({ [rootName]: data })
    .end({ prettyPrint: true });
}
 
module.exports = { parseXML, buildXML };