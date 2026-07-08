const validateHost = (req, res, next) => {
  const { host } = req.body;

  // Check if host exists
  if (!host) {
    return res.status(400).json({
      success: false,
      message: "Host is required."
    });
  }

  // Remove extra spaces
  const cleanHost = host.trim();

  // Prevent very long input
  if (cleanHost.length > 255) {
    return res.status(400).json({
      success: false,
      message: "Host is too long."
    });
  }

  // Allow only letters, numbers, dots and hyphens
  const hostRegex = /^[a-zA-Z0-9.-]+$/;

  if (!hostRegex.test(cleanHost)) {
    return res.status(400).json({
      success: false,
      message: "Invalid hostname or IP address."
    });
  }

  // Save cleaned value
  req.body.host = cleanHost;

  next();
};

module.exports = {
  validateHost,
};