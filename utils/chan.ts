import * as path from 'path';

import { BASE_PICTURE_DIRECTORY } from '../constants';
import {
  loadHtmlString,
  prependSecureSchemeToUrl,
  getHrefAttribute,
  filterInvalidString
} from './cheerio';
import { extractFileNameFromUrl } from './urls';

export const generateChanFileDestination = (
  info: ChanFileDestination
): string => path.join(generateFolderForThread(info), info.filename);

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

export const getChanThreadFileUrls = (html: string) =>
  selectChanThreadImageHrefs(loadHtmlString(html)).map(
    prependSecureSchemeToUrl
  );

const selectChanThreadImageHrefs = (input: CheerioStatic): string[] =>
  Array.from(input('a.fileThumb'))
    .map(getHrefAttribute)
    .filter(filterInvalidString);
