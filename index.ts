// import { ChanScraper } from './scrapers/ChanScraper';
import { ImgurScraper } from './scrapers/ImgurScraper';

process.argv.slice(2).forEach(ImgurScraper.downloadSubredditView);
