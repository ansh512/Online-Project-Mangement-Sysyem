const express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser');
    session = require('express-session');
    Student = require(__dirname + "/../user_model/user_model1.js"),
    Admin = require(__dirname + "/../user_model/user_model3.js"),
    Instructor = require(__dirname + "/../user_model/user_model2.js"),
    adminRoutes = require(__dirname + '/admin'),
    instructorRoutes = require(__dirname + '/instructor'),
    studentRoutes = require(__dirname + '/student');

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req,res)=>{
  res.render("login");
});

router.post('/', (req,res) =>{
    const username =  req.body.username;
    const password =  req.body.password;
    const user = req.body.user;


    if (user === "admin") {
        Admin.findOne({ email: username, password: password })
          .exec()
          .then((foundUser) => {
            if (foundUser) {
              req.session.userId = foundUser._id;
              res.redirect("/login/Admin");
            } else {
              res.send("User not found");
            }
          })
          .catch((err) => {
            console.error(err);
            alert("An error occurred");
          });
      } else if (user === "instructor") {
        Instructor.findOne({ email: username, password: password })
          .exec()
          .then((foundUser) => {
            if (foundUser) {
              req.session.userId = foundUser._id;
              res.redirect("/login/Instructor");
            } else {
              res.send("User not found");
            }
          })
          .catch((err) => {
            console.error(err);
            res.send("An error occurred");
          });
      } else {
        Student.findOne({ email: username, password: password })
          .exec()
          .then((foundUser) => {
            if (foundUser) {
              req.session.userId = foundUser._id;
              res.redirect("/login/Student");
            } else {
              res.send("User not found");
            }
          })
          .catch((err) => {
            console.error(err);
            res.send("An error occurred");
          });
      }
      
  });

router.use('/admin',adminRoutes);
router.use('/instructor', instructorRoutes);
router.use('/student', studentRoutes);

module.exports = router;
