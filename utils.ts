import axios from 'axios';
import * as path from 'path';
import { load } from 'cheerio';
import { BASE_PICTURE_DIRECTORY } from './constants';

export const requestUrl = async <T>(url: string) => {
  try {
    return await axios.get<T>(url);
  } catch (e) {
    throw new Error(`Network Error: failed to fetch thread: ${url}`);
  }
};

export const getFileUrls = (html: string) =>
  selectImageHrefs(loadHtmlString(html)).map(prependSecureSchemeToUrl);

export const generateFileDestination = (info: ChanFileDestination): string =>
  path.join(generateFolderForThread(info), info.filename);

export const generateFolderForThread = (info: ChanThreadMetaData): string =>
  path.join(BASE_PICTURE_DIRECTORY, '4chan', info.board, info.thread);

export const getUrlData = (url: string): ChanThreadMetaData => {
  const x = url.split('/');
  return {
    board: x[3],
    thread: x[6]
  };
};

export const fileSrcToChanData = (threadData: ChanThreadMetaData) => (
  src: string
): ChanFileData => ({
  src,
  metadata: {
    board: threadData.board,
    thread: threadData.thread,
    filename: extractFileNameFromUrl(src)
  }
});

const prependSecureSchemeToUrl = (url: string) => {
  if (url.startsWith('http')) {
    return url;
  } else if (url.startsWith('//')) {
    return 'https:' + url;
  } else {
    return 'https://' + url;
  }
};

const loadHtmlString = (html: string) => load(html);

const selectImageHrefs = (input: CheerioStatic): string[] =>
  Array.from(input('a.fileThumb'))
    .map(getHrefAttribute)
    .filter(filterInvalidHrefs);

const getHrefAttribute = (el: CheerioElement) => el.attribs.href;

const filterInvalidHrefs = (href: string) => href !== undefined;

const extractFileNameFromUrl = (url: string): string => {
  const splitUrl = url.split('/');
  return splitUrl[splitUrl.length - 1];
};
