//const express = require("express");
//const multer = require("multer");
//const cloudinary = require("../config/cloudinary");

//const router = express.Router();
//const upload = multer({ dest: "uploads/" });

//router.post("/", upload.single("file"), async (req, res) => {
  //try {
    //const result = await cloudinary.uploader.upload(req.file.path, {
      //resource_type: "auto"
    //});

    //res.json({ url: result.secure_url });
  //} catch (err) {
    //res.status(500).json({ error: err.message });
  //}
//});

//module.exports = router;

const express = require("express");
const router = express.Router();
const Project = require("../Models/Project");

// criar projeto
router.post("/", async (req, res) => {
  const project = new Project(req.body);
  await project.save();
  res.json(project);
});

// listar projetos
router.get("/", async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

module.exports = router;