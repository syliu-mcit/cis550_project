import { useEffect, useState } from 'react';
import { Button, Checkbox, Grid, Box, Container, TextField, FormControlLabel, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function DelayStats() {
    const [pageSize, setPageSize] = useState(10);
    const [airline, setAirline] = useState([]);
    const [minFlights, setMinFlights] = useState(0);
    const [data, setData] = useState([]);

    const search = () => {
        let url = `http://${config.server_host}:${config.server_port}/most_delayed_route?airline=${airline}&minFlights=${minFlights}`;
        fetch(url)
          .then(res => res.json())
          .then(resJson => {
           const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
            setData(resWithId);
          });
      }

    const columns = [
        { field: 'airlineName', headerName: 'Airline', width:150 },
        { field: 'sourceCity', headerName: 'Source City', width:150 },
        { field: 'sourceIata', headerName: 'Source Airport', width:100 },
        { field: 'destCity', headerName: 'Dest City', width:150  },
        { field: 'destIata', headerName: 'Dest Airport', width:100  },
        { field: 'NumFlights', headerName: 'Number of Flights', width:150  },
        { field: 'averageDelay', headerName: 'Avg Delay', width:150 },
        { field: 'delayRate', headerName: 'Delay Rate', width:150  },
        ]

    return (

        <Container>
        <h2>Most delayed routes by airline</h2>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Enter an airline"
                variant="outlined"
                fullWidth
                onChange={(e) => setAirline(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Enter minimum number of flights"
                variant="outlined"
                fullWidth
                onChange={(e) => setMinFlights(e.target.value)}
              />
            </Grid>
    
          </Grid>
    
          <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
            Display
          </Button>

          <DataGrid
            rows={data}
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[10, 20, 50]}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            autoHeight
          />
    
        </Container>

    );
  };
