import { useEffect, useState } from 'react';
import { Button, Checkbox, Grid, Box, Container, TextField, FormControlLabel, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const config = require('../config.json');

export default function AirportRanking() {
    const [pageSize, setPageSize] = useState(20);
    const [overall, setOverall] = useState([]);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/top_countries/`)
          .then(res => res.json())
          .then(resJson => {
            const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
            setOverall(resWithId);
          });

      }, []);

    const columns = [
        { field: 'name', headerName: 'Country Name', width:600 },
        { field: 'rating', headerName: 'Rating', width:150  },
        ]
    
    return (

    <Container>

    <h2>Airport Overall Rating (Out of 10) Ranked by Country</h2>
      <DataGrid
        rows={overall}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[50, 100, 150]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

    <h1> </h1>
  
    </Container>
    
    );
  };
