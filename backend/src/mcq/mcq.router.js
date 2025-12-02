const express = require("express");
const { saveMultipleMCQs } = require("./mcq.controller");
const router = express.Router();

router.post("/save-multiple", saveMultipleMCQs);

module.exports = router;
