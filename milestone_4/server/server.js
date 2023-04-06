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

// ZB

// MF


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
