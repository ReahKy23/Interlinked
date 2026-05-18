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
  if (req.cookies.visits) {
    let visits = req.cookies.visits;
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
  res.render("index.njk");
})

app.get("/form", (req, res) => {
  res.render("form.njk")
})

//route that handles form submission, which allows users to upload and image. after submitting, appends data to database
app.post("/sign", upload.single("image"), (req, res) => {

  //set up initial data to be inserted into database
  let newData = {
    filePath: "uploads/" + req.file.filename,
    name: req.body.userName,
    imgDesc: req.body.caption,
    categories: [req.body.firstChoice, req.body.secondChoice]
  }

  console.log(newData)

  //inserts newData into database
  database.insert(newData, function (err, newDoc) {
    if (err) {
      console.error(err)
    } else {
      //count how many occurences of each category in the database
      database.count({ categories: 'sadness' }, (err, sadnessCount) => {
        if (err) {
          console.error(err)
        }
        database.count({ categories: 'joy' }, (err, joyCount) => {
          if (err) {
            console.error(err)
          }
          database.count({ categories: 'fear' }, (err, fearCount) => {
            if (err) {
              console.error(err)
            }
            database.count({ categories: 'content' }, (err, contentCount) => {
              if (err) {
                console.error(err)
              }
              // newDoc is the newly inserted document, including its _id 
              database.update({
                //find id of the newly inserted data
                _id: newDoc._id
              },
                //adds the counts of each category to the document
                { $set: { sadnessCount, joyCount, fearCount, contentCount } }, {}, (err, numReplaced) => {
                  if (err) {
                    console.error(err)
                  }
                  res.redirect("/map")
                })
            }) //nested counts to ensure that before adding the counts to the database, we have the most updated counts of each category
          })
        })
      })
    }
  })
})

//route that finds one document based on id
app.get("/data/:id", (req, res) => {
  let query = {
    _id: request.params.id
  }
  database.findOne(query, (err, foundData) => {
    res.json(foundData)
  })
})

//route that renders the map page
app.get("/map", (req, res) => {
  res.render("map.njk")
})

//sends data to the front end via a json format
app.get("/data", (req, res) => {
  let query = {}
  database.find(query, (err, foundData) => {
    console.log(foundData)
    res.json({ newData: foundData })
  })
})

// port listening
app.listen(7001, () => {
  console.log("server is running on port http://localhost:7001")
})
