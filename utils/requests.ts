import * as https from 'https';
import * as fs from 'fs-extra';
import { generateFileDestination, generateFolderForThread } from '../utils';

export const downloadFile = async (file: ChanFileData) => {
  try {
    const writeStream = await fs.createWriteStream(
      generateFileDestination(file.metadata)
    );
    https.get(file.src, res => {
      res.pipe(writeStream);
      process.stdout.write('.');
    });
  } catch (e) {
    console.error(`Failed to download file: ${file.src}`);
  }
};

export const downloadFilesInParallel = (files: ChanFileData[]) =>
  Promise.all(files.map(downloadFile));

export const createFolderForThread = async (destination: ChanThreadMetaData) =>
  await fs.mkdirp(generateFolderForThread(destination));
