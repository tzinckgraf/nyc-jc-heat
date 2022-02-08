import React, { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';

import shp from "shpjs";
import L from 'leaflet';

import traverses from '../data/traverses.zip';


export function GeoJsonLayer(props) {

    const [features, setFeatures] = useState([]);
    const [renderer, setRenderer] = useState(null);

    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };


    useEffect(() => {
        const renderer = L.canvas({padding: 0.75});
        setRenderer(renderer);
        fetch(traverses).then(r => {
            return shp(r.url);
        }).then(data => {
            console.log(data);
            setFeatures(data);
        });

        /*
        shp(`file:traverses.zip`).then(data => {
            console.log(data);
        });
        */
    }, []);

    const pointToLayer = (feature, latlng) => {
        return L.circleMarker(latlng, geojsonMarkerOptions, {renderer: renderer});
    }

    if (features.length == 0) return (<></>);

    //data={features[0].features.slice(0, 10000)}
    return (<>
        <GeoJSON
            data={features[0].features}
            style={{ color: 'green' }}
            pointToLayer={pointToLayer}
        />;
    </>);
    
}
