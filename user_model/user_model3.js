const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({

  name: String,
  roll_no: String,
  courses:{
    type: [String],
    required: true
  },
  semester: Number

});

module.exports = mongoose.model('Student', studentSchema);
