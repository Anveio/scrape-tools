import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as https from 'https';
import * as fs from 'fs-extra';

export const requestUrl = async <T>(
  url: string,
  config?: AxiosRequestConfig
) => {
  try {
    return await axios.get<T>(url, config);
  } catch (e) {
    console.warn(e);
    throw new Error(`Network Error: failed to fetch url: ${url}`);
  }
};

export const requestUrlsInParallel = (urls: string[]) =>
  Promise.all(urls.map(url => axios.get<string>(url)));

export const downloadFile = <T extends DownloadableFile>(
  generateDestination: (file: T) => string
) => async (file: T) => {
  try {
    const writeStream = await fs.createWriteStream(generateDestination(file));
    const downloadRequest = https.get(file.src, res => {
      res.pipe(writeStream);
    });

    downloadRequest.on('finish', () => {
      process.stdout.write('.');
    });

    downloadRequest.on('error', console.error);
  } catch (e) {
    console.error(`Failed to download file: ${file.src}`);
  }
};

export const downloadFilesInParallel = <T>(files: T[]) => (
  downloadFn: (value: T) => Promise<void>
) => Promise.all(files.map(downloadFn));

export const selectData = <T>(response: AxiosResponse<T>) => response.data;
