const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  courseID: {
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
