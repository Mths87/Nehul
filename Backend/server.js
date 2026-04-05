const express = require("express");

const app = express();

const projectRoutes = require("./Routes/projects");
app.use("/projects", projectRoutes);

const cors = require("cors");
app.use(cors());

app.get("/", (req, res) => {
  res.send("Servidor rodando 🚀");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});

const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado 🚀"))
  .catch(err => console.log(err));