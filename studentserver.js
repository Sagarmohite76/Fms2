const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Sagarmohite1556",
    database: "management"
});

app.post("/add-user2", (req, res) => {

    const name = req.body.name;
    const rollno = req.body.rollno;
    const degree = req.body.degree;
    const year = req.body.year;
    const mobile = req.body.mobile
    const email = req.body.email
    const date = req.body.date

    pool.query(
        "INSERT INTO `details`  (name,rollno,degree,year,mobile,email,date) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, rollno, degree, year, mobile, email, date],
        (err, result) => {
            if (err) {
                console.log(err);

            }
            res.json({ message: "User added", id: result.insertId });
        }
    )
});

app.get("/details", (req, res) => {
    pool.query("SELECT * FROM details", (err, result) => {
        if (err) {
            console.log(err);
        }
        res.json(result);
    })
});


app.put("/details/status/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const sql = "UPDATE details SET status = ? WHERE id = ?";
    pool.query(sql, [status, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({ message: "Status updated" });
    });
});


app.listen(3000, () => {
    console.log("Server run on 3000 ");

})