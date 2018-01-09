export const extractFileNameFromUrl = (url: string): string => {
  const splitUrl = url.split('/');
  return splitUrl[splitUrl.length - 1];
};

export const formatImgurUrl = (url: string): string => {
  if (/\/top|\/new/.test(url)) {
    return url + '.json';
  } else {
    return url + 'new.json';
  }
};
