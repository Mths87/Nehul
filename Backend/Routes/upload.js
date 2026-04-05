const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  res.json({ message: "Upload ainda não implementado" });
});

module.exports = router;