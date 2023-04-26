import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber, blueGrey } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';

// for Routes header
import FindDestinations from "./pages/FindDestinations";
import RouteMap from "./pages/RouteMap";
import PopularRoute from "./pages/PopularRoute";
import DelayStats from "./pages/DelayStats";

// for Trip Planner
import TripPlanner from "./pages/TripPlanner";

// for Airlines pages
import AirlineRanking from "./pages/AirlineRanking";
import SearchAirline from "./pages/SearchAirline";
import BroadestCoverage from "./pages/BroadestCoverage";

// for Airports pages
import AirportRanking from "./pages/AirportRanking";
import SearchAirport from "./pages/SearchAirport";

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: {
      main: blueGrey[800],
    },
    secondary: {
      main: '#f44336',
    },
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/routes/find_destinations" element={<FindDestinations />} /> 
          <Route path="/routes/route_map" element={<RouteMap />} />
          <Route path="/routes/popular_routes" element={<PopularRoute />} />
          <Route path="/routes/delay_stats" element={<DelayStats />} />
          <Route path="/trip" element={<TripPlanner />} />

          <Route path="/airlines/airline_ranking" element={<AirlineRanking />} /> 
          <Route path="/airlines/look_up_reviews" element={<SearchAirline />} /> 
          <Route path="/airlines/coverage" element={<BroadestCoverage />} /> 
          
          <Route path="/airports/airport_ranking" element={<AirportRanking />} /> 
          <Route path="/airports/look_up_reviews" element={<SearchAirport />} /> 
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}