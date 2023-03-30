const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const Assignment = require(__dirname + "/user_model/user_model1.js");
const User = require(__dirname + "/user_model/user_model4.js");
const Students = require(__dirname + "/user_model/user_model3.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/assignmentDB", { useNewUrlParser: true });

app.use(express.static(__dirname + '/Public'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

var items = [];


app.get("/login", function(req, res) {
   res.sendFile(__dirname + "/views/login.html");
});
app.get('/login/Admin', (req, res) => {
  res.send("COMING SOON");
});
app.get('/login/Instructor', (req, res) => {
  res.send("COMING SOON");
});
app.get('/login/Student', (req, res) => {
  const id = "641f40ee573ce28d6a1dde6f";
  const courses = [];
  Students.findOne({_id:id}, function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      for (let i = 0; i<foundUser.courses.length; i++) {
        courses.push(foundUser.courses[i]);
        }
        res.render('Sdashboard', { course: courses });
      }
    });
  });
app.get('/login/Instructor/assignment', (req, res) => {
  res.render("I_Assignment");
});
app.get('/login/Instructor/grade', (req, res) => {
  res.render("I_grade");
});
app.get('/login/Instructor/report', (req, res) => {
  res.send("This is the Submission Reports page");
});
app.get('/login/Student/announcement', (req, res) => {
  res.render("Sannouncement");
});
app.get('/login/Student/assignment',function(req,res){
  const id = "640ee1cd4e9f72d491008c48";
  Student.findOne({_id:id}, function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      for (let i = 0; i<foundUser.courses.length; i++) {
        Assignment.find({courseID:foundUser.courses[i]},function(err, foundUser1){
          if(err){
            console.log(err);
          }else{
            if(foundUser1.length>0){
              for(let i = 0; i<foundUser1.length; i++){
                let newItem = { "name": foundUser1[i].name,"submissionDate": foundUser1[i].submissionDate};
                items.push(newItem);
              }
            }
          }
        });
      }
      console.log(items);
    }
  })

  res.render("I_grade", {newListItems:items});
});

app.get('/login/Student/report', (req, res) => {
  res.send("This is the Submission Reports page");
});


app.post("/login", function(req,res){
  const username =  req.body.username;
  const password =  req.body.password;
  const user = req.body.user;

  User.findOne({email:username}, function(err, foundUser){
    if(err){
      res.send(err);
    }else{
      if(foundUser){
        if(foundUser.password === password && foundUser.permission === user){
          if(user === "admin")
          res.redirect("/login/Admin");
          if(user === "instructor")
          res.redirect("/login/Instructor");
          if(user === "student")
          res.redirect("/login/Student");
        }
        else{
          res.render('error', {message:"Incoorect password or Permission denied"});
        }
      }
      else{
        res.render('error',{message: "Your not a registered user ☹️ Conncet Admin."});
      }
    }
  });
});
app.post('/login/Instructor/assignment', upload.single('pdf'), async (req, res) => {
  const courseID = req.body.courseID;
  const title = req.body.title;
  const date = req.body.submissionDate;

    const NewAssignmet = new Assignment({
      courseID: courseID,
      name : title,
      path : req.file.path,
      size : req.file.size,
      issued_date: new Date(),
      submissionDate: date,
    });

    NewAssignmet.save(function(err, file) {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('File uploaded successfully');
  });
});



app.listen(3000, () => {
  console.log("Server started on port 3000.");
});
