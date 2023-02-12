const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const session = require("express-session");


app.use(cors(
  {origin: "http://localhost:3000",
  credentials: true}
  
));
app.use(express.json());


app.use(session({
  secret: "abcd",
  resave: true,
  saveUninitialized: true,

}));

app.post("/login", async (req, res) => {
  // Replace this with your actual authentication logic
  const { username, password } = req.body;
  console.log(username, password)
  if (password==="password") {
    req.session.user =  username ;
    console.log("username ",req.session.user)
    res.status(200).json({ username });
  } else {
    res.status(401).send("Unauthorized");
  }
});



//get a todo
app.get('/course/:course_id', async (req, res) => {
  try {
    const { course_id } = req.params;
    if (course_id != 'running') {

      const course_info = await pool.query('SELECT * FROM course WHERE course_id = $1', [course_id]);
      const course_prereq = await pool.query('SELECT prereq_id FROM prereq WHERE course_id = $1', [course_id]);
      const course_instructor = await pool.query('with new as (select year, semester from reg_dates where start_time<NOW() order by year desc,semester desc limit 1   )     SELECT instructor.id,name,teaches.year,teaches.semester FROM (teaches NATURAL JOIN instructor),new  WHERE course_id = $1 and teaches.year<=new.year order by teaches.year desc ,teaches.semester desc  ', [course_id]);
      //send all the info to the front end
      res.json({ 'course_info': course_info.rows, 'course_prereq': course_prereq.rows, 'course_instructor': course_instructor.rows });
    }
    else {
      const course_info = await pool.query('with new as (select year, semester from reg_dates where start_time<NOW() order by year desc, semester desc limit 1   )SELECT distinct dept_name FROM (course NATURAL JOIN teaches),new where  teaches.year=new.year and teaches.semester=new.semester ');
      res.json(course_info.rows);
    }
  }

  catch (err) {
    console.error(err.message);
  }
});

app.get('/course/running/:dept_name', async (req, res) => {
  try {
    const { dept_name } = req.params;
    const course_info = await pool.query('with new as (select year, semester from reg_dates where start_time<NOW() order by year desc, semester desc limit 1   )SELECT teaches.course_id,title FROM (course NATURAL JOIN teaches),new where  dept_name= $1 and teaches.year=new.year and teaches.semester=new.semester ', [dept_name]);
    res.json(course_info.rows);
  }
  catch (err) {
    console.error(err.message);
  }
});

app.get('/home', async (req, res) => {
  try {
  const user = req.session.user;
  const user_info = await pool.query('SELECT * FROM student WHERE id = $1', [user]);
  const current = await pool.query('with new as (select year, semester from reg_dates where start_time<NOW() order by year desc, semester desc limit 1   )SELECT takes.course_id,title,takes.grade,takes.year,takes.semester FROM (takes NATURAL JOIN course),new WHERE id = $1 and takes.year=new.year and takes.semester=new.semester ', [user]);
  //const prev = await pool.query('with new as (select year, semester from reg_dates where start_time<NOW() order by year desc, semester desc limit 1   )(select takes.course_id,title,takes.year,takes.semester from (takes NATURAL JOIN course),new where takes.year<=new.year and id=$1 except SELECT takes.course_id,title,takes.year,takes.semester from (takes NATURAL JOIN course),new WHERE id = $1 and takes.year=new.year and takes.semester=new.semester) order by year desc ,semester desc  ', [user]);
 //const prev = await pool.query('with new as (select year,semester from reg_dates where start_time<NOW() order by year desc ,semester desc limit 1)(select * from((select takes.course_id,title,takes.grade,takes.year,takes.semester from (takes NATURAL JOIN course),new where takes.year<=new.year and id=$1) except (SELECT takes.course_id,title,takes.grade,takes.year,takes.semester FROM (takes NATURAL JOIN course),new WHERE id = $1 and takes.year=new.year and takes.semester=new.semester) ) )order by takes.year desc , takes.semester desc  ', [user]);
 const prev = await pool.query('with new as (select year,semester from reg_dates where start_time<NOW() order by year desc ,semester desc limit 1)(select takes.course_id,title,takes.grade,takes.year,takes.semester from (takes NATURAL JOIN course),new where takes.year<=new.year and id=$1) except (SELECT takes.course_id,title,takes.grade,takes.year,takes.semester FROM (takes NATURAL JOIN course),new WHERE id = $1 and takes.year=new.year and takes.semester=new.semester) order by year desc ,semester desc', [user]); 
 
 res.json({ 'user_info': user_info.rows, 'current': current.rows,'prev':prev.rows });
  
  }
  catch (err) {
    console.error(err.message);
  }
});

  
app.get('/instructor/:instructor_id', async (req, res) => {
  try {
    const { instructor_id } = req.params;
    console.log('shvfh',instructor_id);
    const instructor_info = await pool.query('SELECT name,dept_name FROM instructor WHERE id = $1', [instructor_id]);
    const instructor_course = await pool.query('with new as (select year, semester from reg_dates where start_time<NOW() order by year desc, semester desc limit 1   )SELECT course_id,title from (teaches NATURAL JOIN course),new WHERE id = $1 and teaches.year=new.year and teaches.semester=new.semester ', [instructor_id]);
    const course_prev = await pool.query('with new as (select year, semester from reg_dates where start_time<NOW() order by year desc, semester desc limit 1   )(select course_id,title, teaches.year,teaches.semester from (teaches NATURAL JOIN course),new where teaches.year<=new.year and id=$1 except SELECT course_id,title,teaches.year,teaches.semester from (teaches NATURAL JOIN course),new WHERE id = $1 and teaches.year=new.year and teaches.semester=new.semester) order by year desc ,semester desc  ', [instructor_id]);
    
    res.json({ 'instructor_info': instructor_info.rows, 'instructor_course': instructor_course.rows,'course_prev':course_prev.rows });

  }
  catch (err) {
    console.error(err.message);
  }
});




app.post('/home/drop', async (req, res) => {
  try {
    console.log(req.body);
    const course_id  = req.body.course_id;
    const year  = req.body.year;
    const semester  = req.body.semester;
    const user = req.session.user;
    console.log(user,course_id,year,semester)
    const deleteTodo = await pool.query('DELETE FROM takes WHERE id = $1 AND course_id = $2 AND year = $3 AND semester = $4', [
      user, course_id, year, semester
      
    ]);
    res.status(200).json('Todo was deleted!');
    console.log("deleted");
  }
  catch (err) {
    console.error(err.message);
  }
});










app.listen(5000, () => {
  console.log('Server is running on port 5000');
});