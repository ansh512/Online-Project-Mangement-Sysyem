const mongoose = require('mongoose');
const Student = require(__dirname + "/../user_model/user_model1.js");
const Instructor = require(__dirname + "/../user_model/user_model2.js");

const announcementSchema = new mongoose.Schema({
  assignmentID: {
    type: String,
    ref: 'Course',
    required: true
  },
  announcement: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
});

const Announcements = mongoose.model('Announcement', announcementSchema);
module.exports = Announcements;
