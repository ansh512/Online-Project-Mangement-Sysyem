const mongoose = require('mongoose');
const Courses = require(__dirname + "/user_model2.js");

const assignmentSchema = new mongoose.Schema({
  courseID: {
    type: String,
    ref: 'Courses',
    required: true,
    validate: {
      validator: function(value) {
          return Courses.findOne({courseID: value}).exec().then(course => {
            return course !== null;
          });
        },
        message: 'Invalid courseID: {VALUE}',    
    },
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
    type: Date,
    required: true,
  },
  submissionDate: {
    type: Date,
    required: true,
  },
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
