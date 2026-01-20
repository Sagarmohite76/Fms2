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

app.post("/add-user", (req, res) => {
    const { name, email, username, password, role } = req.body;

    pool.query(
        "INSERT INTO admin (name,email,username,password,role) VALUES (?, ?, ?, ?, ?)",
        [name, email, username, password, role],
        (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        message: "Email or username already exists"
                    });
                }

                console.error(err);
                return res.status(500).json({ message: "Database error" });
            }

            res.json({ message: "User added", id: result.insertId });
        }
    );
});


app.get("/admin", (req, res) => {
    pool.query("SELECT * FROM admin", (err, result) => {
        if (err) {
            console.log(err);
        }
        res.json(result);
    })
});

app.listen(4000, () => {
    console.log("Server run on 4000 ");

})