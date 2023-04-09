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
// BL
app.get('/get_city_or_country/:name', routes.get_city_or_country);
app.get('/nonstop_international_dest/:country', routes.nonstop_international_dest);
app.get('/get_route_map/:airline_name', routes.get_route_map);
app.get('/get_popular_routes_cities/', routes.get_popular_routes_cities);
app.get('/get_popular_routes_countries/', routes.get_popular_routes_countries);
app.get('/most_delayed_route/:opCarrier', routes.most_delayed_route);

// ZB

// MF
app.get('/best_route_cities_overall/', routes.best_route_cities_overall);
app.get('/best_route_cities_dining/', routes.best_route_cities_dining);
app.get('/routes_one_layover/', routes.routes_one_layover);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
