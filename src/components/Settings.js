import React, { Component, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';


export function Sliders(props) {

    return (
    <Box>
        <IncomeSlider />
    </Box>);
}


export function IncomeSlider(props) {

    const { setIncome } = props;
    const [ value, setValue ] = useState(75);
    const handleChange = (event, newValue) => {
        setValue(newValue);
        setIncome(incomeValueMap[newValue]);
    };

    useEffect(() => {
        setIncome(incomeValueMap[value]);
    }, []);

    const marks = [
        { value: 15, label: '$15k' },
        { value: 20, label: '$20k', }, 
        { value: 25, label: '$25k', },
        { value: 30, label: '$30k', },
        { value: 35, label: '$35k', },
        { value: 40, label: '$40k', },
        { value: 45, label: '$45k', },
        { value: 50, label: '$50k', }, 
        { value: 55, label: '$55k', }, 
        { value: 75, label: '$75k', }, 
        { value: 100, label: '$100k', },
        { value: 125, label: '$125k', },
        { value: 150, label: '$150k', },
        { value: 200, label: '$200k', },
        { value: 250, label: 'All', }, 
    ];

    const incomeValueMap = {
        15: 15000,
        20: 20000,
        25: 25000,
        30: 30000,
        35: 35000,
        40: 40000,
        45: 45000,
        50: 50000,
        55: 55000,
        75: 75000,
        100: 100000,
        125: 125000,
        150: 150000,
        200: 200000,
        250: 'All',
    }

    return (
        <>
        <Typography sx={{ marginTop: '1rem', marginBottom: '1rem' }}>
            Income Percent (less than)
        </Typography>
        <Slider
            aria-label="Income"
            max={250}
            defaultValue={value}
            valueLabelFormat={value => value == 250 ? 'All' : `$${value}k`}
            getAriaValueText={value => value == 250 ? 'All' : `$${value}k`}
            valueLabelDisplay="auto"
            step={null}
            marks={marks}
            onChange={handleChange}
            orientation="vertical"
        />
        </>
    );

}
