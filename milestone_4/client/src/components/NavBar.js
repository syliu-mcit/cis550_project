import { AppBar, Container, Toolbar, Typography, Menu, MenuItem } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const NavText = ({ href, text, isMain, dropdownItems }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Typography
        variant={isMain ? 'h5' : 'h7'}
        noWrap
        style={{
          marginRight: '30px',
          fontFamily: 'sans-serif',
          fontWeight: 700,
          letterSpacing: '.2rem',
        }}
        onClick={dropdownItems ? handleMenuOpen : null}
      >
        <NavLink
          to={href}
          style={{
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          {text}
        </NavLink>
      </Typography>
      {dropdownItems && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {dropdownItems.map((item, index) => (
            <MenuItem key={index} onClick={handleMenuClose}>
              <NavLink to={item.href} style={{ color: 'inherit', textDecoration: 'none' }}>{item.text}</NavLink>
            </MenuItem>
          ))}
        </Menu>
      )}
    </div>
  );
};

// Here, we define the NavBar. Note that we heavily leverage MUI components
// to make the component look nice. Feel free to try changing the formatting
// props to how it changes the look of the component.
export default function NavBar() {
  const routesDropdownItems = [
    { href: '/routes/find_destinations', text: 'Find Destinations' },
    { href: '/routes/route_map', text: 'Route Map' },
    { href: '/routes/popular_routes', text: 'Popular Routes' },
    { href: '/routes/delay_stats', text: 'Flight Delay Stats' }
  ];

  // Dropdown Items for the Airlines Page in Nav bar
  const airlinesDropdownItems = [
    { href: '/airlines/look_up_reviews', text: 'Look Up an Airline' },
    { href: '/airlines/airline_ranking', text: 'Rank by Ratings' },
    { href: '/airlines/coverage', text: 'Check Coverages' },
  ];

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <NavText href='/' text='SimpliFly' isMain />
          <NavText href='/airlines' text='Airlines' dropdownItems={airlinesDropdownItems}/>
          <NavText href='/airports' text='Airports' />
          {/* <NavText href='/routes' text='Routes' /> */}
          <NavText href="/routes" text="Routes" dropdownItems={routesDropdownItems} />
          <NavText href='/trip' text='Trip Planner' />
        </Toolbar>
      </Container>
    </AppBar>
  );
}