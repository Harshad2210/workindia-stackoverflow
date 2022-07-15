const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const database = require("../config/database");
const db = database();

db.connect((err) => {
  if (err) {
    console.log("Error occured while connection to MySQL");
    throw err;
  }

  const createUserQuery =
    " CREATE TABLE IF NOT EXISTS user( uid INT AUTO_INCREMENT, username VARCHAR(260) NOT NULL, password VARCHAR(260) NOT NULL, dob DATETIME, isBlock BOOLEAN DEFAULT 0 ,  PRIMARY KEY (uid) ) ";

  db.query(createUserQuery, (err) => {
    if (err) console.log(err.message);
    console.log("User Table created");
  });

  const createQuesQuery =
    " CREATE TABLE IF NOT EXISTS questions(  qid INT AUTO_INCREMENT, uid INT NOT NULL, title VARCHAR(260) NOT NULL, body VARCHAR(260) NOT NULL, isBlock BOOLEAN DEFAULT 0 , tags JSON,  PRIMARY KEY (qid) ) ";

  db.query(createQuesQuery, (err) => {
    if (err) console.log(err.message);
    console.log("Question Table created");
  });

//   const createTagsQuery =
//     " CREATE TABLE IF NOT EXISTS tags(  tid INT , qid INT NOT NULL, tagName VARCHAR(260) NOT NULL, PRIMARY KEY (tid) , FOREIGN KEY (qid) REFERENCES questions(qid)  ) ";

//   db.query(createTagsQuery, (err) => {
//     if (err) console.log(err.message);
//     console.log("Tags Table created");
//   });

  console.log("MySQL Database connected.");
});

class stackoverflowController{
    registerUser = (req, res) => {
        const { username, password, dob } = req.body;
        if (!(username && password && dob)) {
          res.status(400).send("All fields are mandatory");
        }
    
        // check if user already exists
        const sql = `SELECT * FROM user WHERE username = ? `;
        db.query(sql, username, async (err, result) => {
          if (err) {
            console.log("Couldn't fetch user");
            throw err;
          }
          if (result[0] != null) {
            res.status(400).send("User already exist, please try login");
          } else {
            const newUser = `INSERT INTO user(username,password,dob) VALUES (?,?,?)`;
            const encryptedPassword = await bcrypt.hash(password, 10);
            
            db.query(newUser, [username,encryptedPassword, dob], (err) => {
              if (err) {
                console.log("Couldn't add user");
                throw err;
              }
              const sql = `SELECT * FROM user WHERE username = ? `;
              let uid ;
              db.query(sql, username, (err, result) => {
                if (err) {
                  console.log("Couldn't fetch user");
                  throw err;
                }
                uid = result[0].uid;
              });
              
              const token = jwt.sign({ username , uid }, process.env.TOKEN_KEY, {
                expiresIn: "23h",
              });
              console.log(token);
              const user = { username , dob , token }
              res.json({ message : "User registered succesfully" , data : user  });
            });
          }
        });
      };
    
    addQuestion = (req,res) => {
        const {  question_title , question_body , tags } = req.body ;
        const uid = 1 ; // fetch from jwt token later
        const sql = ' INSERT INTO questions (title,body,uid,tags) VALUES (?,?,?,?) ';
        db.query(sql,  [JSON.stringify(question_title),JSON.stringify(question_body),uid,JSON.stringify(tags)] , (err) => {
            if (err) console.log(err.message);
            const data = req.body;
            res.send( {
                message : ` Succesfully added question `,
                data : req.body
            } )
          });
          
    }
}

module.exports = new stackoverflowController();