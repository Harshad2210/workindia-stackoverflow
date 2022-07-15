const mysql = require("mysql");

const { USER_NAME, USER_PASSWORD, DATABASE, HOST } = process.env;
const database = () => {
  return mysql.createConnection({
    host: HOST,
    user: USER_NAME,
    password: USER_PASSWORD,
    database: DATABASE,
  });
};

module.exports = database;
