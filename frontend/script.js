const button = document.getElementById("checkBtn");

const escapeXml = (str) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

button.addEventListener("click", async () => {
  const hostInput = document.getElementById("host").value.trim();
  const resultDiv = document.getElementById("result");

  if (!hostInput) {
    resultDiv.textContent = "Please enter a host.";
    return;
  }
// The format in which the data is sent
  const xmlBody = `<?xml version="1.0" encoding="UTF-8"?><pingRequest><host>${escapeXml(
    hostInput
  )}</host></pingRequest>`;

  try {
  // The interface send the POST request to /api/ping, It explains that the data type is XML.
    const response = await fetch("http://localhost:3000/api/ping", {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
      },
      body: xmlBody,
    });

    const xmlText = await response.text();

// I use DOMParser to read it, Then show whether the host is reachable or not reachable.
    const xmlDoc = new DOMParser().parseFromString(
      xmlText,
      "application/xml"
    );

    const parserError = xmlDoc.querySelector("parsererror");

    if (parserError) {
      resultDiv.textContent = "Invalid XML response.";
      return;
    }

    const message = xmlDoc.querySelector("message")?.textContent;
    const returnedHost = xmlDoc.querySelector("host")?.textContent;
    const reachable = xmlDoc.querySelector("reachable")?.textContent;

    if (message) {
      resultDiv.textContent = message;
    } else if (reachable === "true") {
      resultDiv.textContent = `${returnedHost} is reachable.`;
    } else if (reachable === "false") {
      resultDiv.textContent = `${returnedHost} is not reachable.`;
    } else {
      resultDiv.textContent = "Unexpected response.";
    }
  } catch (err) {
    resultDiv.textContent = "Unable to reach the server.";
  }
});