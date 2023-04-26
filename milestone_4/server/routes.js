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
// Route 1: GET all the reviews for a particular airline /airline_review/:airline_name
const airline_reviews = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 50;
  // a route that given an airline_name, returns all records of reviews for the airline
  if (!page) {
    connection.query(`
      SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, name, LEFT(date, 10) as date, cabin_flown, ROUND(overall_rating,3) AS overall_rating, ROUND(seat_rating, 3) AS seat_rating, ROUND(staff_rating,3) AS staff_rating, ROUND(food_rating,3) AS food_rating, ROUND(entertain_rating,3) AS entertain_rating, ROUND(value_rating,3) AS value_rating, recommended
      FROM Review_Airline
      WHERE name = '${req.params.airline_name}'
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  } else {
    connection.query(`
      SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, name, LEFT(date, 10) as date, cabin_flown, ROUND(overall_rating,3) AS overall_rating, ROUND(seat_rating, 3) AS seat_rating, ROUND(staff_rating,3) AS staff_rating, ROUND(food_rating,3) AS food_rating, ROUND(entertain_rating,3) AS entertain_rating, ROUND(value_rating,3) AS value_rating, recommended
      FROM Review_Airline
      WHERE name = '${req.params.airline_name}'
      LIMIT ${pageSize}
      OFFSET ${pageSize*(page-1)};
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  }
}

// Route 2: GET the top airlines for each category (default 20 per page) /top_airline/:category?page=1&page_size=10
// :category can be one of the 5 followings: overall_rating, seat_rating, staff_rating, food_rating, entertain_rating
const top_airline = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 20;

  if (!page) {
    connection.query(`
      SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, UPPER(REPLACE(name, "-", " ")) AS name, ROUND(AVG(${req.params.category}),2) as rating 
      FROM Review_Airline
      GROUP BY name
      HAVING COUNT(${req.params.category}) > 30
      ORDER BY AVG(${req.params.category}) DESC, name
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });  
  } else {
    // Pagination
    connection.query(`
      SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, UPPER(REPLACE(name, "-", " ")) AS name, ROUND(AVG(${req.params.category}),2) as rating 
      FROM Review_Airline
      GROUP BY name
      HAVING COUNT(${req.params.category}) > 30
      ORDER BY AVG(${req.params.category}) DESC, name
      LIMIT ${pageSize}
      OFFSET ${pageSize*(page-1)};
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });      
  }

}

// Route 3: GET the ratings for economy class vs. business class for all airlines /class_ratings
const class_ratings = async function(req, res) {
  connection.query(`
    SELECT name, cabin_flown, AVG(overall_rating) as rating FROM Review_Airline
    GROUP BY name, cabin_flown
    ORDER BY name
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  }); 
}

// Route 4: GET the airlines with the broadest coverage (number of distinct routes) along with their overall ratings /broadest_coverage_ratings
const broadest_coverage_ratings = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 50;

  if (!page) {
    connection.query(`
      WITH ra_lite AS (
          SELECT name, AVG(overall_rating) AS overall_rating
          From Review_Airline
          GROUP BY name
          HAVING COUNT(overall_rating) > 10
      ), r_lite AS (
          SELECT airlineID
          FROM Routes
      )

      SELECT DISTINCT UPPER(REPLACE(ra_lite.name, "-", " ")) AS name, COUNT(r_lite.airlineID) AS number_of_routes, ROUND(AVG(ra_lite.overall_rating),2) AS overall_rating, TO_BASE64(RANDOM_BYTES(16)) as res_id
      FROM ra_lite
      JOIN AirlineMap m
      ON ra_lite.name = m.skytrax_airlineName
      JOIN r_lite
      ON r_lite.airlineID = m.openflight_airlineID
      GROUP BY r_lite.airlineID
      ORDER BY COUNT(r_lite.airlineID) DESC;
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }); 
  } else {
    connection.query(`
      WITH ra_lite AS (
          SELECT name, AVG(overall_rating) AS overall_rating
          From Review_Airline
          GROUP BY name
          HAVING COUNT(overall_rating) > 10
      ), r_lite AS (
          SELECT airlineID
          FROM Routes
      )

      SELECT DISTINCT UPPER(REPLACE(ra_lite.name, "-", " ")) AS name, COUNT(r_lite.airlineID) AS number_of_routes, ROUND(AVG(ra_lite.overall_rating),2) AS overall_rating, TO_BASE64(RANDOM_BYTES(16)) as res_id
      FROM ra_lite
      JOIN AirlineMap m
      ON ra_lite.name = m.skytrax_airlineName
      JOIN r_lite
      ON r_lite.airlineID = m.openflight_airlineID
      GROUP BY r_lite.airlineID
      ORDER BY COUNT(r_lite.airlineID) DESC
      LIMIT ${pageSize}
      OFFSET ${pageSize*(page-1)};
    `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      }); 
  }
}

