import {
  getThreadData,
  fileSrcToChanData,
  getChanThreadFileUrls,
  formatChanUrl
} from '../utils/chan';
import {
  createFolderForThread,
  downloadFilesInParallel,
  requestUrl,
  downloadChanFile
} from '../utils/requests';
import { loadHtmlString } from '../utils/cheerio';
import { logger } from '../utils/logger';

export class ChanScraper {
  private static MIME_TYPE_WHITELIST = /webm/;

  private static keepWhitelistedFiles = (file: ChanFileData) =>
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
        .map(fileSrcToChanData(threadData))
        .filter(ChanScraper.keepWhitelistedFiles);
      logger.reportNumFilesToDownload(filesToDownload.length);

      await createFolderForThread(threadData);
      await downloadFilesInParallel<ChanFileData>(filesToDownload)(
        downloadChanFile
      );
    } catch (e) {
      console.error(e);
    }
  };
}
