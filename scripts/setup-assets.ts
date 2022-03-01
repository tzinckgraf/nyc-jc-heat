import { createWriteStream, createReadStream, rmSync, writeFileSync } from 'fs';
import * as stream from 'stream';
import { promisify } from 'util';

import axios from 'axios';
import unzipper from 'unzipper';

import findMaxHeatIndexes from './find-max-heat-indexes';


const finished = promisify(stream.finished);


async function main(): Promise<void> {
  const nycRasterZipUrl = 'https://files.osf.io/v1/resources/j6eqr/providers/osfstorage/61856f082b61750162f4725f?action=download&direct&version=1';
  const nycTraverseZipUrl = 'https://files.osf.io/v1/resources/j6eqr/providers/osfstorage/61d5e591b0ea71120cb2a84f?action=download&direct&version=1';
  const nycCensusTractZipUrl = 'https://www2.census.gov/geo/tiger/GENZ2018/shp/cb_2018_36_tract_500k.zip';

  const njRasterZipUrl = 'https://files.osf.io/v1/resources/6rwbg/providers/osfstorage/61671c9dc5565802714bd0b5?action=download&direct&version=1';
  const njTraverseZipUrl = 'https://files.osf.io/v1/resources/6rwbg/providers/osfstorage/61671c7186713b026e8ffa00?action=download&direct&version=1';
  const njCensusTractZipUrl = 'https://www2.census.gov/geo/tiger/GENZ2018/shp/cb_2018_34_tract_500k.zip';

  await Promise.all([
    downloadAndExtract(nycRasterZipUrl, 'public/rasters/nyc'),
    downloadAndExtract(nycTraverseZipUrl, 'private/traverses/nyc'),
    downloadAndExtract(nycCensusTractZipUrl, 'private/census-tracts/ny'),

    downloadAndExtract(njRasterZipUrl, 'public/rasters/nj'),
    downloadAndExtract(njTraverseZipUrl, 'private/traverses/nj'),
    downloadAndExtract(njCensusTractZipUrl, 'private/census-tracts/nj'),
  ]);

  const nycHeatIndexes = await findMaxHeatIndexes('private/census-tracts/ny/cb_2018_36_tract_500k.shp', 'private/traverses/nyc/af_trav.shp');
  const njHeatIndexes = await findMaxHeatIndexes('private/census-tracts/nj/cb_2018_34_tract_500k.shp', 'private/traverses/nj/af_trav.shp');

  const heatIndexFeatureCollection = {
    type: "FeatureCollection",
    features: nycHeatIndexes.concat(njHeatIndexes)
  }

  writeFileSync('public/geojson/max-heat-index.geojson', JSON.stringify(heatIndexFeatureCollection));
}

async function downloadAndExtract(url: string, outputDir: string): Promise<void> {
  rmSync(outputDir, { recursive: true, force: true });

  const tempZipFileName = `tempfile-${+new Date()}.zip`;

  await downloadFile(url, tempZipFileName);

  try {
    await new Promise((resolve: Function) => {
      createReadStream(tempZipFileName)
        .pipe(unzipper.Extract({path: outputDir}))
        .on('close', () => resolve('close'));
    });
  } finally {
    rmSync(tempZipFileName, { force: true });
  }
}

async function downloadFile(fileUrl: string, outputLocationPath: string): Promise<void> {
  const writer = createWriteStream(outputLocationPath);

  await axios({
    method: 'GET',
    url: fileUrl,
    responseType: 'stream',
    timeout: 60000
  }).then(async response => {
    response.data.pipe(writer);
    return finished(writer);
  });
}


main();
