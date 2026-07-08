const express = require("express");
const router = express.Router();
 
const { pingHost } = require("../controllers/pingController");
 
router.post("/ping", pingHost);
 
module.exports = router;