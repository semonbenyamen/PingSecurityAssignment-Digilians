const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const path = require("path");

const app = express();

const pingRoutes = require("./routes/pingRoutes");

app.use(helmet());

const allowedOrigin = process.env.ALLOWED_ORIGIN || "http://localhost:5500";
app.use(cors({ origin: allowedOrigin }));

// Each user is allowed 20 requests per minute.
const pingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: "<pingResponse><success>false</success><message>Too many requests. Try again shortly.</message></pingResponse>",
});

app.use(
// Express accepts XML as text, and the request is limited to two kilobytes to prevent sending a big payload.
  express.text({
    type: ["application/xml", "text/xml"],
    limit: "2kb",
  })
);

// Any request to /api first goes to the Rate Limiter, and then it goes to the routes.
app.use("/api", pingLimiter, pingRoutes);

app.use(express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
  res.send("Ping Security Assignment API is Running");
});

app.use((err, req, res, next) => {
// event of an unexpected error, details are recorded only within the server, and the user receives a general message to prevent Information Disclosure.
  console.error(err.stack);
  res
    .status(500)
    .type("application/xml")
    .send("<pingResponse><success>false</success><message>Internal server error.</message></pingResponse>");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});