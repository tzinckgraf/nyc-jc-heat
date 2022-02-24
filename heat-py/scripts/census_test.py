import pandas as pd
import censusdata
import geopandas


CENSUS_VARIABLES_NAME = {
    # INCOME
    'B19001_001E': 'Income|Total',
    'B19001_002E': 'Income|Less than $10,000',
    'B19001_003E': 'Income|$10,000 to $14,999',
    'B19001_004E': 'Income|$15,000 to $19,999',
    'B19001_005E': 'Income|$20,000 to $24,999',
    'B19001_006E': 'Income|$25,000 to $29,999',
    'B19001_007E': 'Income|$30,000 to $34,999',
    'B19001_008E': 'Income|$35,000 to $39,999',
    'B19001_009E': 'Income|$40,000 to $44,999',
    'B19001_010E': 'Income|$45,000 to $49,999',
    'B19001_011E': 'Income|$50,000 to $59,999',
    'B19001_012E': 'Income|$60,000 to $74,999',
    'B19001_013E': 'Income|$75,000 to $99,999',
    'B19001_014E': 'Income|$100,000 to $124,999',
    'B19001_015E': 'Income|$125,000 to $149,999',
    'B19001_016E': 'Income|$150,000 to $199,999',
    'B19001_017E': 'Income|$200,000 or more',

    # RACE
    'B02001_001': 'Total:',
    'B02001_002': 'White alone',
    'B02001_003': 'Black or African American alone',
    'B02001_004': 'American Indian and Alaska Native alone',
    'B02001_005': 'Asian alone',
    'B02001_006': 'Native Hawaiian and Other Pacific Islander alone',
    'B02001_007': 'Some other race alone',
    'B02001_008': 'Two or more races:',
    'B02001_009': 'Two races including Some other race',
    'B02001_010': 'Two races excluding Some other race, and three or more races',
}


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


def post_process_income(df):
    cumulative_income_rename = {
        'Less than $10,000':  'Income|10000',
        '$10,000 to $14,999': 'Income|15000',
        '$15,000 to $19,999': 'Income|20000',
        '$20,000 to $24,999': 'Income|25000',
        '$25,000 to $29,999': 'Income|30000',
        '$30,000 to $34,999': 'Income|35000',
        '$35,000 to $39,999': 'Income|40000',
        '$40,000 to $44,999': 'Income|45000',
        '$45,000 to $49,999': 'Income|50000',
        '$50,000 to $59,999': 'Income|55000',
        '$60,000 to $74,999': 'Income|75000',
        '$75,000 to $99,999': 'Income|100000',
        '$100,000 to $124,999': 'Income|125000',
        '$125,000 to $149,999': 'Income|150000',
        '$150,000 to $199,999': 'Income|200000',
        '$200,000 or more': 'Income|All'
    }

    columns_income = [c for c in df.columns if c.startswith('Income|') and 'Total' not in c]
    series_total = df['Income|Total']
    df_income = df[columns_income].rename(
        {c: c.replace("Income|", "") for c in columns_income}, axis=1)
    df_income_percent = df_income.div(series_total, axis=0).cumsum(axis=1)
    df_non_income = df[df.columns.difference(columns_income + ["Income|Total"])]
    return (pd.concat([df_non_income, df_income_percent], axis=1)
        .rename(cumulative_income_rename, axis=1))


def get_geo_data():
    df = geopandas.read_file('data/new_york_city.geojson')
    return df


def main():
    df_geo = get_geo_data()

    # the purpose of the below is to cache the data so we do not need to keep running this
    df_census = pd.read_csv('data/census.csv', dtype={'tract': object}).rename(CENSUS_VARIABLES_NAME, axis=1).pipe(post_process_income)

    #df_census = get_census_data()
    #df_census.to_csv('data/census.csv', index=False)

    import ipdb; ipdb.set_trace() # BREAKPOINT
    df = df_census.merge(df_geo, left_on="tract", right_on="CT2020")
    geopandas.GeoDataFrame(df).to_file("data/nyc_all_data.geojson", driver="GeoJSON")

    import ipdb; ipdb.set_trace() # BREAKPOINT
    pass

if __name__ == '__main__':
    main()
