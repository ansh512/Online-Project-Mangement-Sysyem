const mongoose = require('mongoose');

const courseScheam = new mongoose.Schema({
  CourseID: String,
  Name: String,
  Instructor: String
});

module.exports = mongoose.model('Course', courseScheam);
