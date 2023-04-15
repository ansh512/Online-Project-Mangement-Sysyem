const mongoose = require('mongoose');
const Courses = require(__dirname + "/user_model2.js");

const assignmentSchema = new mongoose.Schema({
  courseID: {
    type: String,
    ref: 'Courses',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  issuedDate: {
    type: String,
    required: true,
  },
  submissionDate: {
    type: Date,
    required: true,
  },
  points: {
    type:  Number,
    required: true,
  }
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
