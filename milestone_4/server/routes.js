const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

// TODO: Add routes for the different web pages

// ZW:
// Route 1: GET all the reviews for a particular airline ./airline_review/:airline_name
const airline_reviews = async function(req, res) {
  // a route that given an airline_name, returns all records of reviews for the airline
  connection.query(`
    SELECT *
    FROM Review_Airline
    WHERE name = '${req.params.airline_name}'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}


// BL: 


// ZB:


// MF:



// TODO: Add route variable names below, seperated by commas
module.exports = {
  // ZW
  airline_reviews,
  // BL

  // ZB

  // MF

}
