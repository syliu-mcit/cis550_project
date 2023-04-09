import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import './HomePage.css';

// import LazyTable from '../components/LazyTable';
// import SongCard from '../components/SongCard';
const config = require('../config.json');

export default function HomePage() {

  return (
    <Container className="homepage-container">
      {/* SongCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
      {/* {selectedSongId && <SongCard songId={selectedSongId} handleClose={() => setSelectedSongId(null)} />} */}
      <h2>
        {/* <Link onClick={() => setSelectedSongId(songOfTheDay.song_id)}>{songOfTheDay.title}</Link> */}
      </h2>
      <Divider />
      <h2>Welcome to SimpliFly, we hope you have a pleasant journey.</h2>
       {/* <LazyTable route={`http://${config.server_host}:${config.server_port}/top_songs`} columns={songColumns} /> */}
      <Divider />
      {/* TODO (TASK 16): add a h2 heading, LazyTable, and divider for top albums. Set the LazyTable's props for defaultPageSize to 5 and rowsPerPageOptions to [5, 10] */}
      <Divider />
      {/* <LazyTable route={`http://${config.server_host}:${config.server_port}/top_albums`} columns={albumColumns} defaultPageSize={5} rowsPerPageOptions={[5, 10]} /> */}
      <Divider />
      {/* TODO (TASK 17): add a paragraph (<p>text</p>) that displays the value of your author state variable from TASK 13 */}
      <footer>Designed by dataAvengers, Spring 2023 </footer>      
    </Container>
  );
};
