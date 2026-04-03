const express = require("express");

const app = express();

const uploadRoutes = require("./Routes/upload");

const cors = require("cors");
app.use(cors());

app.use("/upload", uploadRoutes);

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