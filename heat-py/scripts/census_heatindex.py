"""
Find the max heat index per a census tract area.

To make this work, you need both to be on the same CRS
It is easier to convert the tif file using the following

gdalwarp -t_srs WGS84 data/rasters/af_hi_f.tif data/rasters/af_hi_f2.tif

You can check the CRS using the check_crs function
"""
import fiona
import json
import numpy as np
import rasterio
from rasterio.features import rasterize
from rasterstats import zonal_stats, point_query


def manual_zones():
    shapefile = "data/nyc_all_data.shp"
    rasterfile = "data/rasters/af_hi_f2.tif"
    id_var = 'index'

    with rasterio.open(rasterfile, crs='EPSG:4326') as src:
        with fiona.open(shapefile, 'r') as shp:
            geoms = [feature['geometry'] for feature in shp]
            index = [feature['properties'][id_var] for feature in shp]

            crosswalk_dict = {}
            for idx, geom in zip(index, geoms):
                geom_rasterize = rasterize([(geom, 1)],
                                        out_shape=src.shape,
                                        transform=src.transform,
                                        all_touched=True,
                                        fill=0,
                                        dtype='uint8')

                if geom_rasterize.any():
                    import ipdb; ipdb.set_trace() # BREAKPOINT
                    pass

                crosswalk_dict[idx] = np.where(geom_rasterize == 1)

def check_crs():
    shapefile = "data/nyc_all_data.shp"
    rasterfile = "data/rasters/af_hi_f2.tif"

    with rasterio.open(rasterfile, crs='EPSG:4326') as src:
        print(src.crs)

    with fiona.open(shapefile, 'r') as shp:
        print(shp.crs)


def main():
    shapefile = "data/nyc_all_data.geojson"
    rasterfile = "data/rasters/af_hi_f2.tif"

    stats = zonal_stats(
        shapefile,
        rasterfile,
        geojson_out=True,
        prefix="heat_index_",
        stats=['max'])

    # lets turn this into a geojson file
    geojson = {
        "type": "FeatureCollection",
        "crs": {
            "type" : "name",
            "properties": {
                "name": "EPSG:4326"
            }
        }
    }
    geojson['features'] = stats
    with open('data/new_york_city_hi.geojson', 'w') as fd:
        fd.write(json.dumps(geojson))


if __name__ == '__main__':
    main()
