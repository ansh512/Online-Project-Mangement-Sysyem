const mongoose  = require('mongoose');

const submissionSchema = new mongoose.Schema({
  student:String,
  submission:Date
});

const assignmentSchema = new mongoose.Schema({
   // _id: {type: Number,unique: true, required: [true,"assifnment id is required"]},
  courseID: String,
  name: String,
  path: String,
  size: Number,
  issued_date: Date,
  submissionDate: Date,
  submission:submissionSchema
});

module.exports = mongoose.model('Assignment', assignmentSchema);
