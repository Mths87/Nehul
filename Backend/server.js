const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());

// rotas
const projectRoutes = require("./Routes/projects");
const authRoutes = require("./Routes/auth");

app.use("/projects", projectRoutes);
app.use("/auth", authRoutes);

// rota teste
app.get("/", (req, res) => {
  res.send("Servidor rodando 🚀");
});

// banco
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado 🚀"))
  .catch(err => console.log(err));

// servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});