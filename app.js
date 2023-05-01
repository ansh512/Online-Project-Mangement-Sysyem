const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer');
const bodyParser = require('body-parser');

const loginRoutes = require('./routes/login');

mongoose.connect("mongodb://localhost:27017/TuLabsDB", { useNewUrlParser: true });

const app = express();
app.use(session({
    secret: 'myappsecret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }
  }));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/Public'));
app.use(express.static(__dirname + '/views'));



app.use("/login", loginRoutes);

app.get('/logout', (req, res) => {
  // Invalidate the user's session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    } else {
      // Redirect the user to a login page or another appropriate destination
      res.redirect('/login');
    }
  });
});



app.listen(3000, () => {
    console.log("Server started on port 3000.");
  });