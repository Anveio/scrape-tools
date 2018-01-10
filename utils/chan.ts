import * as path from 'path';

import { BASE_PICTURE_DIRECTORY } from '../constants';
import {
  prependSecureSchemeToUrl,
  getHrefAttribute,
  filterInvalidString
} from './cheerio';
import { extractFileNameFromUrl } from './urls';

export const generateChanFileDestination = (file: ChanFile): string =>
  path.join(generateFolderForThread(file.board, file.thread), file.filename);

export const generateFolderForThread = (
  board: string,
  thread: string
): string => {
  return path.join(BASE_PICTURE_DIRECTORY, '4chan', board, thread);
};

export const getThreadData = ($: CheerioStatic): ChanThreadMetaData => {
  var titleData = $('title').text();

  const href = $('link[rel=canonical]').attr('href');

  return {
    board: formatBoardName(titleData),
    thread: hrefToThreadTitle(href)
  };
};

export const fileInThreadToChanData = (threadData: ChanThreadMetaData) => (
  src: string
): ChanFile => ({
  src,
  board: threadData.board,
  thread: threadData.thread,
  filename: extractFileNameFromUrl(src)
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
