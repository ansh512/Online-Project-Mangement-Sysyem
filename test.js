const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const XLSX = require('xlsx');
const Courses = require(__dirname + "/user_model/user_model2.js");
const Students = require(__dirname + "/user_model/user_model3.js");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/assignmentDB", { useNewUrlParser: true });

app.use(express.static(__dirname + '/Public'));
app.use(express.static(__dirname + '/views'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'admin_uploads/');
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.send("COMING SOON");
});
app.get('/edit_students', (req, res) => {
  Students.find({}, function(err, allStudents){
    if(err){
      console.log(err);
    }else{
      Courses.find({}, function(err, allCourses){
        if(err){
          console.log(err);
        }else{
          res.render("admin3",{course: allCourses,student:allStudents});
        }
      });
    }
  });
});
app.get('/edit_courses', (req, res) => {
  Courses.find({}, function(err, allCourses){
    if(err){
      console.log(err);
    }else{
      res.render("admin2",{allCourses:allCourses,course:allCourses});
      }
  });
});

app.get('/edit_courses/:id', (req, res) => {
  Courses.findById(req.params.id, (err, item)  => {
    if (err) console.log(err);
    res.json(item);
  });
});
app.get('/edit_students/:id', (req, res) => {
  Students.findById(req.params.id, (err, item)  => {
    if (err) console.log(err);
    res.json(item);
  });
});


// app.get('/report', (req, res) => {
//   res.send("This is the Submission Reports page");
// });
// //
//
app.post('/edit_courses', upload.single('excel'), async (req, res) => {
    // Insert file into MongoDB
    console.log(req.body.options);
    // if(req.body.options === 'upload' || req.body.options === ""){
    //   try{
    //   const workbook = XLSX.readFile(__dirname+ '/admin_uploads/' + req.file.originalname);
    //   const sheet_name_list = workbook.SheetNames;
    //   const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    //
    //   const result = await Courses.insertMany(json);
    //       console.log(`${result.length} documents were inserted into the collection`);
    //
    //     } finally {
    //       await res.redirect('/edit_courses');
    //       //await mongoose.connection.close();
    //     }
    //
    // }
    // else{
    //   if(req.body.options === 'add'){
    //     const newCourse = new Courses({
    //       CourseID: req.body.courseID,
    //       Name: req.body.name,
    //       Instructor: req.body.instructor
    //     });
    //     newCourse.save((error, result) => {
    //       if (error) {
    //         console.error(error);
    //       } else {
    //         res.redirect('/edit_courses');
    //       }
    //     });
    //   }
    //   else{
    //     const itemId = req.body.CourseOptions;
    //     const updatedItem = {
    //       CourseID: req.body.ucourseID,
    //       Name: req.body.uname,
    //       Instructor: req.body.uinstructor
    //     };
    //     console.log(updatedItem);
    //     Courses.findByIdAndUpdate(itemId, updatedItem, { new: true }, (err, item) => {
    //       if (err) console.log(err);
    //       res.redirect('/edit_courses');
    //     });
    //   }
    // }

});

app.post('/edit_students', upload.single('excel'), async (req, res) => {
    //Insert file into MongoDB
  if(req.body.options === 'upload' || req.body.options === ""){
    try{
    const workbook = XLSX.readFile(__dirname+ '/admin_uploads/' + req.file.originalname);
    const sheet_name_list = workbook.SheetNames;
    const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    for(let i = 0; i<json.length; i++){
      json[i].courses = json[i].courses.split(',');
    }

    const result = await Students.insertMany(json);
        console.log(`${result.length} documents were inserted into the collection`);

      } finally {
        await res.redirect('/edit_students');
        //await mongoose.connection.close();
      }
  }
  else{
    if(req.body.options === 'add'){
      const newStudent = new Students({
        name: req.body.name,
        roll_no: req.body.roll_no,
        courses:req.body.courses,
        semester: req.body.semester
      });
      newStudent.save((error, result) => {
        if (error) {
          console.error(error);
        } else {
          res.redirect('/edit_students');
        }
      });
    }
    else{
      const itemId = req.body.StudentOptions;
      const updatedItem = {
        name: req.body.uname,
        roll_no: req.body.uroll_no,
        courses:req.body.ucourses,
        semester: req.body.usemester
      };
      console.log(updatedItem);
      Student.findByIdAndUpdate(itemId, updatedItem, { new: true }, (err, item) => {
        if (err) console.log(err);
        res.redirect('/edit_students');
      });
    }
  }


});



app.listen(3000, () => {
  console.log("Server started on port 3000.");
});
