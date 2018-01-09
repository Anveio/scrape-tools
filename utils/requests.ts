import axios from 'axios';
import * as https from 'https';
import * as fs from 'fs-extra';
import { generateFileDestination, generateFolderForThread } from './chan';

export const requestUrl = async <T>(url: string) => {
  try {
    return await axios.get<T>(url);
  } catch (e) {
    throw new Error(`Network Error: failed to fetch thread: ${url}`);
  }
};

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
