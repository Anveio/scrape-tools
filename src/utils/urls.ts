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

export const prependSecureSchemeToUrl = (url: string) => {
  if (url.startsWith('http')) {
    return url.replace(/http/, 'https');
  } else if (url.startsWith('//')) {
    return 'https:' + url;
  } else {
    return 'https://' + url;
  }
};

export const formatChanUrl = (url: string) => url.replace(/(#.*)/g, '');
