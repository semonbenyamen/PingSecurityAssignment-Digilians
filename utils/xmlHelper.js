const { XMLParser } = require("fast-xml-parser");
// To build XML instead of manually constructing text
const { create } = require("xmlbuilder2");

const parser = new XMLParser({
  ignoreAttributes: true,
// The processing of entities was disabled, so that they could not be expanded or used to read files.
  processEntities: false,
  allowBooleanAttributes: false,
});
 

const DOCTYPE_PATTERN = /<!DOCTYPE/i;
const ENTITY_PATTERN = /<!ENTITY/i;
 
function parseXML(xml) {
  if (typeof xml !== "string" || xml.length === 0) {
    throw new Error("Invalid XML payload.");
  }
 
// As an added protection, any XML containing DOCTYPE or ENTITY is rejected before reaching the parser.
  if (DOCTYPE_PATTERN.test(xml) || ENTITY_PATTERN.test(xml)) {
    throw new Error("DOCTYPE/ENTITY declarations are not allowed.");
  }
 
  return parser.parse(xml);
}
 

function buildXML(rootName, data) {
  return create({ version: "1.0", encoding: "UTF-8" })
    .ele({ [rootName]: data })
    .end({ prettyPrint: true });
}
 
module.exports = { parseXML, buildXML };