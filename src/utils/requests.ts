import axios, { AxiosRequestConfig } from 'axios';
import * as https from 'https';
import * as fs from 'fs-extra';

export const requestUrl = async <T>(
  url: string,
  config?: AxiosRequestConfig
) => {
  try {
    return await axios.get<T>(url, config);
  } catch (e) {
    throw new Error(`Network Error: failed to fetch url: ${url}`);
  }
};

export const downloadFile = <T extends DownloadableFile>(
  generateDestination: (file: T) => string
) => async (file: T) => {
  try {
    const writeStream = fs.createWriteStream(generateDestination(file));
    return new Promise((resolve, reject) => {
      https.get(file.url, res => {
        res.pipe(writeStream);

        res.on('end', () => {
          process.stdout.write('.');
          resolve(file.url);
        });

        res.on('error', e => {
          console.error(e);
          reject(file.url);
        });
      });
    });
  } catch (e) {
    console.error(`Failed to download file: ${file.url}`);
    throw e;
  }
};

export const requestFilesInParallel = <T>(files: T[]) => (
  downloadFn: (value: T) => Promise<{}>
) => Promise.all(files.map(downloadFn));