// Route 5: GET all the reviews for a particular airport /airport_review/:airport_name
const airport_reviews = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 50;
  // a route that given an airport_name, returns all records of reviews for the airport
  if (!page) {
    connection.query(`
      SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, name, LEFT(date, 10) as date, ROUND(overall_rating,3) AS overall_rating, ROUND(queue_rating, 3) AS queue_rating, ROUND(clean_rating,3) AS clean_rating, ROUND(shop_rating,3) AS shop_rating, recommended
      FROM Review_Airport
      WHERE name = '${req.params.airport_name}'
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  } else {
    connection.query(`
      SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, name, LEFT(date, 10) as date, ROUND(overall_rating,3) AS overall_rating, ROUND(queue_rating, 3) AS queue_rating, ROUND(clean_rating,3) AS clean_rating, ROUND(shop_rating,3) AS shop_rating, recommended
      FROM Review_Airport
      WHERE name = '${req.params.airport_name}'
      LIMIT ${pageSize}
      OFFSET ${pageSize*(page-1)};
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  }
}

// Route 6: GET the top airports for each category (default 20 per page) /top_airport/:category?page=1&page_size=10
// :category can be one of the 4 followings: overall_rating, queue_rating, clean_rating, shop_rating
const top_airport = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 20;

  if (!page) {
    connection.query(`
      SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, UPPER(REPLACE(name, "-", " ")) AS name, ROUND(AVG(${req.params.category}),2) as rating 
      FROM Review_Airport
      GROUP BY name
      HAVING COUNT(${req.params.category}) > 30
      ORDER BY AVG(${req.params.category}) DESC, name
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });  
  } else {
    // Pagination
    connection.query(`
      SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, UPPER(REPLACE(name, "-", " ")) AS name, ROUND(AVG(${req.params.category}),2) as rating
      FROM Review_Airport
      GROUP BY name
      HAVING COUNT(${req.params.category}) > 30
      ORDER BY AVG(${req.params.category}) DESC, name
      LIMIT ${pageSize}
      OFFSET ${pageSize*(page-1)};
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });      
  }

}

// Route 7: GET the countries ranked by the average ratings of all airports in each country /top_countries
const top_countries = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 50;
  // a route that given an airport_name, returns all records of reviews for the airport
  if (!page) {
    connection.query(`
    WITH avg_rating AS (
      SELECT name, AVG(overall_rating) as rating FROM Review_Airport
      GROUP BY name
    )
    
    SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, a.country AS name, ROUND(AVG(r.rating),2) as rating
    FROM avg_rating r
    JOIN AirportMap m
    ON r.name = m.skytrax_airportName
    JOIN Airports a
    ON a.id = m.openflight_airportID
    GROUP BY a.country
    ORDER BY AVG(r.rating) DESC;
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  } else {
    connection.query(`
    WITH avg_rating AS (
      SELECT name, AVG(overall_rating) as rating FROM Review_Airport
      GROUP BY name
    )
    
    SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, a.country AS name, ROUND(AVG(r.rating),2) as rating
    FROM avg_rating r
    JOIN AirportMap m
    ON r.name = m.skytrax_airportName
    JOIN Airports a
    ON a.id = m.openflight_airportID
    GROUP BY a.country
    ORDER BY AVG(r.rating) DESC;
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  }
}

// Route 8: GET the top airports (default 20 per page) in a specific country along with their city and rating /top_airports_by_country/:country_name?page=1&page_size=10

const top_airports_by_country = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 20;

  if (!page) {
    connection.query(`
      WITH avg_rating AS (
        SELECT name, AVG(overall_rating) as rating FROM Review_Airport
        GROUP BY name
      )
      
      SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, UPPER(REPLACE(r.name, "-", " ")) AS name, a.city AS city, ROUND(r.rating,2) as rating
      FROM avg_rating r
      JOIN AirportMap m
      ON r.name = m.skytrax_airportName
      JOIN Airports a
      ON a.id = m.openflight_airportID
      WHERE country = '${req.params.country_name}'
      ORDER BY rating DESC, r.name
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });  
  } else {
    // Pagination
    connection.query(`
      WITH avg_rating AS (
        SELECT name, AVG(overall_rating) as rating FROM Review_Airport
        GROUP BY name
      )
      
      SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, UPPER(REPLACE(r.name, "-", " ")) AS name, a.city AS city, ROUND(r.rating,2) as rating
      FROM avg_rating r
      JOIN AirportMap m
      ON r.name = m.skytrax_airportName
      JOIN Airports a
      ON a.id = m.openflight_airportID
      WHERE country = '${req.params.country_name}'
      ORDER BY rating DESC, r.name
      LIMIT ${pageSize}
      OFFSET ${pageSize*(page-1)};
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });      
  }

}




