import React, { Component, useEffect } from 'react';
import { LayersControl, LayerGroup, MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

import { GeoJsonLayer } from './Layers';


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

export function Map(props) {

    const center = [40.7107994, -74.122978,12];

    return (
    <>
        <MapContainer center={center} zoom={13} className="map">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJsonLayer />
        </MapContainer>
    </>);
}
