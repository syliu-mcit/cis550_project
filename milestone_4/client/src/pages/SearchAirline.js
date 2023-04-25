import { useEffect, useState } from 'react';
import { Button, Checkbox, Grid, Box, Container, TextField, FormControlLabel } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function SearchAirline() {
    const [airlineName, setName] = useState('');
  
    const [pageSize, setPageSize] = useState(50);
    const [data, setData] = useState([]);

    const search = () => {
        let url = `http://${config.server_host}:${config.server_port}/airline_review/${airlineName}`;

        fetch(url)
          .then(res => res.json())
          .then(resJson => {
            const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
            setData(resWithId);
          });
      }
      
      const columns = [
        { field: 'date', headerName: 'Date of Review', width: 150},
        { field: 'cabin_flown', headerName: 'Cabin Flown', width: 150},
        { field: 'overall_rating', headerName: 'Overall Rating', width: 110  },
        { field: 'seat_rating', headerName: 'Seat', width: 110  },
        { field: 'staff_rating', headerName: 'Staff', width: 110 },
        { field: 'food_rating', headerName: 'Food', width: 110  },
        { field: 'entertain_rating', headerName: 'Entertain', width: 110},
        { field: 'value_rating', headerName: 'Value', width: 110},
        { field: 'recommended', headerName: 'Recommended or Not', width: 150}
      ]
      
    return (
    <Container>
    <h2>Enter the Name of the Airline</h2>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Enter Airline Name"
            variant="outlined"
            fullWidth
            placeholder='Qatar Airways'
            onChange={(e) => setName(e.target.value.replace(/\s+/g, '-').toLowerCase())}
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
