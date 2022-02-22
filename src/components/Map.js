import React, { Component, useEffect, useRef } from 'react';
import { LayersControl, LayerGroup, MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

import { GeoJsonLayer } from './Layers';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import { GeotiffLayer, GeoRasterTiffLayer } from './GeotiffLayer';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

export function Map(props) {

    const center = [40.7107994, -74.122978,12];
    const rasterRef = useRef();
    //const rasterUrl = "../data/rasters/jc/af_heat_index_f_ranger.tif";
    const rasterUrl = "../data/rasters/nyc/af_hi_f.tif";
    //const rasterUrl = "/af_heat_index_f_ranger.tif";
    const rasterOpts = {
        band: 0,
        displayMin: 0,
        displayMax: 3000,
        name: "Heat index",
        colorScale: "rainbow",
        clampLow: false,
        clampHigh: true
        //vector:true
    };

    return (
    <>
        <MapContainer center={center} zoom={13} className="map">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJsonLayer />
            <GeoRasterTiffLayer
                layerRef={rasterRef}
                url={rasterUrl}
                options={rasterOpts}
            />
        </MapContainer>
    </>);
}
