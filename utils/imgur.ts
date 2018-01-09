import * as path from 'path';
import * as fs from 'fs-extra';
import {
  getHrefAttribute,
  filterInvalidString,
  loadHtmlString
} from './cheerio';
import { BASE_PICTURE_DIRECTORY } from '../constants';
import { extractFileNameFromUrl } from './urls';

export const selectImgurSubredditThumbnails = (input: CheerioStatic) =>
  Array.from(input('a.image-list-link'));

export const extractAlbumUrls = (data: string): string[] => {
  const html = loadHtmlString(data);
  const albumUrls: CheerioElement[] = selectImgurSubredditThumbnails(html);
  return albumUrls
    .map(getHrefAttribute)
    .filter(filterInvalidString)
    .map(prependImgurHostname);
};

export const extractSubredditName = (url: string): string => {
  const regexpArray = /r\/(.*)/.exec(url);
  if (regexpArray && regexpArray[1]) {
    return regexpArray[1];
  } else {
    throw new Error('Problem parsing imgur subreddit name.');
  }
};

const generateImgurSubredditFolder = (subreddit: string) =>
  path.join(BASE_PICTURE_DIRECTORY, 'imgur', subreddit);

export const generateImgurSubredditDestination = (file: ImgurFileData) =>
  path.join(generateImgurSubredditFolder(file.subreddit), file.filename);

export const createFolderForImgurSubreddit = async (subreddit: string) =>
  await fs.mkdirp(generateImgurSubredditFolder(subreddit));

export const transformImgurApiResponse = (
  data: ImgurImageData
): ImgurFileData => ({
  ext: data.ext,
  filename: `${data.hash}${data.ext}`,
  hash: data.hash,
  src: `https://i.imgur.com/${data.hash}${data.ext}`,
  subreddit: data.subreddit,
  size: data.size
});

const prependImgurHostname = (relativeUrl: string) =>
  `https://imgur.com` + relativeUrl;
