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

const best_route_cities_overall = async function(req, res) {
  // given two cities, find the routes and associated overall ratings
  connection.query(`
  SELECT * FROM
  (SELECT name, AVG(overall_rating) AS averageRating FROM Review_Airport GROUP BY
  name) AS AirportRating
  JOIN AirportMap ON AirportRating.name = AirportMap.skytrax_airportName
  WHERE openflight_airportID in
  (SELECT destinationAirportID AS openflight_airportID
  FROM Routes
  WHERE sourceAirport in (SELECT iata from Airports WHERE city = '${req.query.source_city}')
  AND destinationAirport in (SELECT iata from Airports WHERE city = '${req.query.dest_city}')
  )
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const best_route_cities_dining = async function(req, res) {
  // given two cities, find the airlines that operate the route with best dining
  connection.query(`
  SELECT * FROM
  (SELECT name, AVG(food_rating) AS averageRating FROM Review_Airline GROUP BY
  name) AS AirlineRating
  JOIN AirlineMap ON AirlineRating.name = AirlineMap.skytrax_airlineName
  WHERE openflight_airlineID in
  (SELECT airlineID AS openflight_airlineID
    FROM Routes
  WHERE sourceAirport in (SELECT iata from Airports WHERE city = '${req.query.source_city}')
  AND destinationAirport in (SELECT iata from Airports WHERE city = '${req.query.dest_city}')
  )
  ORDER BY averageRating DESC
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const routes_one_layover = async function(req, res) {
  // given two cities, find the routes and associated overall ratings
  connection.query(`
SELECT r1.airlineID AS leg1_airlineID,
r1.sourceAirport AS leg1_sourceAirport,
r1.destinationAirport as leg1_DestinationAirport,
r2.airlineID AS leg2_airlineID,
r2.sourceAirport AS leg2_sourceAirport,
r2.destinationAirport as leg2_DestinationAirport,
source1_lat,
source1_long,
dest1_lat,
dest1_long,
source2_lat,
source2_long,
dest2_lat,
dest2_long
FROM (SELECT airlineID, sourceAirport, destinationAirport FROM Routes
WHERE sourceAirport in (SELECT iata from Airports WHERE city = '${req.query.source_city}' AND iata IS NOT NULL)
AND destinationAirport in (SELECT iata from Airports WHERE city !=
'${req.query.dest_city}' AND iata IS NOT NULL)) r1
JOIN
(SELECT airlineID, sourceAirport, destinationAirport FROM Routes
WHERE sourceAirport in (SELECT iata from Airports WHERE city != '${req.query.source_city}' AND iata IS NOT NULL)
AND destinationAirport in (SELECT iata from Airports WHERE city = '${req.query.dest_city}'
AND iata IS NOT NULL)) r2
ON r1.airlineID = r2.airlineID AND r1.destinationAirport = r2.sourceAirport
JOIN (SELECT iata, latitude as source1_lat, longitude as source1_long FROM
Airports) a ON r1.sourceAirport = a.iata
JOIN (SELECT iata, latitude as dest1_lat, longitude as dest1_long FROM
Airports) b ON r1.destinationAirport = b.iata
JOIN (SELECT iata, latitude as source2_lat, longitude as source2_long FROM
Airports) c ON r1.sourceAirport = c.iata
JOIN (SELECT iata, latitude as dest2_lat, longitude as dest2_long FROM
Airports) d ON r1.sourceAirport = d.iata
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}



// TODO: Add route variable names below, seperated by commas
module.exports = {
  // ZW
  airline_reviews,

  // BL

  // ZB

  // MF
  best_route_cities_overall,
  best_route_cities_dining,
  routes_one_layover
}
