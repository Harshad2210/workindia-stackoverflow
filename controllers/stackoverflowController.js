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

  const createAnsQuery =
    " CREATE TABLE IF NOT EXISTS answers(  aid INT AUTO_INCREMENT, uid INT NOT NULL, qid INT NOT NULL,title VARCHAR(260) NOT NULL, body VARCHAR(260) NOT NULL, isBlock BOOLEAN DEFAULT 0 , PRIMARY KEY (aid) ) ";

  db.query(createAnsQuery, (err) => {
    if (err) console.log(err.message);
    console.log("Answer Table created");
  });


  console.log("MySQL Database connected.");
});

class stackoverflowController {
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

        db.query(newUser, [username, encryptedPassword, dob], (err) => {
          if (err) {
            console.log("Couldn't add user");
            throw err;
          }
          const sql = `SELECT * FROM user WHERE username = ? `;
          let uid;
          db.query(sql, username, (err, result) => {
            if (err) {
              console.log("Couldn't fetch user");
              throw err;
            }
            uid = result[0].uid;
          });

          const token = jwt.sign({ username, uid }, process.env.TOKEN_KEY, {
            expiresIn: "23h",
          });
          console.log(token);
          const user = { username, dob, token };
          res.json({ message: "User registered succesfully", data: user });
        });
      }
    });
  };

  addQuestion = (req, res) => {
    const { question_title, question_body, tags } = req.body;
    const uid = 1; // fetch from jwt token later
    const sql =
      " INSERT INTO questions (title,body,uid,tags) VALUES (?,?,?,?) ";
    db.query(
      sql,
      [question_title, question_body, uid, JSON.stringify(tags)],
      (err) => {
        if (err) console.log(err.message);
        const data = req.body;
        res.send({
          message: ` Succesfully added question `,
          data: req.body,
        });
      }
    );
  };

  getQuestions = (req, res) => {
    const tags = req.query.tags;
    const text = req.query.text;
    console.log(tags);

    if (text != null) {
      const textSearch = "SELECT * FROM questions WHERE title like ?  and  isBlock=0";
      db.query(textSearch, [`%${text}%`], (err, result) => {
        if (err) console.log(err.message);
        console.log(result[0]);
        res.send({
          message: ` Succesfully get all questions of respective text `,
          data: result,
        });
      });
    } else if (tags != null) {
      const tagSearch = "SELECT * FROM questions WHERE tags LIKE ? ";
      db.query(tagSearch, `%${tags}%`, (err, result) => {
        if (err) console.log(err.message);
        console.log(result[0]);
        res.send({
          message: ` Succesfully get all questions of respective tags `,
          data: result[0],
        });
      });
    }
  };

  addAnwers = (req, res) => {
    const { answer_title, answer_body} = req.body;
    const {qid} = req.params ;
    const uid = 1; // fetch from jwt token later
    const sql =
      " INSERT INTO answers (title,body,qid,uid) VALUES (?,?,?,?,?) ";
    db.query(
      sql,
      [answer_title, answer_body, qid,uid],
      (err) => {
        if (err) console.log(err.message);
        res.send({
          message: ` Succesfully added answer `,
          data: req.body,
        });
      }
    );
  };

  blockQuestion = (req,res) =>{
    const { qid } = req.params;
    const uid = 1; // fetch from jwt token later
    const sql =
      " UPDATE questions SET isBlock = 1 WHERE qid = ?  ";
    db.query(
      sql,
      [qid],
      (err) => {
        if (err) console.log(err.message);
        res.send({
          message: ` Succesfully blocked question `,
          data: req.body,
        });
      }
    );
  }

  unblockQuestion = (req,res) =>{
    const { qid } = req.params;
    const uid = 1; // fetch from jwt token later
    const sql =
      " UPDATE questions SET isBlock = 0 WHERE qid = ?  ";
    db.query(
      sql,
      [qid],
      (err) => {
        if (err) console.log(err.message);
        res.send({
          message: ` Succesfully unblocked question `,
          data: req.body,
        });
      }
    );
  }

  blockAnswer = (req,res) =>{
    const { aid } = req.params;
    const uid = 1; // fetch from jwt token later
    const sql =
      " UPDATE answers SET isBlock = 1 WHERE aid = ?  ";
    db.query(
      sql,
      [aid],
      (err) => {
        if (err) console.log(err.message);
        res.send({
          message: ` Succesfully blocked answer `,
          data: req.body,
        });
      }
    );
  }

  unblockAnswer = (req,res) =>{
    const { aid } = req.params;
    const uid = 1; // fetch from jwt token later
    const sql =
      " UPDATE answers SET isBlock = 0 WHERE aid = ?  ";
    db.query(
      sql,
      [aid],
      (err) => {
        if (err) console.log(err.message);
        res.send({
          message: ` Succesfully unblocked answer `,
          data: req.body,
        });
      }
    );
  }

  blockUser = (req,res) =>{
    const { uid } = req.params;
    const sql =
      " UPDATE answers SET isBlock = 1 WHERE uid = ?  ";
    db.query(
      sql,
      [uid],
      (err) => {
        if (err) console.log(err.message);
        res.send({
          message: ` Succesfully blocked user `,
          data: req.body,
        });
      }
    );
  }

  unblockUser = (req,res) =>{
    const { uid } = req.params;
    const sql =
      " UPDATE answers SET isBlock = 0 WHERE uid = ?  ";
    db.query(
      sql,
      [uid],
      (err) => {
        if (err) console.log(err.message);
        res.send({
          message: ` Succesfully unblocked user `,
          data: req.body,
        });
      }
    );
  }

}

module.exports = new stackoverflowController();
