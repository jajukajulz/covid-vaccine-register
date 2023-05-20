var express = require('express');
var path = require('path');
const sqlite3 = require("sqlite3").verbose(); // “.verbose()” method allows you to have more information in case of a problem.
const {v4 : uuidv4} = require('uuid')

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
      covidregister_records: rows, title: "Home", app_title: "COVID-19 Vaccine Register dApp"
    });
  });
});

/* POST home page. */
router.post("/", function (req, res) {
  console.log("Submitted ID number: " + req.body.identity_number);
  console.log("Submitted name: " + req.body.first_name);
  console.log("Submitted name: " + req.body.last_name);
  console.log("Submitted vaccination date: " + req.body.vaccination_date);
  console.log("Submitted vaccine name: " + req.body.vaccine_name);
  console.log("Submitted place of vaccination: " + req.body.vaccine_place);

  const vaccination_id = uuidv4();
  console.log("Generated vaccination ID: " + vaccination_id);

  const added_to_blockchain_bool = 0;

  const vaccine_record = [req.body.identity_number, req.body.first_name, req.body.last_name, vaccination_id,
    req.body.vaccination_date, req.body.vaccine_name, req.body.vaccine_place, added_to_blockchain_bool];

  const sql = "INSERT INTO covidregister (identity_number, first_name, last_name, vaccination_id, vaccination_date, " +
      "vaccine_name, vaccine_place, added_to_blockchain) VALUES (?,?,?,?,?,?,?,?)";

  db.run(sql, vaccine_record, (err) => {
    if (err){
      return console.error(err.message);
      res.redirect("/?success=false");
    }
    res.redirect("/?success=true");
  });
});

/* POST updateblockchain via AJAX. */
router.post("/updateblockchain", function (req, res) {
  console.log("updateblockchain ID number: " + req.body.identity_number);
  console.log("updateblockchain vaccination ID: " + req.body.vaccination_id);

  const added_to_blockchain_bool = 1;
  const vaccine_record = [req.body.identity_number, vaccination_id, added_to_blockchain_bool];
  const sql = "UPDATE covidregister SET  added_to_blockchain_bool = ? WHERE identity_number = ? AND vaccination_id = ?";

  db.run(sql, vaccine_record, (err) => {
    if (err){
      return console.error(err.message);
      res.redirect("/?success=false");
    }
    res.redirect("/?success=true");
  });
});

/* GET about page. */
router.get("/about", function (req, res) {
  console.log("about route (GET)");
  res.render( 'about', { title: "About", app_title: "Vaccine Register dApp" });
});

/* GET search page. */
router.get("/search", function (req, res) {
  console.log("search route (GET)");
  res.render( 'search', { title: "Search", app_title: "Vaccine Register dApp" });
});

module.exports = router;