// BL: 
const get_city_or_country = async function(req, res) {
  // 
  connection.query(`
    SELECT DISTINCT City
    FROM Airports
    WHERE city like '${req.params.name}%' OR country like '${req.params.name}%'
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

const nonstop_international_dest = async function(req, res) {
  // 
  connection.query(`
  SELECT distinct country
  FROM Airports
  WHERE iata in
  (SELECT destinationAirport
  FROM Routes
  WHERE sourceAirport in (SELECT iata from Airports WHERE country =
    '${req.params.country}'))
  AND NOT country = '${req.params.country}%';
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// http://localhost:8080/find_destinations?start_city=New%20York&dest_country=Germany

// http://localhost:8080/find_destinations?start_city=New%20York&dest_country=Germany&unique_countries=true

const find_destinations = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 20;

  if (!page) {
    connection.query(`
      select TO_BASE64(RANDOM_BYTES(16)) as res_id, sourceCity, sourceCountry, sourceIata, destCity, destCountry, destIata, group_concat(distinct airlineName separator ', ') AS airlines
      FROM Routes r JOIN
          (SELECT id AS airlineID, name AS airlineName FROM Airlines) a
      ON r.airlineID = a.airlineID
      JOIN (SELECT iata as sourceIata, city as sourceCity, country as sourceCountry FROM Airports) a1
      ON r.sourceAirport = a1.sourceIata
      JOIN (SELECT iata as destIata, city as destCity, country as destCountry FROM Airports) a2
      ON r.destinationAirport = a2.destIata
      where sourceAirport in (select iata from Airports where city like '${req.query.start_city}%') AND
            destinationAirport in (select iata from Airports where country like '${req.query.dest_country}%')
      group by sourceIata, sourceCity, sourceCountry, destIata, destCity, destCountry
      order by sourceCity, sourceCountry, destCity, destCountry
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });  } 

  else {
    // Pagination
    connection.query(`
    select TO_BASE64(RANDOM_BYTES(16)) as res_id, sourceCity, sourceCountry, sourceIata, destCity, destCountry, destIata, group_concat(distinct airlineName separator ', ') AS airlines
    FROM Routes r JOIN
        (SELECT id AS airlineID, name AS airlineName FROM Airlines) a
    ON r.airlineID = a.airlineID
    JOIN (SELECT iata as sourceIata, city as sourceCity, country as sourceCountry FROM Airports) a1
    ON r.sourceAirport = a1.sourceIata
    JOIN (SELECT iata as destIata, city as destCity, country as destCountry FROM Airports) a2
    ON r.destinationAirport = a2.destIata
    where sourceAirport in (select iata from Airports where city like '${req.query.start_city}%') AND
          destinationAirport in (select iata from Airports where country like '${req.query.dest_country}%')
    group by sourceIata, sourceCity, sourceCountry, destIata, destCity, destCountry
    order by sourceCity, sourceCountry, destCity, destCountry
      LIMIT ${pageSize}
      OFFSET ${pageSize*(page-1)};
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });      
  }

}

const find_destinations_country = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 20;

  if (!page) {
    connection.query(`
      select TO_BASE64(RANDOM_BYTES(16)) as res_id, sourceCity, sourceCountry, destCountry, group_concat(distinct airlineName separator ', ') AS airlines
      FROM Routes r JOIN
          (SELECT id AS airlineID, name AS airlineName FROM Airlines) a
      ON r.airlineID = a.airlineID
      JOIN (SELECT iata as sourceIata, city as sourceCity, country as sourceCountry FROM Airports) a1
      ON r.sourceAirport = a1.sourceIata
      JOIN (SELECT iata as destIata, city as destCity, country as destCountry FROM Airports) a2
      ON r.destinationAirport = a2.destIata
      where sourceAirport in (select iata from Airports where city like '${req.query.start_city}%') AND
            destinationAirport in (select iata from Airports where country like '${req.query.dest_country}%')
      group by sourceCity, sourceCountry, destCountry
      order by sourceCity, sourceCountry, destCountry
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });  } 

  else {
    // Pagination
    connection.query(`
    select TO_BASE64(RANDOM_BYTES(16)) as res_id, sourceCity, sourceCountry, destCountry, group_concat(distinct airlineName separator ', ') AS airlines
    FROM Routes r JOIN
        (SELECT id AS airlineID, name AS airlineName FROM Airlines) a
    ON r.airlineID = a.airlineID
    JOIN (SELECT iata as sourceIata, city as sourceCity, country as sourceCountry FROM Airports) a1
    ON r.sourceAirport = a1.sourceIata
    JOIN (SELECT iata as destIata, city as destCity, country as destCountry FROM Airports) a2
    ON r.destinationAirport = a2.destIata
    where sourceAirport in (select iata from Airports where city like '${req.query.start_city}%') AND
          destinationAirport in (select iata from Airports where country like '${req.query.dest_country}%')
    group by sourceCity, sourceCountry, destCountry
    order by sourceCity, sourceCountry, destCountry
      LIMIT ${pageSize}
      OFFSET ${pageSize*(page-1)};
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });      
  }
}

// http://localhost:8080/get_route_map/United%20Airlines

