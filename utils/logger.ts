export const logger = {
  reportUrlToDownload: (url: string) => console.info(`Fetching ${url}`),
  reportTotalFiles: (numFiles: number) =>
    console.info(`Found ${numFiles} files total.`),
  reportNumFilesToDownload: (numFiles: number) =>
    console.info(`Downloading ${numFiles} files.`)
};