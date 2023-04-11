const mongoose = require('mongoose');
const Courses = require(__dirname + "/user_model2.js");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  roll: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  courses: [{
    type: String,
    ref: 'Courses',
    localField: 'courses',
    foreignField: 'courseID',
    // validate: {
    //   validator: async function(courses) {
    //     console.log('Validating courses:', courses);
    //     if (!Array.isArray(courses)) {
    //       courses = [courses];
    //     }
    //     const promises = courses.map(courseID => {
    //       console.log('Looking up course with ID:', courseID);
    //       return Courses.findOne({ courseID: courseID }).exec().then(course => {
    //         console.log('Found course:', course);
    //         return course !== null;
    //       });
    //     });
  
    //     return Promise.all(promises).then(results => {
    //       console.log('Validation results:', results);
    //       return results.every(result => result === true);
    //     });
    //   },
    //   message: 'Invalid course ID: {VALUE}',
    // },
  }]

});

module.exports = mongoose.model('Student', studentSchema);
