import { load } from 'cheerio';

export const prependSecureSchemeToUrl = (url: string) => {
  if (url.startsWith('http')) {
    return url.replace(/http/, 'https');
  } else if (url.startsWith('//')) {
    return 'https:' + url;
  } else {
    return 'https://' + url;
  }
};

export const loadHtmlString = (html: string) => load(html);

export const getHrefAttribute = (el: CheerioElement) => el.attribs.href;

export const getSrcAttribute = (el: CheerioElement) => el.attribs.src;

export const filterInvalidString = (str: string) => str !== undefined;
