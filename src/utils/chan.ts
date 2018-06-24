import * as path from 'path';
import { BASE_PICTURE_DIRECTORY, CHAN_MIME_TYPE_WHITELIST } from '../constants';
import { ChanPost, ChanPostWithFile } from '../chan-api';

export const generateChanFileDestination = (file: ChanFile): string =>
  path.join(generateFolderForThread(file.board, file.thread), file.filename);

export const generateFolderForThread = (
  board: string,
  thread: string
): string => path.join(BASE_PICTURE_DIRECTORY, '4chan', board, thread);

export const getChanUrlsToDownload = (
  posts: ChanPost[],
  boardName: string,
  threadName: string
): ChanFile[] =>
  (posts.filter(keepOnlyPostsWithFiles) as ChanPostWithFile[])
    .filter(keepWhitelistedFiles)
    .map(
      (post): ChanFile => ({
        board: boardName,
        thread: threadName,
        filename: post.filename + post.ext,
        url: `https://is3.4chan.org/${boardName}/${post.tim}${post.ext}`
      })
    );

const keepWhitelistedFiles = (file: ChanPostWithFile) =>
  CHAN_MIME_TYPE_WHITELIST.test(file.ext);

const keepOnlyPostsWithFiles = (post: ChanPost) => !!post.filename;

export const parseUrl = (regexp: RegExp, errorMessage?: string) => (
  url: string
) => {
  const parseResult = regexp.exec(url);
  if (!parseResult || !parseResult[1]) {
    throw new Error(
      errorMessage ||
        `Unable to obtain result from parsing URL: ${url} with RegExp: ${regexp}.`
    );
  }

  return parseResult[1];
};

const parseBoardName = parseUrl(/4chan\.org\/(.*)\/thread/);
const parseThreadId = parseUrl(/thread\/(.*)\//);

export const formatAsChanCdnUrl = (url: string) => {
  const boardName = parseBoardName(url);
  const threadId = parseThreadId(url);

  return {
    boardName,
    threadId,
    formattedUrl: `https://a.4cdn.org/${boardName}/thread/${threadId}.json`
  };
};

export const getThreadTitle = (post: ChanPost) => {
  if (!post.semantic_url) {
    throw new Error('Unable to generate thread title.');
  }

  return post.semantic_url;
};
