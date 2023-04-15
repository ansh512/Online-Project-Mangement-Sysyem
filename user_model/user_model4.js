const mongoose = require('mongoose');
const Instructor = require(__dirname + "/user_model2.js");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  courseID: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    ref: 'Instructor',
    required: true,
    validate: {
        validator: function(value) {
            return Instructor.findOne({name: value}).exec().then(course => {
              return course !== null;
            });
          },
          message: 'Invalid name: {VALUE}',    
      },
  },
});

module.exports = mongoose.model('Course', courseSchema);
