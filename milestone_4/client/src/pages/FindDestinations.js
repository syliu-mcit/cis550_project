import { useEffect, useState } from 'react';
import { Button, Checkbox, Grid, Box, Container, TextField, FormControlLabel } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function FindDestinations() {
    const [startCity, setStartCity] = useState('');
    const [destCountry, setDestCountry] = useState('');
  
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState([]);
    const [showCountry, setShowCountry] = useState(false);

    const search = () => {
        let url = `http://${config.server_host}:${config.server_port}/find_destinations?start_city=${startCity}&dest_country=${destCountry}`;
        if (showCountry) {
            url = `http://${config.server_host}:${config.server_port}/find_destinations_country?start_city=${startCity}&dest_country=${destCountry}`
        }
        fetch(url)
          .then(res => res.json())
          .then(resJson => {
            // DataGrid expects an array of objects with a unique id.
            // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
            const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
            setData(resWithId);
          });
      }
      
      const columns = [
        { field: 'sourceCity', headerName: 'Source City' },
        { field: 'sourceCountry', headerName: 'Source Country', width: 150},
        { field: 'sourceIata', headerName: 'Source Airport' },
        { field: 'destCity', headerName: 'Dest City' },
        { field: 'destCountry', headerName: 'Dest Country', width: 150 },
        { field: 'destIata', headerName: 'Dest Airport' },
        { field: 'airlines', headerName: 'Airlines', width: 500},
      ]
      
    return (
    <Container>
    <h2>Enter A Starting City and (an optional) Destination Country</h2>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Enter your starting city"
            variant="outlined"
            fullWidth
            onChange={(e) => setStartCity(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Enter your destination country"
            variant="outlined"
            fullWidth
            onChange={(e) => setDestCountry(e.target.value)}
          />
        </Grid>

        <Grid item xs={4}>
          <FormControlLabel
            label='Show Unique Countries'
            control={<Checkbox checked={showCountry} onChange={(e) => setShowCountry(e.target.checked)} />}
          />
        </Grid>
        {/* Add additional components for the search results here */}
      </Grid>

      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>

      <h2>Results</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

    </Container>

    );
  };
