const express = require("express");
const app = express();
const port = 3000;

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
});

app.get("/articles/:id", (req, res) => {
  console.log(req.params.id);
  console.log("이름은 " + req.query.page + " 입니다", req.query.size);
  connection.connect();

  connection.query(
    `SELECT * FROM 'Article' where idx = ${req.params.id}`,
    function (err, results, fields) {
      console.log(results); // results contains rows returned by server
      console.log(fields); // fields contains extra meta data about results, if available

      res.send(results);
    }
  );

  connection.end();
  //   res.send("Hello World!");
});

app.get("/articles", (req, res) => {
  console.log("이름은 " + req.query.page + " 입니다", req.query.size);
  connection.connect();

  connection.query(
    `SELECT * FROM 'Article' offset idx = ${
      req.query.page * req.query.size
    } limit ${req.query.size}`,
    function (err, results, fields) {
      console.log(results); // results contains rows returned by server
      console.log(fields); // fields contains extra meta data about results, if available

      res.send(results);
    }
  );

  connection.end();
});

app.post("/articles", (req, res) => {
  const { title, body } = req.body;

  connection.connect();

  connection.query(
    `insert into article (title, body, createTime) values('${title}', '${body}', current_timestamp());`,
    function (err, results, fields) {
      if (err) {
        res.send("fail");
      } else {
        res.send("ok");
      }
    }
  );

  connection.end();
});

app.delete("/articles/:id", (req, res) => {
  console.log(req.params.id);
  connection.connect();

  connection.query(
    `delete from article where idx = ${req.params.id}`,
    function (err, results, fields) {
      if (err) {
        res.send("fail");
      } else {
        res.send("ok");
      }
    }
  );

  connection.end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
