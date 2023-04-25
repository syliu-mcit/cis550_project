import { useEffect, useState } from 'react';
import { Button, Checkbox, Grid, Box, Container, TextField, FormControlLabel } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function TripPlanner() {
    const [startCity, setStartCity] = useState('');
    const [destCity, setDestCity] = useState('');
  
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState([]);
    const [layover, setLayover] = useState(false);

    const search = () => {
        let url = `http://${config.server_host}:${config.server_port}/trip_direct?start_city=${startCity}&dest_city=${destCity}`;
        if (layover) {
            url = `http://${config.server_host}:${config.server_port}/trip_layover?start_city=${startCity}&dest_city=${destCity}`
        }
        fetch(url)
          .then(res => res.json())
          .then(resJson => {
             const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
            setData(resWithId);
          });
      }
      
      const columns = [
        { field: 'airlineName', headerName: 'Airline', width: 150},
        { field: 'sourceCity', headerName: 'Source City'},
        { field: 'sourceIata', headerName: 'Source Airport'},
        { field: 'destCity', headerName: 'Dest City' },
        { field: 'destIata', headerName: 'Dest Airport' },
        { field: 'tripRating', headerName: 'Trip Rating'},
        { field: 'tripDistance', headerName: 'Trip Distance'},
        { field: 'averageDelay', headerName: 'Avg Delay', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'delayRate', headerName: 'Delay Rate', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'airlineRating', headerName: 'Airline Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'seatRating', headerName: 'Seat Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'staffRating', headerName: 'Staff Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'foodRating', headerName: 'Food Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'entertain_rating', headerName: 'Entertain Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'sourceAirportRating', headerName: 'Source Airport Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'sourceQueueRating', headerName: 'Source Queue Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'sourceCleanRating', headerName: 'Source Clean Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'destAirportRating', headerName: 'Dest Airport Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'destQueueRating', headerName: 'Dest Queue Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'destCleanRating', headerName: 'Dest Clean Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
      ]

      const columns2 = [
        { field: 'airlineName', headerName: 'Airline', width: 150},
        { field: 'sourceCity', headerName: 'Source City'},
        { field: 'sourceIata', headerName: 'Source Airport'},
        { field: 'layoverCity', headerName: 'Layover City'},
        { field: 'layoverIata', headerName: 'Layover Airport'},
        { field: 'destCity', headerName: 'Dest City' },
        { field: 'destIata', headerName: 'Dest Airport' },
        { field: 'tripRating', headerName: 'Trip Rating'},
        { field: 'tripDistance', headerName: 'Trip Distance', valueFormatter: ({ value }) => Number(value).toFixed(0)},
        { field: 'airlineRating', headerName: 'Airline Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'seatRating', headerName: 'Seat Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'staffRating', headerName: 'Staff Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'foodRating', headerName: 'Food Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'entertain_rating', headerName: 'Entertain Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'sourceAirportRating', headerName: 'Source Airport Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'sourceQueueRating', headerName: 'Source Queue Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'sourceCleanRating', headerName: 'Source Clean Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'layoverAirportRating', headerName: 'Layover Airport Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'layovereQueueRating', headerName: 'Layover Queue Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'layoverCleanRating', headerName: 'Layover Clean Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'destAirportRating', headerName: 'Dest Airport Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'destQueueRating', headerName: 'Dest Queue Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'destCleanRating', headerName: 'Dest Clean Rating', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'd1.averageDelay', headerName: 'Leg 1 Avg Delay', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'd1.delayRate', headerName: 'Leg 1 Delay Rate', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'd2.averageDelay', headerName: 'Leg 2 Avg Delay', valueFormatter: ({ value }) => Number(value).toFixed(1)},
        { field: 'd2.delayRate', headerName: 'Leg 2 Delay Rate', valueFormatter: ({ value }) => Number(value).toFixed(1)},
      ]
      
    return (
    <Container>
    <h2>Plan Your Next Trip</h2>
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
            label="Enter your destination city"
            variant="outlined"
            fullWidth
            onChange={(e) => setDestCity(e.target.value)}
          />
        </Grid>

        <Grid item xs={4}>
          <FormControlLabel
            label='Open to Layover?'
            control={<Checkbox checked={layover} onChange={(e) => setLayover(e.target.checked)} onClick={() => setData([])} />}
          />
        </Grid>
      </Grid>

      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Display Trip
      </Button>

      {layover ? (
        // Render DataGrid with layover
        <DataGrid
        rows={data}
        columns={columns2}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
        />
        ) : (
        // Render DataGrid without layover
        <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
        )}

    </Container>

    );
  };
