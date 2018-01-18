import * as path from 'path';

import {
  BASE_PICTURE_DIRECTORY,
  CHAN_MIME_TYPE_WHITELIST,
  CHARACTER_BLACKLIST
} from '../constants';

import { prependSecureSchemeToUrl } from './urls';

const filenameEllipsis = /(\(...)\)/;

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

export const getChanFiles = (
  $: CheerioStatic,
  metadata: ChanThreadData
): ChanFile[] =>
  Array.from($('div.fileText > a '))
    .map(createChanData(metadata))
    .filter(filterInvalidUrl)
    .filter(keepWhitelistedFiles);

const keepWhitelistedFiles = (file: ChanFile) =>
  CHAN_MIME_TYPE_WHITELIST.test(file.url);

const formatBoardName = (unformattedBoardName: string): string =>
  unformattedBoardName.split(' - ')[0].replace(CHARACTER_BLACKLIST, '');

const hrefToThreadTitle = (href: string): string =>
  href.split('/').slice(-1)[0];

const createChanData = (metadata: ChanThreadData) => (
  el: CheerioElement
): ChanFile => ({
  filename: getFileName(el) || el.attribs.href,
  url: prependSecureSchemeToUrl(el.attribs.href),
  board: metadata.board,
  thread: metadata.thread
});

const filterInvalidUrl = (file: ChanFile) => file.url !== undefined;

const getFileName = (el: CheerioElement) => {
  const rawFileName = el.firstChild.data;
  if (rawFileName && rawFileName.length > 0) {
    return rawFileName
      .replace(filenameEllipsis, '')
      .replace(CHARACTER_BLACKLIST, '');
  } else {
    return null;
  }
};
