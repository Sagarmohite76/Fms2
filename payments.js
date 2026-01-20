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


app.post("/add-user4", (req, res) => {

    const name = req.body.name;
    const rollno = req.body.rollno;
    const class1 = req.body.class1;
    const totalfee = req.body.totalfee;
    const amount_paid = req.body.amount_paid
    const mode = req.body.mode
    const date = req.body.date

    let status = "Pending";

    if (Number(amount_paid) >= Number(totalfee)) {
        status = "Paid";
    } else if (Number(amount_paid) > 0) {
        status = "Partial";
    }

    pool.query(
        "INSERT INTO payments (name, rollno, class1, totalfee, amount_paid, mode, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [name, rollno, class1, totalfee, amount_paid, mode, date, status],
        (err, result) => {
            if (err) {
                console.log(err);
            }
            const receiptNo = `TBC-${1000 + result.insertId}`;

            pool.query(
                "UPDATE payments SET receipt_no = ? WHERE id = ?",
                [receiptNo, result.insertId],
                (err2) => {
                    if (err2) {
                        console.log(err2);
                    }

                    res.json({
                        message: "Payment added successfully",
                        receipt_no: receiptNo
                    });
                }
            );
        }
    );
});


app.get("/payments", (req, res) => {
    pool.query("SELECT * FROM payments", (err, result) => {
        if (err) {
            console.log(err);
        }
        res.json(result);
    })
});


app.listen(3500, () => {
    console.log("Server run on 3500 ");

});