import React, { Component, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';

import { Map } from './components/Map';
import { IncomeSlider } from './components/Settings';

import './App.css';
import 'leaflet/dist/leaflet.css';

function App() {
    const [ heatmapOpacity, setHeatmapOpacity ] = useState(.5);
    const [ censusOpacity, setCensusOpacity ] = useState(.2);

    const [ income, setIncome ] = useState(20);

    return (
    <div className="App">
        <Grid container sx={{ marginTop: '5vh', height: '90vh' }} spacing={1}>
            <Grid item xs={2} sx={{ marginLeft: '1rem', marginRight: '1rem' }}>
                <IncomeSlider 
                    setIncome={setIncome}
                />
            </Grid>
            <Grid item xs={9}>
                <Map
                    income={income}
                />
            </Grid>
        </Grid>
    </div>
    );
}

export default App;
