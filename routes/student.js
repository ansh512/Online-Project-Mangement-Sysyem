

const express = require('express'),
    router = express.Router();
    multer = require('multer'),
    bodyParser = require('body-parser'),
    Admin = require(__dirname + "/../user_model/user_model3.js"),
    Courses = require(__dirname + "/../user_model/user_model4.js"),
    Student = require(__dirname + "/../user_model/user_model1.js"),
    Instructor = require(__dirname + "/../user_model/user_model2.js"),
    Assignment = require(__dirname +"/../user_model/user_model5.js"),
    Submissions = require(__dirname + "/../user_model/user_model6.js"),
    session = require('express-session');

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

async function getCoursesByStudentId(studentId) {
  try {
    // Find the student document based on the studentId
    const student = await Student.findById(studentId);

    // Find all the courses where the courseID matches the courseID in the student document
    const courses = [];
    for(let i = 0; i < student.courses.length; i++) {
      const course = await Courses.find({ courseID: student.courses[i] });
      if (course) {
        courses.push(course);
      }
    }
    // Return the list of courses
    return courses;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting courses by student id');
  }
}
      

router.get('/', async (req, res) => {
  try {
    const courses = await getCoursesByStudentId(req.session.userId);
    if (!Array.isArray(courses)) {
      courses = [courses];
    }

    res.render('sdashboard',{course: courses});
  } catch (error) {
    console.log(error);
    res.status(500).send('Error getting courses');
  }
});

router.get('/:id',(req, res) => {
  const courseId = req.params.id;
      Assignment.find({ courseID: courseId })
      .then((assignments) => {
      if (!Array.isArray(assignments)) {
        assignments = [assignments];
      }
    res.render('sassignments',{course:courseId,assignments: assignments});
    })
    .catch((error) => {
      console.log(error);
    })
});

router.get("/:cid/download/:id", async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await Assignment.findById(fileId);
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

router.post("/:cid/submit/:id", upload.single('file'),async (req, res) => {
  const assignmentID = req.params.id;
  const studentID = req.session.userId;
  const submissionDate = new Date();
  const path = req.body.path;
  const grade = req.body.grade;

  try {
    const newSubmission = new Submissions({
    assignmentID: assignmentID,
    studentID: studentID,
    submissionDate: submissionDate.toLocaleDateString(),
    path: req.file.path,
    grade: grade
  });
    const result = await newSubmission.save();
    res.redirect('/login/Student/'+ req.params.cid);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;

    

    

    


