import { load } from 'cheerio';

export const loadHtmlString = (html: string) => load(html);

export const getHrefAttribute = (el: CheerioElement) => el.attribs.href;

export const getSrcAttribute = (el: CheerioElement) => el.attribs.src;
