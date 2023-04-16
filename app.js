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


app.listen(3000, () => {
    console.log("Server started on port 3000.");
  });