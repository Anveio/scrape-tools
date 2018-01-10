import * as path from 'path';

import { BASE_PICTURE_DIRECTORY } from '../constants';
import {
  prependSecureSchemeToUrl,
  getHrefAttribute,
  filterInvalidString
} from './cheerio';
import { extractFileNameFromUrl } from './urls';

export const generateChanFileDestination = (
  info: ChanFileDestination
): string => path.join(generateFolderForThread(info), info.filename);

export const generateFolderForThread = (info: ChanThreadMetaData): string => {
  return path.join(BASE_PICTURE_DIRECTORY, '4chan', info.board, info.thread);
};

export const getThreadData = ($: CheerioStatic): ChanThreadMetaData => {
  var titleData = $('title').text();

  const href = $('link[rel=canonical]').attr('href');

  return {
    board: formatBoardName(titleData),
    thread: hrefToThreadTitle(href)
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

export const getChanThreadFileUrls = ($: CheerioStatic) =>
  selectChanThreadImageHrefs($).map(prependSecureSchemeToUrl);

const selectChanThreadImageHrefs = (input: CheerioStatic): string[] =>
  Array.from(input('a.fileThumb'))
    .map(getHrefAttribute)
    .filter(filterInvalidString);

export const formatChanUrl = (url: string) => url.replace(/(#.*)/g, '');

const formatBoardName = (unformattedBoardName: string): string =>
  unformattedBoardName.split(' - ')[0].replace(/\//g, '');

const hrefToThreadTitle = (href: string): string =>
  href.split('/').slice(-1)[0];
