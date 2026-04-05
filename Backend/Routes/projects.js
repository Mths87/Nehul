const express = require("express");
const router = express.Router();
const Project = require("../Models/Project");
const auth = require("../middleware/auth");

// 🔐 criar projeto (somente admin)
router.post("/", auth, async (req, res) => {
  const project = new Project(req.body);
  await project.save();
  res.json(project);
});

// 📄 listar projetos (público)
router.get("/", async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

module.exports = router;

const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const project = new Project(req.body);
  await project.save();
  res.json(project);
});