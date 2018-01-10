import {
  getThreadData,
  fileInThreadToChanData,
  getChanThreadFileUrls,
  formatChanUrl,
  generateFolderForThread,
  generateChanFileDestination
} from '../utils/chan';
import {
  createFolder,
  downloadFilesInParallel,
  requestUrl,
  downloadFile
} from '../utils/requests';
import { loadHtmlString } from '../utils/cheerio';
import { logger } from '../utils/logger';

export class ChanScraper {
  private static MIME_TYPE_WHITELIST = /webm/;

  private static keepWhitelistedFiles = (file: ChanFile) =>
    ChanScraper.MIME_TYPE_WHITELIST.test(file.src);

  public static downloadThread = async (url: string) => {
    logger.reportUrlToDownload(url);
    try {
      const { data } = await requestUrl<string>(formatChanUrl(url));
      const parsedHtmlString = loadHtmlString(data);
      const threadData = getThreadData(parsedHtmlString);

      const unfilteredFiles = getChanThreadFileUrls(parsedHtmlString);
      logger.reportTotalFiles(unfilteredFiles.length);

      const filesToDownload = unfilteredFiles
        .map(fileInThreadToChanData(threadData))
        .filter(ChanScraper.keepWhitelistedFiles);
      logger.reportNumFilesToDownload(filesToDownload.length);

      await createFolder(
        generateFolderForThread(threadData.board, threadData.thread)
      );
      await downloadFilesInParallel<ChanFile>(filesToDownload)(
        downloadFile<ChanFile>(generateChanFileDestination)
      );
    } catch (e) {
      console.error(e);
    }
  };
}