const get_route_map = async function(req, res) {
  
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 20;

  if (!page) {
    connection.query(`
    SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, sourceIata, sourceCity, sourceCountry, destIata, destCity, destCountry
    FROM Routes r JOIN
    (SELECT iata as sourceIata, city as sourceCity, country as sourceCountry FROM Airports) a1
    ON r.sourceAirport = a1.sourceIata
    JOIN (SELECT iata as destIata, city as destCity, country as destCountry FROM Airports) a2
    ON r.destinationAirport = a2.destIata
    WHERE airlineID in (SELECT id FROM Airlines WHERE name like '${req.params.airline_name}%')
    ORDER BY sourceIata, sourceCity, sourceCountry, destIata, destCity, destCountry
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });  } 

  else {
    // Pagination
    connection.query(`
    SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, sourceIata, sourceCity, sourceCountry, destIata, destCity, destCountry
    FROM Routes r JOIN
    (SELECT iata as sourceIata, city as sourceCity, country as sourceCountry FROM Airports) a1
    ON r.sourceAirport = a1.sourceIata
    JOIN (SELECT iata as destIata, city as destCity, country as destCountry FROM Airports) a2
    ON r.destinationAirport = a2.destIata
    WHERE airlineID in (SELECT id FROM Airlines WHERE name like '${req.params.airline_name}%')
    ORDER BY sourceIata, sourceCity, sourceCountry, destIata, destCity, destCountry
      LIMIT ${pageSize}
      OFFSET ${pageSize*(page-1)};
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });      
  }
}

