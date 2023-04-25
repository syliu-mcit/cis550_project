const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and provide their handlers that we implemented in routes.js

// TODO: Add routes that are completed in routes.js
// ZW
app.get('/airline_review/:airline_name', routes.airline_reviews);
app.get('/top_airline/:category', routes.top_airline);
app.get('/class_ratings', routes.class_ratings);
app.get('/broadest_coverage_ratings', routes.broadest_coverage_ratings);
app.get('/airport_review/:airport_name', routes.airport_reviews);
app.get('/top_airport/:category', routes.top_airport);
app.get('/top_countries', routes.top_countries);
app.get('/top_airports_by_country/:country_name', routes.top_airports_by_country);

// BL
app.get('/get_city_or_country/:name', routes.get_city_or_country);
app.get('/find_destinations/', routes.find_destinations);
app.get('/find_destinations_country/', routes.find_destinations_country);

app.get('/nonstop_international_dest/:country', routes.nonstop_international_dest);
app.get('/get_route_map/:airline_name', routes.get_route_map);
app.get('/get_route_map_count/:airline_name', routes.get_route_map_count);
app.get('/get_route_map_countries/:airline_name', routes.get_route_map_countries);
app.get('/get_airlines/', routes.get_airlines);


app.get('/get_popular_routes_cities/', routes.get_popular_routes_cities);
app.get('/get_popular_routes_countries/', routes.get_popular_routes_countries);

app.get('/most_delayed_route/', routes.most_delayed_route);

// ZB

// MF
app.get('/best_route_cities_overall/', routes.best_route_cities_overall);
app.get('/best_route_cities_dining/', routes.best_route_cities_dining);
app.get('/routes_one_layover/', routes.routes_one_layover);
app.get('/trip_direct/', routes.trip_direct);
app.get('/trip_layover/', routes.trip_layover);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
