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
 
  const xmlBody = `<?xml version="1.0" encoding="UTF-8"?><pingRequest><host>${escapeXml(
    hostInput
  )}</host></pingRequest>`;
 
  try {
    const response = await fetch("http://localhost:3000/api/ping", {
      method: "POST",
      headers: { "Content-Type": "application/xml" },
      body: xmlBody,
    });
 
    const xmlText = await response.text();
 
    // Browsers' XML DOMParser does not fetch external DTDs/entities over the
    // network, so this is safe to parse client-side.
    const xmlDoc = new DOMParser().parseFromString(xmlText, "application/xml");
    const message = xmlDoc.querySelector("message")?.textContent || "Unexpected response.";
 
    resultDiv.textContent = message;
  } catch (err) {
    resultDiv.textContent = "Unable to reach the server.";
  }
});