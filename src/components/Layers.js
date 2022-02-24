import React, { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';

import chroma from "chroma-js";
import L from 'leaflet';
import shp from "shpjs";


export function GeoJsonPointLayer(props) {
    /**
     * A layer for the individual traverses.
     *
     * This layer runs pretty slow as it shows every single
     * traversal point. For improved performance, everything
     * is rendered on one canvas with the same fillColor and color,
     * but that only does so much with 30k points.
     *
     */
    const { url } = props;
    const [features, setFeatures] = useState([]);
    const [renderer, setRenderer] = useState(null);

    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#ff7800",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    useEffect(() => {
        const renderer = L.canvas({padding: 0.75});
        setRenderer(renderer);
        fetch(url).then(r => {
            return shp(r.url);
        }).then(data => {
            setFeatures(data);
        });
    }, []);

    const pointToLayer = (feature, latlng) => {
        return L.circleMarker(latlng, geojsonMarkerOptions, {renderer: renderer});
    }

    if (features.length == 0) return (<></>);

    return (<>
        <GeoJSON
            data={features[0].features}
            style={{ color: 'green' }}
            pointToLayer={pointToLayer}
        />;
    </>);
}


export function GeoJsonLayer(props) {
    /**
     * The GeoJsonLayer is used to show the individual blocks
     * as they come in GeoJSON format.
     *
     */

    const { url, opacity, income } = props;
    const colorChroma = chroma.scale(['#fff', '#000']);

    const [features, setFeatures] = useState([]);
    const [renderer, setRenderer] = useState(null);

    const onEachFeature = (feature, layer) => {
        layer.on({
            //mouseover: (e) => console.log(feature),
            //mouseout: (e) => console.log(feature),
        });
    };

    const onStyle = (feature) => {
        // set the opacity of the border based on percentage of population less than the income
        const opacity = feature.properties[`Income|${income}`];
        return {
            fillOpacity: 0,
            opacity: 1,
            color: colorChroma(opacity),
            weight: 3,
        };
    }

    useEffect(() => {
        const renderer = L.canvas({padding: 0.75});
        setRenderer(renderer);
        fetch(url,{ headers : {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            }})
        .then(r => r.json())
        .then(data => {
            setFeatures(data);
        });
    }, []);

    if (features.length == 0) return (<></>);

    return (<>
        <GeoJSON
            data={features}
            onEachFeature={onEachFeature}
            style={onStyle}
        />;
    </>);
}

