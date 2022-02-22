import React, { Component, useEffect, useState } from "react";
import L from "leaflet";
import { useLeafletContext } from '@react-leaflet/core'

import "leaflet-geotiff"
import "leaflet-geotiff/leaflet-geotiff-plotty"
import "leaflet-geotiff/leaflet-geotiff-vector-arrows"

import chroma from "chroma-js";

// due to weird import issues, it was easier to use these as require statements
var parseGeoraster = require("georaster");
var GeoRasterLayer = require("georaster-layer-for-leaflet");


export const GeotiffLayer = (props) => {
    /*
     * This does not actually work, but is another library I was trying.
     *
     * It may actally work now
     */
    const context = useLeafletContext();

    useEffect(() => {
        const { url, options, layerRef } = props;
        options.renderer = new L.LeafletGeotiff.Plotty(options);

        const container = context.layerContainer || context.map
        const geotiff = L.leafletGeotiff(url, options);

        container.addLayer(geotiff)

        return () => {
            container.removeLayer(geotiff)
        }
    });

    return null;
}


export const GeoRasterTiffLayer = (props) => {
    const { url, options, layerRef } = props;
    const context = useLeafletContext();
    const [ data, setData ] = useState(null);
    console.log(parseGeoraster);

    useEffect(() => {
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => {
                console.log(url);
                return parseGeoraster(arrayBuffer)})
            .then(data => setData(data))
            .catch(err => console.log(err));
    }, [url]);

    useEffect(() => {
        const container = context.layerContainer || context.map
        /*
        GeoRasterLayer is an extension of GridLayer,
        which means can use GridLayer options like opacity.

        Just make sure to include the georaster option!

        Optionally set the pixelValuesToColorFn function option to customize
        how values for a pixel are translated to a color.

        http://leafletjs.com/reference-1.2.0.html#gridlayer
        */
        if (data == null) return;
        const colorChroma = chroma.scale(['#f00', '#0f0']).domain([data.mins[0], data.maxs[0]]);
        var layer = new GeoRasterLayer({
            georaster: data,
            opacity: 0.7,
            resolution: 64,
            pixelValuesToColorFn: values => {
                return values[0] > 1 ? colorChroma(values[0]) : null;
                //return values[0] > 1 ? '#ffffff' : '#000000';
            }
        });
        
        container.addLayer(layer)
        return () => {
            container.removeLayer(layer);
        };
    });

    return null;
}