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

const pingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: "<pingResponse><success>false</success><message>Too many requests. Try again shortly.</message></pingResponse>",
});

app.use(
  express.text({
    type: ["application/xml", "text/xml"],
    limit: "2kb",
  })
);

app.use("/api", pingLimiter, pingRoutes);

// FIXED: frontend is a sibling of server.js, not one level up
app.use(express.static(path.join(__dirname, "frontend")));

app.get("/", (req, res) => {
  res.send("Ping Security Assignment API is Running");
});

app.use((err, req, res, next) => {
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