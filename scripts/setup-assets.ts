import {
  createWriteStream,
  createReadStream,
  unlinkSync,
  rmSync,
  existsSync,
  mkdirSync
} from 'fs';
import * as stream from 'stream';
import { promisify } from 'util';

import axios from 'axios';
import unzipper from 'unzipper';


const finished = promisify(stream.finished);


async function main(): Promise<void> {
  const nycRasterZipUrl = 'https://files.osf.io/v1/resources/j6eqr/providers/osfstorage/61856f082b61750162f4725f?action=download&direct&version=1';
  const nycTraverseZipUrl = 'https://files.osf.io/v1/resources/j6eqr/providers/osfstorage/61d5e591b0ea71120cb2a84f?action=download&direct&version=1';

  const njRasterZipUrl = 'https://files.osf.io/v1/resources/6rwbg/providers/osfstorage/61671c9dc5565802714bd0b5?action=download&direct&version=1';
  const njTraverseZipUrl = 'https://files.osf.io/v1/resources/6rwbg/providers/osfstorage/61671c7186713b026e8ffa00?action=download&direct&version=1';

  resetDir('private/traverses');

  await Promise.all([
    downloadAndExtract(nycRasterZipUrl, 'public/rasters/nyc'),
    downloadFile(nycTraverseZipUrl, 'private/traverses/nyc.zip'),

    downloadAndExtract(njRasterZipUrl, 'public/rasters/nj'),
    downloadFile(njTraverseZipUrl, 'private/traverses/nj.zip'),
  ]);
};

function resetDir(dir: string): void {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}

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
