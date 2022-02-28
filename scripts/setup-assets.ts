import {
  createWriteStream,
  createReadStream,
  unlinkSync,
  rmSync
} from 'fs';
import * as stream from 'stream';
import { promisify } from 'util';

import axios from 'axios';
import unzipper from 'unzipper';


const finished = promisify(stream.finished);

const nycRasterZipUrl = 'https://files.osf.io/v1/resources/j6eqr/providers/osfstorage/61856f082b61750162f4725f?action=download&direct&version=1';
const njRasterZipUrl = 'https://files.osf.io/v1/resources/6rwbg/providers/osfstorage/61671c9dc5565802714bd0b5?action=download&direct&version=1';


async function main(): Promise<void> {
  await Promise.all([
    downloadAndExtract(nycRasterZipUrl, 'public/rasters/nyc'),
    downloadAndExtract(njRasterZipUrl, 'public/rasters/nj')
  ]);
};

async function downloadAndExtract(url: string, outputDir: string): Promise<void> {
  rmSync(outputDir, { recursive: true, force: true });

  const tempZipFileName = `tempfile-${+new Date()}.zip`;

  await downloadFile(url, tempZipFileName);

  await new Promise((resolve: Function) => {
    createReadStream(tempZipFileName).pipe(unzipper.Extract({path: outputDir})).on('close', () => resolve('close'));
  });

  unlinkSync(tempZipFileName);
}

async function downloadFile(fileUrl: string, outputLocationPath: string): Promise<void> {
  const writer = createWriteStream(outputLocationPath);

  await axios({
    method: 'GET',
    url: fileUrl,
    responseType: 'stream',
  }).then(async response => {
    response.data.pipe(writer);
    return finished(writer); //this is a Promise
  });
}


main();
