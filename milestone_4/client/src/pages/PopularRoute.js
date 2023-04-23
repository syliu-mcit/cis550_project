import { useEffect, useState } from 'react';
import { Button, Checkbox, Grid, Box, Container, TextField, FormControlLabel, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const config = require('../config.json');

export default function PopularRoute() {
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/get_popular_routes_cities`)
          .then(res => res.json())
          .then(resJson => {
            const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
            setData(resWithId);
          });

          fetch(`http://${config.server_host}:${config.server_port}/get_popular_routes_countries`)
          .then(res => res.json())
          .then(resJson => {
            const resWithId = resJson.map((result) => ({ id: result.res_id, ...result }));
            setData2(resWithId);
          });
      }, []);

    const columns = [
        { field: 'sourceCity', headerName: 'Source City', width:150 },

        { field: 'destCity', headerName: 'Dest City', width:150  },
        { field: 'NumAirlines', headerName: 'Number of Airlines', width:150 },
        { field: 'NumRoutes', headerName: 'Number of Routes', width:150  },
        ]
    
    const columns2 = [
        { field: 'sourceCountry', headerName: 'Source Country', width:150  },
        { field: 'destCountry', headerName: 'Dest Country', width:150  },
        { field: 'NumAirlines', headerName: 'Number of Airlines', width:150 },
        { field: 'NumRoutes', headerName: 'Number of Routes', width:150  },
        ]


    return (

    <Container>

    <h2>Most Popular Routes Between Cities</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 20, 50]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

    <h2>Most Popular Routes Between Countries</h2>
      <DataGrid
        rows={data2}
        columns={columns2}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 20, 50]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

    </Container>

    );
  };
