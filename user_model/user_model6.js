const mongoose = require('mongoose'),
    Student = require(__dirname + "/../user_model/user_model1.js"),
    Instructor = require(__dirname + "/../user_model/user_model2.js");

const submissionSchema = new mongoose.Schema({
  assignmentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  studentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  submissionID: {
    type: String,
    required: true
  },
  submissionDate: {
    type: Date,
    required: true
  }
});

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;
