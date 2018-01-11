import { ChanScraper } from '../scrapers/ChanScraper';
import { ImgurScraper } from '../scrapers/ImgurScraper';
import {
  validateImgurSubreddit,
  validate4ChanThread
} from '../utils/validators';

export const assignScraperToArgument = async (arg: string) => {
  try {
    if (validateImgurSubreddit(arg)) {
      return await ImgurScraper.downloadSubredditView(arg);
    } else if (validate4ChanThread(arg)) {
      return await ChanScraper.downloadThread(arg);
    } else {
      throw Error('Could not find a scraper to handle that URL.');
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
