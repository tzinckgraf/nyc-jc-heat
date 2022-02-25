import React, { Component, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { Map } from './components/Map';
import { IncomeSlider } from './components/Settings';

import './App.css';
import 'leaflet/dist/leaflet.css';

function TabPanel(props) {
const { children, value, index, ...other } = props;

    return (
    <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
    >
        {value === index && (
        <Box sx={{ height: '80vh' }}>
            {children}
        </Box>
        )}
    </div>
    );
}

function App() {
    const [ heatmapOpacity, setHeatmapOpacity ] = useState(.5);
    const [ censusOpacity, setCensusOpacity ] = useState(.2);

    const [ income, setIncome ] = useState(20);
    const [ tab, setTab ] = useState(0);

    const changeTab = (event, newTab) => {
        setTab(newTab);
    };

    return (
    <div className="App">
        <Grid container sx={{ marginTop: '5vh', height: '90vh' }} spacing={1}>
            <Grid item xs={2} sx={{ marginLeft: '1rem', marginRight: '1rem' }}>
                <Tabs value={tab} onChange={changeTab} >
                    <Tab label='Map Settings' id='tab-0' />
                    <Tab label='Story' id='tab-2' />
                </Tabs>
                <TabPanel value={tab} index={0}>
                    <IncomeSlider
                        setIncome={setIncome}
                    />
                </TabPanel>
                <TabPanel value={tab} index={1}>
                    <Typography component='h3'>This is a story</Typography>
                </TabPanel>
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
