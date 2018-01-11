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
      throw Error(`Could not find a scraper to handle "${arg}".`);
    }
  } catch (e) {
    throw e;
  }
};

process.on('message', async (msg: string) => {
  try {
    await assignScraperToArgument(msg);
    process.exit();
  } catch (e) {
    console.log(e.message);
    process.exit();
  }
});
