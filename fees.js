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

app.post("/add-user3", (req, res) => {

    const class1 = req.body.class1;
    const year = req.body.year;
    const educationfee = req.body.educationfee;
    const hostelfee = req.body.hostelfee;

    pool.query(
        "INSERT INTO fee_structure (class1, year, educationfee, hostelfee, status) VALUES (?, ?, ?, ?, ?)",
        [class1, year, educationfee, hostelfee, "Active"],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: err });
            }
            res.json({ message: "User added" });
        }
    );

});

app.get("/fee_structure", (req, res) => {
    pool.query("SELECT * FROM fee_structure", (err, result) => {
        if (err) {
            console.log(err);
        }
        res.json(result);
    })
});


app.put("/fee_structure/status/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const sql = "UPDATE fee_structure SET status = ? WHERE id = ?";
    pool.query(sql, [status, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({ message: "Status updated" });
    });
});



app.listen(2000, () => {
    console.log("Server run on 2000 ");

})