const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Sagarmohite1556",
    database: "management"
});

app.get("/dues", (req, res) => {

    const sql = `
    SELECT
      d.rollno,
      d.name,
      d.degree AS class,
      (fs.educationfee + fs.hostelfee) AS total_fee,
      IFNULL(pay.total_paid, 0) AS total_paid,
      ((fs.educationfee + fs.hostelfee) - IFNULL(pay.total_paid, 0)) AS due
    FROM details d
    JOIN fee_structure fs
      ON LOWER(fs.class1) = LOWER(d.degree)
      AND fs.status = 'Active'
    LEFT JOIN (
      SELECT rollno, SUM(amount_paid) AS total_paid
      FROM payments
      GROUP BY rollno
    ) pay
      ON pay.rollno = d.rollno
    WHERE d.status = 'Active'
    GROUP BY
      d.rollno,
      d.name,
      d.degree,
      fs.educationfee,
      fs.hostelfee,
      pay.total_paid;
  `;

    pool.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        res.json(result);
    });
});

app.listen(3600, () => {
    console.log("Dues API running on port 3600");
});
