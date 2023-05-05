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

async function getStudentByStudentId(studentId) {
  try {
    // Find the student document based on the studentId
    const student = await Student.findById(studentId);

    return student;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting courses by student id');
  }
}

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
    const User = await getStudentByStudentId(req.session.userId);
    const courses = await getCoursesByStudentId(req.session.userId);
    if (!Array.isArray(courses)) {
      courses = [courses];
    }

    res.render('sdashboard',{user:User.email,course: courses});
  } catch (error) {
    console.log(error);
    res.status(500).send('Error getting courses');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    const User = await getStudentByStudentId(req.session.userId);
    let assignments = await Assignment.find({ courseID: courseId });
    if (!Array.isArray(assignments)) {
      assignments = [assignments];
    }
    const pending = [];
    for (let i = 0; i < assignments.length; i++) {
      const result = await Submissions.findOne({ assignmentID: assignments[i]._id });
      if (!result) {
        pending.push(assignments[i]);
      }
    }
    res.render('sassignments', { user: User.email, course: courseId, assignments: pending });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error getting assignments');
  }
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

router.get("/:cid/submissions", async (req, res) => {
  try {
    const courseId = req.params.cid;
    const User = await getStudentByStudentId(req.session.userId);
    const assignments = await Submissions.find({ studentID: req.session.userId });
    if (assignments.length === 0) {
      assignments.push({ name: "NO SUBMISSIONS", grade: "😔" });
    }

    submitted = [];
    for (let i = 0; i < assignments.length; i++) {
      const result = await Assignment.findOne({ _id: assignments[i].assignmentID });
      let submit = new Object();
      submit.name = result.title;
      submit.date = assignments[i].submissionDate < result.issuedDate ? "Submitted" : "Late Submission";
      submit.grade = result.grade === null || result.grade === undefined ? "Not Graded" : result.grade;
      submitted.push(submit);
      console.log(result.grade);
    }
    console.log(submitted);
    res.render("submission", { user: User.email, course: courseId, assignment: submitted });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error getting submissions');
  }
});

// router.get("/:cid/reports", async(req, res) => {
//   try{
    
//   }
// })

module.exports = router;

    

    

    


