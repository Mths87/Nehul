const express = require("express");
const router = express.Router();

const ADMIN = {
  email: "admin@nehul.com",
  password: "123456"
};

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN.email && password === ADMIN.password) {
    return res.json({ token: "admin-token" });
  }

  res.status(401).json({ error: "Credenciais inválidas" });
});

module.exports = router;