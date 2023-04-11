const express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    bodyParser = require('body-parser'),
    Admin = require(__dirname + "/../user_model/user_model3.js"),
    Courses = require(__dirname + "/../user_model/user_model4.js"),
    Student = require(__dirname + "/../user_model/user_model1.js");
    Instructor = require(__dirname + "/../user_model/user_model2.js");
    session = require('express-session');

    router.use(bodyParser.urlencoded({ extended: true }));

    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'admin_uploads/');
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
        res.render('idashboard',{course: courses});
    })
    .catch((error) => {
      console.log(error);
    });
  
    //Convert courses to array if it is not
    if (!Array.isArray(courses)) {
        courses = [courses];
      }
});

//Assignment route
router.get('/assignments', (req, res)=>{
    res.render('iassignments');
})

router.post('/assignments', (req,res)=>{

    
})

module.exports = router;