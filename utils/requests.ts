import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as https from 'https';
import * as fs from 'fs-extra';
import { generateChanFileDestination, generateFolderForThread } from './chan';
import { generateImgurSubredditDestination } from './imgur';

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

export const downloadChanFile = async (file: ChanFileData) => {
  try {
    const writeStream = await fs.createWriteStream(
      generateChanFileDestination(file.metadata)
    );
    https.get(file.src, res => {
      res.pipe(writeStream);
      process.stdout.write('.');
    });
  } catch (e) {
    console.error(`Failed to download file: ${file.src}`);
  }
};

export const downloadImgurFile = async (file: ImgurFileData) => {
  try {
    const writeStream = await fs.createWriteStream(
      generateImgurSubredditDestination(file)
    );
    https.get(file.src, res => {
      res.pipe(writeStream);
      process.stdout.write('.');
    });
  } catch (e) {
    console.error(`Failed to download file: ${file.src}`);
  }
};

export const downloadFilesInParallel = <T>(files: T[]) => (
  downloadFn: (value: T) => void
) => Promise.all(files.map(downloadFn));

export const requestUrlsInParallel = (urls: string[]) =>
  Promise.all(urls.map(url => axios.get<string>(url)));

export const createFolderForThread = async (destination: ChanThreadMetaData) =>
  await fs.mkdirp(generateFolderForThread(destination));

export const selectData = <T>(response: AxiosResponse<T>) => response.data;
