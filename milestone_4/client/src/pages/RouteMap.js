import { useEffect, useState } from 'react';
import { Button, Checkbox, Grid, Box, Container, TextField, FormControlLabel, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const config = require('../config.json');

export default function RouteMap() {
    const [airline, setAirline] = useState('');  
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [data3, setData3] = useState([]);
    const [allAirlines, setAllAirlines] = useState([]);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/get_airlines`)
          .then(res => res.json())
           .then(resJson => {
            setAllAirlines(resJson);
          });
      }, []);

     const search = () => {
        let url = `http://${config.server_host}:${config.server_port}/get_route_map/${airline}`;
        fetch(url)
          .then(res => res.json())
          .then(resJson => {
            const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
            setData(resWithId);
          });

        fetch(`http://${config.server_host}:${config.server_port}/get_route_map_count/${airline}`)
        .then(res => res.json())
        .then(resJson => {
            const resWithId2 = resJson.map((result) => ({ id: result.res_id, ...result }));
            setData2(resWithId2);
        });

        fetch(`http://${config.server_host}:${config.server_port}/get_route_map_countries/${airline}`)
        .then(res => res.json())
        .then(resJson => {
            const resWithId3 = resJson.map((result) => ({ id: result.res_id, ...result }));
            setData3(resWithId3);
        });
       }

       const columns = [
    { field: 'sourceCity', headerName: 'Source City' },
    { field: 'sourceCountry', headerName: 'Source Country', width: 150},
    { field: 'sourceIata', headerName: 'Source Airport' },
    { field: 'destCity', headerName: 'Dest City' },
    { field: 'destCountry', headerName: 'Dest Country', width: 150 },
    { field: 'destIata', headerName: 'Dest Airport' },
    ]

    // const menuItems = [
    //     { value: "", label: "None" },
    //     { value: "American Airlines", label: "American Airlines" },
    //     { value: "Delta Air Lines", label: "Delta Air Lines" },
    //     { value: "United Airlines", label: "United Airlines" },
    //     { value: "Southwest Airlines", label: "Southwest Airlines" }
    //   ];
    const menuItems = allAirlines.map((airline) => (
        <MenuItem key={airline.airlineName} value={airline.airlineName}>
          {airline.airlineName}
        </MenuItem>
      ));

    return (

    <Container>
    <h2>Enter an airline to discover all the exciting destinations it flies to: </h2>
      {/* <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Enter your airline"
            variant="outlined"
            fullWidth
            onChange={(e) => setAirline(e.target.value)}
          />
        </Grid>
      </Grid> */}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
        <FormControl variant="outlined" fullWidth>
        <InputLabel id="airline-label">Select your airline</InputLabel>
        <Select
            labelId="airline-label"
            value={airline}
            label="Select your airline"
            onChange={(e) => setAirline(e.target.value)}
        >
        {menuItems}

        </Select>
        </FormControl>

        </Grid>
      </Grid>

      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>

      <div style={{ display: 'flex' }}>
        <div>
            <h2>Country and City Count</h2>
            <BarChart width={600} height={300} data={data2}>
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cities" fill="#8884d8" />
                <Bar dataKey="countries" fill="#82ca9d" />
            </BarChart>
        </div>
        <div>
            <h2>Top Country and Route Count</h2>
            <BarChart width={600} height={300} data={data3}>
                <XAxis dataKey="destCountry" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="routes" fill="#8884d8" />
            </BarChart>
        </div>
    </div>

    <h2>Detailed Routes</h2>
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
