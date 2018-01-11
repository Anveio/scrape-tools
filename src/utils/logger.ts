export const logger = {
  scraper: (scraper: string) =>
    console.info(`URL interpreted as ${scraper}`),
  reportUrlToDownload: (url: string) => console.info(`Fetching ${url}`),
  reportTotalFiles: (numFiles: number) =>
    console.info(`Found ${numFiles} files total.`),
  reportNumFilesToDownload: (numFiles: number) =>
    console.info(`Downloading ${numFiles} files.`),
  reportNoFilesToDownload: () => console.log('Found no files to download.')
};
