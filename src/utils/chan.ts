import * as path from 'path';

import { BASE_PICTURE_DIRECTORY } from '../constants';
import {
  prependSecureSchemeToUrl,
  getHrefAttribute,
  filterInvalidString
} from './cheerio';
import { extractFileNameFromUrl } from './urls';

const MIME_TYPE_WHITELIST = /webm/;

export const generateChanFileDestination = (file: ChanFile): string =>
  path.join(generateFolderForThread(file.board, file.thread), file.filename);

export const generateFolderForThread = (
  board: string,
  thread: string
): string => {
  return path.join(BASE_PICTURE_DIRECTORY, '4chan', board, thread);
};

export const getThreadData = ($: CheerioStatic): ChanThreadData => {
  var titleData = $('title').text();

  const href = $('link[rel=canonical]').attr('href');

  return {
    board: formatBoardName(titleData),
    thread: hrefToThreadTitle(href)
  };
};

export const fileInThreadToChanData = (threadData: ChanThreadData) => (
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

export const filterFiles = (unfilteredFiles: string[]) => (
  threadData: ChanThreadData
) =>
  unfilteredFiles
    .map(fileInThreadToChanData(threadData))
    .filter(keepWhitelistedFiles);

const keepWhitelistedFiles = (file: ChanFile) =>
  MIME_TYPE_WHITELIST.test(file.src);

const formatBoardName = (unformattedBoardName: string): string =>
  unformattedBoardName.split(' - ')[0].replace(/\//g, '');

const hrefToThreadTitle = (href: string): string =>
  href.split('/').slice(-1)[0];