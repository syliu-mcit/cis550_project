import { useEffect, useState } from 'react';
import { Button, Checkbox, Grid, Box, Container, TextField, FormControlLabel, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const config = require('../config.json');

export default function AirportRanking() {
    const [pageSize, setPageSize] = useState(5);
    const [overall, setOverall] = useState([]);
    const [queue, setQueue] = useState([]);
    const [clean, setClean] = useState([]);
    const [shop, setShop] = useState([]);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/top_airport/overall_rating`)
          .then(res => res.json())
          .then(resJson => {
            const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
            setOverall(resWithId);
          });

        fetch(`http://${config.server_host}:${config.server_port}/top_airport/queue_rating`)
        .then(res => res.json())
        .then(resJson => {
          const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
          setQueue(resWithId);
        });

        fetch(`http://${config.server_host}:${config.server_port}/top_airport/clean_rating`)
        .then(res => res.json())
        .then(resJson => {
          const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
          setClean(resWithId);
        });

        fetch(`http://${config.server_host}:${config.server_port}/top_airport/shop_rating`)
        .then(res => res.json())
        .then(resJson => {
          const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
          setShop(resWithId);
        });

      }, []);

    const columns = [
        { field: 'name', headerName: 'Airport Name', width:600 },
        { field: 'rating', headerName: 'Rating', width:150  },
        ]
    
    return (

    <Container>

    <h2>Airport Ranking by Overall Rating (Out of 10)</h2>
      <DataGrid
        rows={overall}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 20]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

    <h2>Airport Ranking by Queue Rating (Out of 5)</h2>
      <DataGrid
        rows={queue}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 20, 50]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

    <h2>Airport Ranking by Cleanliness Rating (Out of 5)</h2>
      <DataGrid
        rows={clean}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 20, 50]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

    <h2>Airport Ranking by Shop Rating (Out of 5)</h2>
      <DataGrid
        rows={shop}
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
