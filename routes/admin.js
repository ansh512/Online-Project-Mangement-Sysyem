const express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    XLSX = require('xlsx'),
    authMiddleware = require(__dirname + '/../middleware/middleware.js'),
    Admin = require(__dirname + "/../user_model/user_model3.js"),
    Courses = require(__dirname + "/../user_model/user_model4.js"),
    Student = require(__dirname + "/../user_model/user_model1.js");
    Instructor = require(__dirname + "/../user_model/user_model2.js");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'admin_uploads/');
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await Admin.findById(req.session.userId);
    if (!user) {
      res.status(401).send('Unauthorized');
    } else {
      res.render("adashboard");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

router.get('/edit_students', async (req, res) => {
    try {
      const allStudents = await Student.find({});
      const allCourses = await Courses.find({});
      res.render("editStudents", {course: allCourses, student: allStudents});
    } catch (err) {
      console.log(err);
    }
  });

  router.get('/edit_instructor', async (req, res) => {
    try {
      res.render("editInstructor");
    } catch (err) {
      console.log(err);
    }
  });
  
router.get('/edit_students/:id', async (req, res) => {
    try {
      const item = await Student.findById(req.params.id);
      res.json(item);
    } catch (err) {
      console.log(err);
    }
  });
  
router.get('/edit_courses', async (req, res) => {
    try {
      const allCourses = await Courses.find({});
      res.render("editCourses", {allCourses: allCourses, course: allCourses});
    } catch (err) {
      console.log(err);
    }
  });
  
router.get('/edit_courses/:id', async (req, res) => {
    try {
      const item = await Courses.findById(req.params.id);
      res.json(item);
    } catch (err) {
      console.log(err);
    }
  });

router.post('/edit_students', upload.single('excel'), async (req, res) => {

  if(req.body.options === 'upload' || req.body.options === ""){
    try{
    const workbook = XLSX.readFile(__dirname+ '/../admin_uploads/' + req.file.originalname);
    const sheet_name_list = workbook.SheetNames;
    const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    for(let i = 0; i<json.length; i++){
      json[i].courses = json[i].courses.split(',');
      if (!Array.isArray(json[i].courses)) {
        json[i].courses = [json[i].courses];
      }
    }

    // Validate and insert students into database
Promise.all(json.map(async (student) => {
  // Validate courses
  const validCourses = await Promise.all(student.courses.map(async (courseID) => {
    const course = await Courses.findOne({ courseID });
    return course !== null;
  }));

  if (validCourses.every((valid) => valid === true)) {
    // Insert student into database
    await Student.create(student);
    console.log(`Student ${student.name} inserted into database.`);
  } else {
    console.log(`Student ${student.name} has invalid courses.`);
  }
}));
    
      } finally {
        await res.redirect('/login/Admin/edit_students');
        //await mongoose.connection.close();
      }
  }
  else if(req.body.options === 'add'){
    try {
      const newStudent = new Student({
        name: req.body.name,
        roll: req.body.roll_no.toUpperCase(),
        email:req.body.email,
        password:req.body.password,
        courses:req.body.courses,
      });
    
      const result = await newStudent.save();
      res.redirect('/login/Admin/edit_students');
    } catch (error) {
      console.error(error);
    }
  }
    else{
      const itemId = req.body.StudentOptions;
      const updatedItem = {
        name: req.body.uname,
        roll: req.body.uroll_no.toUpperCase(),
        email:req.body.uemail,
        password:req.body.upassword,
        courses:req.body.ucourses,
      };
      console.log(updatedItem);
      Student.findByIdAndUpdate(itemId, updatedItem, { new: true })
      .then(item => {
        res.redirect('/login/Admin/edit_students');
      })
      .catch(err => {
        console.log(err);
      });   
    }
});
  
router.post('/edit_courses', upload.single('excel'), async (req, res) => {
    // Insert file into MongoDB
    console.log(req.body.options);
    if(req.body.options === 'upload' || req.body.options === ""){
      try{
      const workbook = XLSX.readFile(__dirname+ '/../admin_uploads/' + req.file.originalname);
      const sheet_name_list = workbook.SheetNames;
      const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    
      const result = await Courses.insertMany(json);
          console.log(`${result.length} documents were inserted into the collection`);
    
        } finally {
          await res.redirect('/login/Admin/edit_courses');
          await mongoose.connection.close();
        }
    
    }
    else if(req.body.options === 'add'){
      try {
        const newCourse = new Courses({
          courseID: req.body.courseID,
          name: req.body.name,
          instructor: req.body.instructor
        });
        const result = await newCourse.save();
        res.redirect('/login/Admin/edit_courses');
      } catch (error) {
        console.error(error);
      }
      
      }
      else{
        const itemId = req.body.CourseOptions;
        const updatedItem = {
          courseID: req.body.ucourseID,
          name: req.body.uname,
          instructor: req.body.uinstructor
        };
        console.log(updatedItem);
        
        Courses.findByIdAndUpdate(itemId, updatedItem, { new: true })
          .then(item => {
            res.redirect('/login/Admin/edit_courses');
          })
          .catch(err => {
            console.log(err);
          });        
      }
});

router.post('/edit_instructor', upload.single('excel'), async (req, res) => {

      try{
      const workbook = XLSX.readFile(__dirname+ '/../admin_uploads/' + req.file.originalname);
      const sheet_name_list = workbook.SheetNames;
      const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  
      const result = await Instructor.insertMany(json);
          console.log(`${result.length} documents were inserted into the collection`);
  
        } finally {
          await res.redirect('/login/Admin');
          await mongoose.connection.close();
        }

});

module.exports = router;