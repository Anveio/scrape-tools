import { ChanScraper } from './scrapers/ChanScraper';

process.argv.slice(2).forEach(ChanScraper.downloadThread);
