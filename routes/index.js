var express = require('express');
var path = require('path');
const sqlite3 = require("sqlite3").verbose(); // “.verbose()” method allows you to have more information in case of a problem.

// create the Express router
var router = express.Router();

// Connection to the SQlite database
const db_name = path.join(__dirname, "../data", "apptest.db");
console.log("Database full path - " + db_name);
const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'apptest.db'");
});

/* GET home page. */
router.get("/", function (req, res) {
  const sql = "SELECT * FROM covidregister";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("rows - " + rows.length);
    res.render( 'index', {
      status: req.query.success === "true" ? "Saved to DB" : "No status",
      covidregister_records: rows, title: "Home", app_title: "COVID-19 Vaccine Register App"
    });
  });
});

/* POST home page. */
router.post("/", function (req, res) {
  const vaccine_record = [req.body.id_number, req.body.fname, req.body.lname, req.body.vac_date, req.body.vac_name,
    req.body.vac_place];
  console.log("Submitted name: " + req.body.fname);
  console.log("Submitted name: " + req.body.lname);
  console.log("Submitted vaccination date: " + req.body.vac_date);
  console.log("Submitted vaccine name: " + req.body.vac_name);
  console.log("Submitted place of vaccination: " + req.body.vac_place);
  const sql = "INSERT INTO covidregister (identity_number, first_name, last_name, vaccination_date, vaccine_name, " +
      "vaccine_place) VALUES (?,?)";

  db.run(sql, vaccine_record, (err) => {
    if (err){
      return console.error(err.message);
      res.redirect("/?success=false");
    }
    res.redirect("/?success=true");
  });
});


/* GET home page. */
router.get("/about", function (req, res) {
  console.log("about route");
  res.render( 'about', { title: "About", app_title: "COVID-19 Vaccine Register App" });
});


module.exports = router;
