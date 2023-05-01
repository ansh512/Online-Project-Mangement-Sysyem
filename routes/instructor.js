const express = require('express');
const router = express.Router();
const multer = require('multer');
const bodyParser = require('body-parser');
const Courses = require(__dirname + "/../user_model/user_model4.js");
const Student = require(__dirname + "/../user_model/user_model1.js");
const Instructor = require(__dirname + "/../user_model/user_model2.js");
const Submissions = require(__dirname + "/../user_model/user_model6.js");
const Assignment = require(__dirname + "/../user_model/user_model5.js");
const Announcements = require(__dirname + "/../user_model/user_model5.js");
const session = require('express-session');

router.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({storage:storage});

async function getInstrcutorByInstructorId(instructorId) {
  try {
    // Find the instructor document based on the instructorId
    const instructor = await Instructor.findById(instructorId);
    return instructor;
    
  } catch (error) {
    console.log(error);
    throw new Error('Error getting instructor by instructor id');
  }
}
async function getCoursesByInstructorId(instructorId) {
  try {
    // Find the instructor document based on the instructorId
    const instructor = await Instructor.findById(instructorId);

    // Find all the courses where the instructor name matches the instructor name in the instructor document
    const courses = await Courses.find({ instructor: instructor.name });

    return courses;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting courses by instructor id');
  }
}

//Instructor dashboard route
router.get('/', async (req, res) => {
  try {
    const User = await getInstrcutorByInstructorId(req.session.userId);
    const courses = await getCoursesByInstructorId(req.session.userId);
    if (!Array.isArray(courses)) {
      courses = [courses];
    }

    res.render('idashboard',{user:User.email,course: courses});
  } catch (error) {
    console.log(error);
    res.status(500).send('Error getting courses');
  }
});

//Post Assignment route
router.get('/:id', async (req, res)=>{
  try{
    const courseId = req.params.id;
    const User = await getInstrcutorByInstructorId(req.session.userId);
    res.render('iassignments',{user: User.email,course: courseId});
  }catch(error){
    console.log(error);
    res.status(500).send('Internal server error');
  }
});

//Grade route
router.get('/:id/grade', async (req, res) => {
  try {
    const courseId = req.params.id;
    const User = await getInstrcutorByInstructorId(req.session.userId);
    const assignments = await Assignment.find({ courseID: courseId });
    const submissions = [];
    for (let i = 0; i < assignments.length; i++) {
      const submission = await Submissions.find({ assignmentID: assignments[i]._id });
      if (submission) {
        submissions.push(submission);
      }
    }

    // Loop through the submissions array and add student name to each submission object
    for (let i = 0; i < submissions.length; i++) {
      for (let j = 0; j < submissions[i].length; j++) {
        const studentId = submissions[i][j].studentID;
        const assignmentId = submissions[i][j].assignmentID;
        const student = await Student.findOne({ _id: studentId });
        const assignment = await Assignment.findOne({_id: assignmentId});
        submissions[i][j].RollNo = student ? student.roll : 'Unknown';
        submissions[i][j].type = assignment.submissionDate > submissions[i][j].submissionDate ? 'On time' : 'Late submission';
      }
    }
    res.render('igrade', { user: User.email,course: req.params.id, assignment: assignments, submission: submissions });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
});

//Post assignment
router.post('/:id/assignment', upload.single('pdf'), async (req, res) => {
  const courseID = req.body.courseID;
  const title = req.body.title;
  const currDate = new Date();
  const date = req.body.submissionDate;
  const points = req.body.points;

  try {
    const newAssignment = new Assignment({
      courseID: courseID,
      title: title,
      path: req.file.path,
      issuedDate: currDate.toLocaleDateString(),
      submissionDate: date,
      points: points
    });
    const result = await newAssignment.save();
    res.redirect('/login/Instructor/'+ req.params.id);
  } catch (error) {
    console.error(error);
  }
});

// download submitted assignment
router.get("/:cid/download/:sid", async (req, res) => {
  try {
    const fileId = req.params.sid;
    const file = await Submissions.findById(fileId);
    if (!file) {
      return res.status(404).send('File not found');
    }
    const filePath = file.path;
    const filename = file.name; // Optional filename
    res.download(filePath, filename);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

//announcement
router.get("/:cid/announcement", async (req, res)=>{
  try{
    const announcements = await Announcements({courseID: req.params.cid})
    res.render('iannouncement', {announcement:announcements});
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
})

// assign grade
router.post("/:id/submit/:sid", async (req, res) => {
  try {
    const Grade = req.body.grade;
    const result = await Submissions.updateOne({ _id: req.params.sid }, { grade: Grade  });
    console.log(result);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user grade");
  }
});


//report route
router.get('/:id/report', async (req, res) => {
  try{
    const User = await getInstrcutorByInstructorId(req.session.userId);
    const assignments = await Assignment.find({ courseID:req.params.id});
    const students = await Student.find({courses:{$in:[req.params.id]}});
    res.render("ireport", {course: req.params.id, user: User.email,totalAssignment:assignments.length,totalStudent:students.length,students:students});
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});


router.get('/:cid/data', async (req, res) => {
  try {
    const courseId = req.params.cid;
    const assignments = await Assignment.find({ courseID: courseId });
    
    const submissionData = [];
    for (const assignment of assignments) {
      const submissions = await Submissions.find({ assignmentID: assignment._id });
      submissionData.push(submissions.length );
    }

    const labels = assignments.map(assignment => assignment.title);

    const data = {
      labels: labels,
      data: submissionData
    };

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
});

router.get('/:cid/data/:id', async (req, res) => {
  try {
    const courseId = req.params.cid;
    console.log(courseId);
    const assignments = await Assignment.find({ courseID: courseId });
    
    let submissionData = new Array(3);
    for (const assignment of assignments) {
      const submissions = await Submissions.findOne({studentID: req.params.id});
      if(submissions.submissionDate <= assignments.submissionDate){
        submissionData[0]++;
      }else if(submissions.submissionDate > assignments.submissionDate){
        submissionData[1]++;
      }else{
        submissionData[2]++;
      }
    }
    const labels = ["submitted","late submission","pending"];
    const data = {
      labels: labels,
      data: submissionData
    };
    console.log(data);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
});



module.exports = router;