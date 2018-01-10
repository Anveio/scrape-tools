import * as path from 'path';
import {
  getHrefAttribute,
  filterInvalidString,
  loadHtmlString
} from './cheerio';
import { BASE_PICTURE_DIRECTORY } from '../constants';

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

export const generateImgurSubredditFolderPath = (subreddit: string) =>
  path.join(BASE_PICTURE_DIRECTORY, 'imgur', subreddit);

export const generateImgurSubredditFilePath = (file: ImgurFile) =>
  path.join(generateImgurSubredditFolderPath(file.subreddit), file.filename);

export const transformImgurApiResponse = (data: ImgurImageData): ImgurFile => {
  const ext = normalizeExtension(data.ext);
  return {
    ext,
    filename: `${data.hash}${ext}`,
    hash: data.hash,
    src: `https://i.imgur.com/${data.hash}${ext}`,
    subreddit: data.subreddit,
    size: data.size
  };
};

const normalizeExtension = (ext: string) => {
  /**
   * Sometimes extensions have wierd question mark symbols at the end.
   */
  return ext.replace(/(\?.*)/, '');
};

const prependImgurHostname = (relativeUrl: string) =>
  `https://imgur.com` + relativeUrl;
