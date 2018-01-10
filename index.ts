import { ChanScraper } from './scrapers/ChanScraper';
import { ImgurScraper } from './scrapers/ImgurScraper';

process.argv.slice(2).forEach((arg: string) => {
  if (/imgur/.test(arg) && /\/r\//.test(arg)) {
    return ImgurScraper.downloadSubredditView(arg);
  } else if (/4chan/.test(arg)) {
    return ChanScraper.downloadThread(arg);
  } else {
    console.error('Invalid URL.');
    return;
  }
});
