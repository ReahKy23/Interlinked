const express = require("express");
const multer = require("multer");
const nunjucks = require("nunjucks");
const nedb = require("@seald-io/nedb");
const cookieParser = require("cookie-parser");

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

app.use(cookieParser());

// routes
app.get("/", (req, res) => {
  //if there's a cookie, don't make another one, if there isn't, make one
  if(req.cookies.visits){
    let visits = req.cookies.visits
    console.log(req.cookies.visits)
    res.cookie("visits", visits, {
      //cookie lasts for 10 hours
      expires: new Date(Date.now() + 1000 * 600 * 60)
    })
    //res.redirect("/map")
  } else {
        //3 params:
        //1. name of cookie stored
        //2. init val you want to assign
        //3rd: when the cookie expires, in obj format
        let oneHrInMs = 1000 * 600 * 60
        res.cookie("visits", 1, {
            expires: new Date(Date.now() + oneHrInMs)
        })
    }
    res.render("index.njk")
})

app.get("/form", (req, res) => {
  res.render("form.njk")
})

app.post("/sign", upload.single("image"), (req, res) => {

  let newData = {
    filePath: "uploads/" + req.file.filename,
    name: req.body.userName,
    imgDesc: req.body.description,
    categories: [req.body.firstChoice, req.body.secondChoice]
  }

  console.log(newData)
  database.insert(newData)
  res.redirect("/map")

})

app.get("/map", (req, res) => {
  res.render("map.njk")

})

app.get("/data", (req,res) => {
  let query = {}
  database.find(query, (err, foundData) => {
    res.json({newData: foundData})
  })
})

// port listening
app.listen(7001, () => {
  console.log("server is running on port http://localhost:7001")
})
