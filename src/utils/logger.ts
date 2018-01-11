export const log = {
  urlToDownload: (url: string) => console.info(`Fetching ${url}`),
  totalFilesFound: (numFiles: number) =>
    console.info(`Found ${numFiles} files total.`),
  numFilesToDownload: (numFiles: number) =>
    console.info(`Downloading ${numFiles} files.`),
  noFilesToDownload: () => console.info('Found no files to download.')
};
