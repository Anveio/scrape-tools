import { ChanScraper } from '../scrapers/ChanScraper';
import { ImgurScraper } from '../scrapers/ImgurScraper';
import {
  validateImgurSubreddit,
  validate4ChanThread
} from '../utils/validators';
import { logger } from '../utils/logger';

export const assignScraperToArgument = async (arg: string) => {
  try {
    if (validateImgurSubreddit(arg)) {
      logger.scraper('Imgur Subreddit');
      return await ImgurScraper.downloadSubredditView(arg);
    } else if (validate4ChanThread(arg)) {
      logger.scraper('4Chan thread');
      return await ChanScraper.downloadThread(arg);
    } else {
      throw Error('Could not find a scraper to handle that URL.');
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
