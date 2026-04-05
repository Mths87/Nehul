// middleware/auth.js
module.exports = function (req, res, next) {
  const token = req.headers.authorization;

  if (token === "admin-token") {
    next();
  } else {
    res.status(403).json({ error: "Acesso negado" });
  }
};