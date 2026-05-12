const express = require("express");
const multer = require("multer");
const nunjucks = require("nunjucks");
const nedb = require("@seald-io/nedb");

const app = express();
const database = new nedb({ filename: "data.db", autoload: true });
const upload = multer({
  dest: "public/uploads",
});

// nunjucks templating
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "njk");
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

// routes
app.get("/", (req, res) => {
  res.render("index.njk")
})
app.get("/form", (req, res) => {
  res.render("form.njk")
})

app.post("/sign", upload.single("img"), (req, res) => {
  let options = req.body.options

  if(!options){
    options = []
  } else if (!Array.isArray(options)){
    options = [options];
  }

  let newData = {
    filePath: "'uploads/" + req.file.filename,
    imgDesc: req.body.description,
    options: options,

  }

  database.insert(newData)
  res.redirect("/map")

})
app.get("/map", (req, res) => {
  res.render("map.njk")
})

// port listening
app.listen(7001, () => {
  console.log("server is running on port http://localhost:7001")
})
