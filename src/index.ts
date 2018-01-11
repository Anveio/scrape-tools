import { assignScraperToArgument } from './utils/argvHandler';

process.argv.slice(2).forEach(assignScraperToArgument);