// http://localhost:8080/get_route_map_count/United%20Airlines
const get_route_map_count = async function(req, res) {
  // 
  connection.query(`
  SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, count(distinct(sourceCity)) as cities, count(distinct(sourceCountry)) as countries
  FROM Routes r JOIN
  (SELECT iata as sourceIata, city as sourceCity, country as sourceCountry FROM Airports) a1
  ON r.sourceAirport = a1.sourceIata
  JOIN (SELECT iata as destIata, city as destCity, country as destCountry FROM Airports) a2
  ON r.destinationAirport = a2.destIata
  WHERE airlineID in (SELECT id FROM Airlines WHERE name like '${req.params.airline_name}%')
  ORDER BY cities DESC;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// http://localhost:8080/get_route_map_countries/United%20Airlines
const get_route_map_countries = async function(req, res) {
  // 
  connection.query(`
  SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, destCountry, count(*) AS routes
  FROM Routes r JOIN
  (SELECT iata as sourceIata, city as sourceCity, country as sourceCountry FROM Airports) a1
  ON r.sourceAirport = a1.sourceIata
  JOIN (SELECT iata as destIata, city as destCity, country as destCountry FROM Airports) a2
  ON r.destinationAirport = a2.destIata
  WHERE airlineID in (SELECT id FROM Airlines  WHERE name like '${req.params.airline_name}%')
  GROUP BY destCountry
  ORDER BY routes DESC LIMIT 10
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}


// http://localhost:8080/get_airlines
const get_airlines = async function(req, res) {
  // 
  connection.query(`
  select DISTINCT airlineName
  FROM Routes r JOIN
       (SELECT id AS airlineID, name AS airlineName FROM Airlines) a
  ON r.airlineID = a.airlineID
  ORDER By airlineName;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// http://localhost:8080/get_popular_routes_cities
const get_popular_routes_cities = async function(req, res) {
  // 
  connection.query(`
  WITH routes_new AS (
    SELECT * FROM Routes r
    LEFT JOIN (SELECT id as sourceID, city AS sourceCity, country as
    sourceCountry FROM Airports) a ON r.sourceAirportID = a.sourceID
    LEFT JOIN (SELECT id as destID, city AS destCity, country as destCountry
    FROM Airports) b ON r.destinationAirportID = b.destID
    )
    SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, sourceCity, destCity, COUNT(DISTINCT airlineID) AS NumAirlines, COUNT(*)
    AS NumRoutes
    FROM routes_new
    GROUP BY sourceCity, destCity
    ORDER BY NumRoutes desc
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// http://localhost:8080/get_popular_routes_countries
const get_popular_routes_countries = async function(req, res) {
  //
  connection.query(`
  WITH routes_new AS (
    SELECT * FROM Routes r
    LEFT JOIN (SELECT id as sourceID, city AS sourceCity, country as
    sourceCountry FROM Airports) a ON r.sourceAirportID = a.sourceID
    LEFT JOIN (SELECT id as destID, city AS destCity, country as destCountry
    FROM Airports) b ON r.destinationAirportID = b.destID
    )
    SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, sourceCountry, destCountry, COUNT(DISTINCT airlineID) AS NumAirlines,
    COUNT(*) AS NumRoutes
    FROM routes_new
    GROUP BY sourceCountry, destCountry
    ORDER BY NumRoutes desc;
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// http://localhost:8080/most_delayed_route?airline=United%20Airlines&minFlights=25
const most_delayed_route = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 20;

  if (!page) {
    connection.query(`
    SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, airlineName, sourceCity, sourceIata, destCity, destIata, averageDelay, delayRate, NumFlights
    FROM
    (SELECT opCarrier, origin, dest, AVG(totalDelay) AS averageDelay,
    COUNT(CASE WHEN totalDelay > 0 THEN 1 END)/COUNT(*) AS delayRate, COUNT(*) as NumFlights
    FROM FlightDelay
    WHERE opCarrier IN (select iata FROM Airlines WHERE name like '${req.query.airline}%')
    GROUP BY opCarrier, origin, dest
    HAVING NumFlights >= ${req.query.minFlights}) f
    JOIN
    (SELECT name as airlineName, iata as airlineIata FROM Airlines) a ON f.opCarrier = a.airlineIata
    JOIN (SELECT iata as sourceIata, city as sourceCity, country as sourceCountry FROM Airports) a1
    ON f.origin = a1.sourceIata
    JOIN (SELECT iata as destIata, city as destCity, country as destCountry FROM Airports) a2
    ON f.dest = a2.destIata
    GROUP BY opCarrier, origin, dest
    ORDER BY averageDelay DESC
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });  } 

  else {
    // Pagination
    connection.query(`
    SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, airlineName, sourceCity, sourceIata, destCity, destIata, averageDelay, delayRate, NumFlights
    FROM
    (SELECT opCarrier, origin, dest, AVG(totalDelay) AS averageDelay,
    COUNT(CASE WHEN totalDelay > 0 THEN 1 END)/COUNT(*) AS delayRate, COUNT(*) as NumFlights
    FROM FlightDelay
    WHERE opCarrier IN (select iata FROM Airlines WHERE name like '${req.query.airline}%')
    GROUP BY opCarrier, origin, dest
    HAVING NumFlights >= ${req.query.minFlights}) f
    JOIN
    (SELECT name as airlineName, iata as airlineIata FROM Airlines) a ON f.opCarrier = a.airlineIata
    JOIN (SELECT iata as sourceIata, city as sourceCity, country as sourceCountry FROM Airports) a1
    ON f.origin = a1.sourceIata
    JOIN (SELECT iata as destIata, city as destCity, country as destCountry FROM Airports) a2
    ON f.dest = a2.destIata
    GROUP BY opCarrier, origin, dest
    ORDER BY averageDelay DESC
      LIMIT ${pageSize}
      OFFSET ${pageSize*(page-1)};
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });      
  }



}

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


// http://localhost:8080/trip_direct?start_city=New%20York&dest_city=Toronto
const trip_direct = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 20;

  if (!page) {
    connection.query(`
    WITH tmp_route AS
    (SELECT airlineID, sourceCity, sourceCountry, sourceIata, destCity, destCountry, destIata
    FROM Routes r
    JOIN (SELECT iata as sourceIata, city as sourceCity, country as sourceCountry FROM Airports) a1
    ON r.sourceAirport = a1.sourceIata
    JOIN (SELECT iata as destIata, city as destCity, country as destCountry FROM Airports) a2
    ON r.destinationAirport = a2.destIata
    where sourceAirport in (select iata from Airports where city like '${req.query.start_city}%') AND
          destinationAirport in (select iata from Airports where city like '${req.query.dest_city}%')
    group by airlineID, sourceIata, sourceCity, destIata, destCity
    order by airlineID, sourceIata, sourceCity, destIata, destCity
    ),
    tmp_airline AS (SELECT id, Airlines.name AS name, iata, overall_rating, seat_rating, staff_rating, food_rating, entertain_rating
    FROM Airlines JOIN AirlineMap ON Airlines.id = AirlineMap.openflight_airlineID
     JOIN
     (SELECT name, AVG(overall_rating) AS overall_rating, AVG(seat_rating) AS seat_rating, AVG(staff_rating) AS staff_rating,
            AVG(food_rating) AS food_rating, AVG(entertain_rating) AS entertain_rating
      FROM Review_Airline
      GROUP BY name ) r
     ON AirlineMap.skytrax_airlineName = r.name),
    tmp_airport AS (SELECT id, Airports.name AS name, city, country, iata, latitude, longitude, overall_rating, queue_rating, clean_rating
    FROM Airports JOIN AirportMap ON Airports.id = AirportMap.openflight_airportID
        JOIN
     (SELECT name, AVG(overall_rating) AS overall_rating, AVG(queue_rating) AS queue_rating, AVG(clean_rating) AS clean_rating
      FROM Review_Airport
      GROUP BY name ) r
     ON AirportMap.skytrax_airportName = r.name)
  SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, al.name AS airlineName, sourceCity, sourceIata, destCity, destIata,
        ROUND((al.overall_rating + ap.overall_rating + ap2.overall_rating)/3, 1) AS tripRating,
        ROUND(111.111 * (1/1.6) * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(ap.Latitude)) * COS(RADIANS(ap2.Latitude))
          * COS(RADIANS(ap.Longitude - ap2.Longitude)) + SIN(RADIANS(ap.Latitude)) * SIN(RADIANS(ap2.Latitude))))), 0) AS tripDistance,
        al.overall_rating AS airlineRating, seat_rating AS seatRating, staff_rating AS staffRating, food_rating AS foodRating,
        entertain_rating AS entertain_rating, ap.overall_rating AS sourceAirportRating, ap.queue_rating AS sourceQueueRating,
        ap.clean_rating AS sourceCleanRating, ap2.overall_rating AS destAirportRating, ap2.queue_rating AS destQueueRating,
        ap2.clean_rating AS destCleanRating, averageDelay, delayRate
  FROM tmp_route r JOIN tmp_airline al ON r.airlineID = al.id
  JOIN tmp_airport ap ON r.sourceIata = ap.iata
  JOIN tmp_airport ap2 ON r.destIata = ap2.iata
  LEFT JOIN FlightDelay_Route d ON al.iata = d.OpCarrier AND r.sourceIata = origin AND r.destIata = dest
  ORDER BY tripRating DESC
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });  } 

  else {
    // Pagination
    connection.query(`
    WITH tmp_route AS
    (SELECT airlineID, sourceCity, sourceCountry, sourceIata, destCity, destCountry, destIata
    FROM Routes r
    JOIN (SELECT iata as sourceIata, city as sourceCity, country as sourceCountry FROM Airports) a1
    ON r.sourceAirport = a1.sourceIata
    JOIN (SELECT iata as destIata, city as destCity, country as destCountry FROM Airports) a2
    ON r.destinationAirport = a2.destIata
    where sourceAirport in (select iata from Airports where city like '${req.query.start_city}%') AND
          destinationAirport in (select iata from Airports where city like '${req.query.dest_city}%')
    group by airlineID, sourceIata, sourceCity, destIata, destCity
    order by airlineID, sourceIata, sourceCity, destIata, destCity
    ),
    tmp_airline AS (SELECT id, Airlines.name AS name, iata, overall_rating, seat_rating, staff_rating, food_rating, entertain_rating
    FROM Airlines JOIN AirlineMap ON Airlines.id = AirlineMap.openflight_airlineID
     JOIN
     (SELECT name, AVG(overall_rating) AS overall_rating, AVG(seat_rating) AS seat_rating, AVG(staff_rating) AS staff_rating,
            AVG(food_rating) AS food_rating, AVG(entertain_rating) AS entertain_rating
      FROM Review_Airline
      GROUP BY name ) r
     ON AirlineMap.skytrax_airlineName = r.name),
    tmp_airport AS (SELECT id, Airports.name AS name, city, country, iata, latitude, longitude, overall_rating, queue_rating, clean_rating
    FROM Airports JOIN AirportMap ON Airports.id = AirportMap.openflight_airportID
        JOIN
     (SELECT name, AVG(overall_rating) AS overall_rating, AVG(queue_rating) AS queue_rating, AVG(clean_rating) AS clean_rating
      FROM Review_Airport
      GROUP BY name ) r
     ON AirportMap.skytrax_airportName = r.name)
  SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, al.name AS airlineName, sourceCity, sourceIata, destCity, destIata,
        ROUND((al.overall_rating + ap.overall_rating + ap2.overall_rating)/3, 1) AS tripRating,
        ROUND(111.111 * (1/1.6) * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(ap.Latitude)) * COS(RADIANS(ap2.Latitude))
          * COS(RADIANS(ap.Longitude - ap2.Longitude)) + SIN(RADIANS(ap.Latitude)) * SIN(RADIANS(ap2.Latitude))))), 0) AS tripDistance,
        al.overall_rating AS airlineRating, seat_rating AS seatRating, staff_rating AS staffRating, food_rating AS foodRating,
        entertain_rating AS entertain_rating, ap.overall_rating AS sourceAirportRating, ap.queue_rating AS sourceQueueRating,
        ap.clean_rating AS sourceCleanRating, ap2.overall_rating AS destAirportRating, ap2.queue_rating AS destQueueRating,
        ap2.clean_rating AS destCleanRating, averageDelay, delayRate
  FROM tmp_route r JOIN tmp_airline al ON r.airlineID = al.id
  JOIN tmp_airport ap ON r.sourceIata = ap.iata
  JOIN tmp_airport ap2 ON r.destIata = ap2.iata
  LEFT JOIN FlightDelay_Route d ON al.iata = d.OpCarrier AND r.sourceIata = origin AND r.destIata = dest
  ORDER BY tripRating DESC
      LIMIT ${pageSize}
      OFFSET ${pageSize*(page-1)};
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });      
  }
}

// http://localhost:8080/trip_layover?start_city=Atlanta&dest_city=Beijing
const trip_layover = async function(req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 20;

  if (!page) {
    connection.query(`
    WITH tmp_route AS
    (SELECT r1.airlineID AS airlineID,
    r1.sourceAirport AS sourceIata,
    r1.destinationAirport as layoverIata,
    r2.destinationAirport as destIata
    FROM (SELECT airlineID, sourceAirport, destinationAirport FROM Routes
    WHERE sourceAirport in (SELECT iata from Airports WHERE city like '${req.query.start_city}%' AND iata IS NOT NULL)
    AND destinationAirport in (SELECT iata from Airports WHERE city not like '${req.query.dest_city}%'AND iata IS NOT NULL)) r1
    JOIN
    (SELECT airlineID, sourceAirport, destinationAirport FROM Routes
    WHERE sourceAirport in (SELECT iata from Airports WHERE city not like '${req.query.start_city}%' AND iata IS NOT NULL)
    AND destinationAirport in (SELECT iata from Airports WHERE city like '${req.query.dest_city}%'
    AND iata IS NOT NULL)) r2
    ON r1.airlineID = r2.airlineID AND r1.destinationAirport = r2.sourceAirport
    GROUP BY airlineID, sourceIata, layoverIata, destIata
    ),
    tmp_airline AS (SELECT id, Airlines.name AS name, iata, overall_rating, seat_rating, staff_rating, food_rating, entertain_rating
    FROM Airlines JOIN AirlineMap ON Airlines.id = AirlineMap.openflight_airlineID
     JOIN
     (SELECT name, AVG(overall_rating) AS overall_rating, AVG(seat_rating) AS seat_rating, AVG(staff_rating) AS staff_rating,
            AVG(food_rating) AS food_rating, AVG(entertain_rating) AS entertain_rating
      FROM Review_Airline
      GROUP BY name ) r
     ON AirlineMap.skytrax_airlineName = r.name),
    tmp_airport AS (SELECT id, Airports.name AS name, city, country, iata, latitude, longitude, overall_rating, queue_rating, clean_rating
    FROM Airports JOIN AirportMap ON Airports.id = AirportMap.openflight_airportID
        JOIN
     (SELECT name, AVG(overall_rating) AS overall_rating, AVG(queue_rating) AS queue_rating, AVG(clean_rating) AS clean_rating
      FROM Review_Airport
      GROUP BY name ) r
     ON AirportMap.skytrax_airportName = r.name)
SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, al.name AS airlineName, ap.city AS sourceCity, sourceIata,
       ap2.city as layoverCity, layoverIata, ap3.city AS destCity, destIata,
       ROUND((al.overall_rating + ap.overall_rating + ap2.overall_rating + ap2.overall_rating)/4, 1) AS tripRating,
       (111.111 * (1/1.6) * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(ap.Latitude)) * COS(RADIANS(ap2.Latitude))
        * COS(RADIANS(ap.Longitude - ap2.Longitude)) + SIN(RADIANS(ap.Latitude)) * SIN(RADIANS(ap2.Latitude)))))) +
       (111.111 * (1/1.6) * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(ap2.Latitude)) * COS(RADIANS(ap3.Latitude))
        * COS(RADIANS(ap2.Longitude - ap3.Longitude)) + SIN(RADIANS(ap2.Latitude)) * SIN(RADIANS(ap3.Latitude)))))) AS tripDistance,
       al.overall_rating AS airlineRating, seat_rating AS seatRating, staff_rating AS staffRating, food_rating AS foodRating,
       entertain_rating AS entertain_rating, ap.overall_rating AS sourceAirportRating, ap.queue_rating AS sourceQueueRating,
       ap.clean_rating AS sourceCleanRating, ap2.overall_rating AS layoverAirportRating, ap2.queue_rating AS layoverQueueRating,
       ap2.clean_rating AS layoverCleanRating, ap3.overall_rating AS destAirportRating, ap3.queue_rating AS destQueueRating,
       ap3.clean_rating AS destCleanRating, d1.averageDelay, d1.delayRate, d2.averageDelay, d2.delayRate
