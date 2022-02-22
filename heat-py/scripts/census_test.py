import pandas as pd
import censusdata
import geopandas

def get_census_data():
    # New York County - 061
    variables_income = [
        'B19001_001E',
        'B19001_002E',
        'B19001_003E',
        'B19001_004E',
        'B19001_005E',
        'B19001_006E',
        'B19001_007E',
        'B19001_008E',
        'B19001_009E',
        'B19001_010E',
        'B19001_011E',
        'B19001_012E',
        'B19001_013E',
        'B19001_014E',
        'B19001_015E',
        'B19001_016E',
        'B19001_017E',
    ]

    variables_total_population = [
        'B02001_001',
        'B02001_002',
        'B02001_003',
        'B02001_004',
        'B02001_005',
        'B02001_006',
        'B02001_007',
        'B02001_008',
    ]
    data = censusdata.download(
        'acs5',
        2019,
        censusdata.censusgeo([('state', '36'), ('county', '061'), ('block group', '*')]),
        variables_income
    )

    df_census = data.reset_index()
    df_block_info = pd.DataFrame.from_records(df_census["index"].apply(lambda x: dict(x.geo)).tolist())
    return pd.concat([df_census, df_block_info], axis=1)


def get_geo_data():
    df = geopandas.read_file('data/new_york_city.geojson')
    return df


def main():
    df_geo = get_geo_data()

    df_census = pd.read_csv('data/census.csv', dtype={'tract': object})
    #df_census = get_census_data()
    #df_census.to_csv('data/census.csv', index=False)

    df = df_census.merge(df_geo, left_on="tract", right_on="CT2020")
    geopandas.GeoDataFrame(df).to_file("../data/nyc_all_data.geojson", driver="GeoJSON")

    import ipdb; ipdb.set_trace() # BREAKPOINT
    pass

if __name__ == '__main__':
    main()
