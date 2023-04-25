import { useEffect, useState } from 'react';
import { Button, Checkbox, Grid, Box, Container, TextField, FormControlLabel, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const config = require('../config.json');

export default function AirlineRanking() {
    const [pageSize, setPageSize] = useState(5);
    const [overall, setOverall] = useState([]);
    const [seat, setSeat] = useState([]);
    const [staff, setStaff] = useState([]);
    const [food, setFood] = useState([]);
    const [entertain, setEntertain] = useState([]);
    const [value, setValue] = useState([]);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/top_airline/overall_rating`)
          .then(res => res.json())
          .then(resJson => {
            const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
            setOverall(resWithId);
          });

        fetch(`http://${config.server_host}:${config.server_port}/top_airline/seat_rating`)
        .then(res => res.json())
        .then(resJson => {
          const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
          setSeat(resWithId);
        });

        fetch(`http://${config.server_host}:${config.server_port}/top_airline/staff_rating`)
        .then(res => res.json())
        .then(resJson => {
          const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
          setStaff(resWithId);
        });

        fetch(`http://${config.server_host}:${config.server_port}/top_airline/food_rating`)
        .then(res => res.json())
        .then(resJson => {
          const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
          setFood(resWithId);
        });

        fetch(`http://${config.server_host}:${config.server_port}/top_airline/entertain_rating`)
        .then(res => res.json())
        .then(resJson => {
          const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
          setEntertain(resWithId);
        });

        fetch(`http://${config.server_host}:${config.server_port}/top_airline/value_rating`)
        .then(res => res.json())
        .then(resJson => {
          const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
          setValue(resWithId);
        });

      }, []);

    const columns = [
        { field: 'name', headerName: 'Airline Name', width:600 },
        { field: 'rating', headerName: 'Rating', width:150  },
        ]
    
    return (

    <Container>

    <h2>Airline Ranking by Overall Rating (Out of 10)</h2>
      <DataGrid
        rows={overall}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 20]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

    <h2>Airline Ranking by Seat Rating (Out of 5)</h2>
      <DataGrid
        rows={seat}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 20, 50]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

    <h2>Airline Ranking by Staff Rating (Out of 5)</h2>
      <DataGrid
        rows={staff}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 20, 50]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

    <h2>Airline Ranking by Food Rating (Out of 5)</h2>
      <DataGrid
        rows={food}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 20, 50]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

    <h2>Airline Ranking by Entertain Rating (Out of 5)</h2>
      <DataGrid
        rows={entertain}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 20, 50]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

    <h2>Airline Ranking by Value Rating (Out of 5)</h2>
      <DataGrid
        rows={value}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 20, 50]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

    <h1> </h1>
  
    </Container>
    
    );
  };