FROM tmp_route r JOIN tmp_airline al ON r.airlineID = al.id
JOIN tmp_airport ap ON r.sourceIata = ap.iata
JOIN tmp_airport ap2 ON r.layoverIata = ap2.iata
JOIN tmp_airport ap3 ON r.destIata = ap3.iata
LEFT JOIN FlightDelay_Route d1 ON al.iata = d1.OpCarrier AND r.sourceIata = d1.origin AND r.layoverIata = d1.dest
LEFT JOIN FlightDelay_Route d2 ON al.iata = d2.OpCarrier AND r.layoverIata = d2.origin AND r.destIata = d2.dest
ORDER BY tripDistance ASC, tripRating DESC
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });  } 

  else {
    // Pagination
    connection.query(`
    WITH tmp_route AS
    (SELECT r1.airlineID AS airlineID,
    r1.sourceAirport AS sourceIata,
    r1.destinationAirport as layoverIata,
    r2.destinationAirport as destIata
    FROM (SELECT airlineID, sourceAirport, destinationAirport FROM Routes
    WHERE sourceAirport in (SELECT iata from Airports WHERE city like '${req.query.start_city}%' AND iata IS NOT NULL)
    AND destinationAirport in (SELECT iata from Airports WHERE city not like '${req.query.dest_city}%'AND iata IS NOT NULL)) r1
    JOIN
    (SELECT airlineID, sourceAirport, destinationAirport FROM Routes
    WHERE sourceAirport in (SELECT iata from Airports WHERE city not like '${req.query.start_city}%' AND iata IS NOT NULL)
    AND destinationAirport in (SELECT iata from Airports WHERE city like '${req.query.dest_city}%'
    AND iata IS NOT NULL)) r2
    ON r1.airlineID = r2.airlineID AND r1.destinationAirport = r2.sourceAirport
    GROUP BY airlineID, sourceIata, layoverIata, destIata
    ),
    tmp_airline AS (SELECT id, Airlines.name AS name, iata, overall_rating, seat_rating, staff_rating, food_rating, entertain_rating
    FROM Airlines JOIN AirlineMap ON Airlines.id = AirlineMap.openflight_airlineID
     JOIN
     (SELECT name, AVG(overall_rating) AS overall_rating, AVG(seat_rating) AS seat_rating, AVG(staff_rating) AS staff_rating,
            AVG(food_rating) AS food_rating, AVG(entertain_rating) AS entertain_rating
      FROM Review_Airline
      GROUP BY name ) r
     ON AirlineMap.skytrax_airlineName = r.name),
    tmp_airport AS (SELECT id, Airports.name AS name, city, country, iata, latitude, longitude, overall_rating, queue_rating, clean_rating
    FROM Airports JOIN AirportMap ON Airports.id = AirportMap.openflight_airportID
        JOIN
     (SELECT name, AVG(overall_rating) AS overall_rating, AVG(queue_rating) AS queue_rating, AVG(clean_rating) AS clean_rating
      FROM Review_Airport
      GROUP BY name ) r
     ON AirportMap.skytrax_airportName = r.name)
SELECT TO_BASE64(RANDOM_BYTES(16)) as res_id, al.name AS airlineName, ap.city AS sourceCity, sourceIata,
       ap2.city as layoverCity, layoverIata, ap3.city AS destCity, destIata,
       ROUND((al.overall_rating + ap.overall_rating + ap2.overall_rating + ap2.overall_rating)/4, 1) AS tripRating,
       (111.111 * (1/1.6) * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(ap.Latitude)) * COS(RADIANS(ap2.Latitude))
        * COS(RADIANS(ap.Longitude - ap2.Longitude)) + SIN(RADIANS(ap.Latitude)) * SIN(RADIANS(ap2.Latitude)))))) +
       (111.111 * (1/1.6) * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(ap2.Latitude)) * COS(RADIANS(ap3.Latitude))
        * COS(RADIANS(ap2.Longitude - ap3.Longitude)) + SIN(RADIANS(ap2.Latitude)) * SIN(RADIANS(ap3.Latitude)))))) AS tripDistance,
       al.overall_rating AS airlineRating, seat_rating AS seatRating, staff_rating AS staffRating, food_rating AS foodRating,
       entertain_rating AS entertain_rating, ap.overall_rating AS sourceAirportRating, ap.queue_rating AS sourceQueueRating,
       ap.clean_rating AS sourceCleanRating, ap2.overall_rating AS layoverAirportRating, ap2.queue_rating AS layoverQueueRating,
       ap2.clean_rating AS layoverCleanRating, ap3.overall_rating AS destAirportRating, ap3.queue_rating AS destQueueRating,
       ap3.clean_rating AS destCleanRating, d1.averageDelay, d1.delayRate, d2.averageDelay, d2.delayRate
FROM tmp_route r JOIN tmp_airline al ON r.airlineID = al.id
JOIN tmp_airport ap ON r.sourceIata = ap.iata
JOIN tmp_airport ap2 ON r.layoverIata = ap2.iata
JOIN tmp_airport ap3 ON r.destIata = ap3.iata
LEFT JOIN FlightDelay_Route d1 ON al.iata = d1.OpCarrier AND r.sourceIata = d1.origin AND r.layoverIata = d1.dest
LEFT JOIN FlightDelay_Route d2 ON al.iata = d2.OpCarrier AND r.layoverIata = d2.origin AND r.destIata = d2.dest
ORDER BY tripDistance ASC, tripRating DESC
      LIMIT ${pageSize}
      OFFSET ${pageSize*(page-1)};
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });      
  }
}



// TODO: Add route variable names below, seperated by commas
module.exports = {
  // ZW
  airline_reviews,
  top_airline,
  class_ratings,
  broadest_coverage_ratings,
  airport_reviews,
  top_airport,
  top_countries,
  top_airports_by_country,

  // BL
  get_city_or_country,
  find_destinations, 
  find_destinations_country, 

  nonstop_international_dest,
  get_route_map,
  get_route_map_count,
  get_route_map_countries,
  get_airlines,

  get_popular_routes_cities,
  get_popular_routes_countries,
  most_delayed_route,

  // ZB

  // MF
  best_route_cities_overall,
  best_route_cities_dining,
  routes_one_layover,
  trip_direct,
  trip_layover
}
