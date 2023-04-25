import { useEffect, useState } from 'react';
import { Button, Checkbox, Grid, Box, Container, TextField, FormControlLabel, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const config = require('../config.json');

export default function BroadestCoverage() {
    const [pageSize, setPageSize] = useState(20);
    const [data, setData] = useState([]);


    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/broadest_coverage_ratings`)
          .then(res => res.json())
          .then(resJson => {
            const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
            setData(resWithId);
          });
      }, []);

    const columns = [
        { field: 'name', headerName: 'Airline Name', width:600 },
        { field: 'number_of_routes', headerName: 'Number of Routes', width:150  },
        { field: 'overall_rating', headerName: 'Airline Rating', width:150  },
        ]
    
    return (

    <Container>

    <h2>Airlines with the Broadest Coverage</h2>
      <DataGrid
        rows={data}
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
