import * as path from 'path';

export const extractFileNameFromUrl = (url: string): string =>
  url.split('/').slice(-1)[0];

export const formatImgurUrl = (url: string): string => {
  if (/\/top|\/new/.test(url)) {
    return url + '.json';
  } else {
    return path.join(url, 'new.json');
  }
};
