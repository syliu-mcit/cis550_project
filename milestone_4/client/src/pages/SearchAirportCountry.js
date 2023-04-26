import { useEffect, useState } from 'react';
import { Button, Checkbox, Grid, Box, Container, TextField, FormControlLabel } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function SearchAirportCountry() {
    const [countryName, setName] = useState('');
  
    const [pageSize, setPageSize] = useState(50);
    const [data, setData] = useState([]);

    const search = () => {
        let url = `http://${config.server_host}:${config.server_port}/top_airports_by_country/${countryName}`;

        fetch(url)
          .then(res => res.json())
          .then(resJson => {
            const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
            setData(resWithId);
          });
      }
      
      const columns = [
        { field: 'name', headerName: 'Airport Name', width: 400},
        { field: 'city', headerName: 'City', width: 250  },
        { field: 'rating', headerName: 'Rating', width: 110  }
      ]
      
    return (
    <Container>
    <h2>Enter the Name of the Country</h2>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Enter Country Name"
            variant="outlined"
            fullWidth
            placeholder='United States'
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={0.8}>
          <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
            Search
          </Button>
        </Grid>
      </Grid>

      <h2>Results</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[50, 100, 150]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

    </Container>

    );
  };
