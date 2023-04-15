const express = require('express'),
    router = express.Router();
    multer = require('multer'),
    bodyParser = require('body-parser'),
    Admin = require(__dirname + "/../user_model/user_model3.js"),
    Courses = require(__dirname + "/../user_model/user_model4.js"),
    Student = require(__dirname + "/../user_model/user_model1.js");
    Instructor = require(__dirname + "/../user_model/user_model2.js");
    Submissions = require(__dirname + "/../user_model/user_model6.js");
    Assignment = require(__dirname + "/../user_model/user_model5.js");
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


async function getCoursesByInstructorId(instructorId) {
  try {
    // Find the instructor document based on the instructorId
    const instructor = await Instructor.findById(instructorId);

    // Find all the courses where the instructor name matches the instructor name in the instructor document
    const courses = await Courses.find({ instructor: instructor.name });

    // Return the list of courses
    return courses;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting courses by instructor id');
  }
}

//Instructor dashboard route
router.get('/', (req, res) => {
    var courses = getCoursesByInstructorId(req.session.userId)
    .then((courses) => {
      if (!Array.isArray(courses)) {
        courses = [courses];
      }
        res.render('idashboard',{course: courses});
    })
    .catch((error) => {
      console.log(error);
    });
});

//Assignment route
router.get('/:id', (req, res)=>{
    const courseId = req.params.id;
    res.render('iassignments',{course: courseId});
});

router.get('/:id/grade',(req, res) => {
  const courseId = req.params.id;
     Assignment.find({ courseID: courseId })
     .then((assignments) => {
      if (!Array.isArray(assignments)) {
        assignments = [assignments];
      }
      const submissions = [];
      for(let i = 0; i < assignments.length; i++) {
        const submission = Submissions.findOne({ assignmentID: assignments._id });
        if (submission) {
          submissions.push(submission);
        }
      }
    res.render('igrade',{course:req.params.id,assignment: assignments,submission:submissions});
    })
    .catch((error) => {
      console.log(error);
    })
});

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
    res.redirect('/login/Instructor/'+ + req.params.id+'/assignment');
  } catch (error) {
    console.error(error);
  }
});


//submit assignment
router.post('/:id/grade', (req,res) =>{


})


module.exports = router;