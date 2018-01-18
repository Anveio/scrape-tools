import {
  getThreadData,
  getChanFiles,
  generateFolderForThread,
  generateChanFileDestination
} from '../utils/chan';
import {
  requestFilesInParallel,
  requestUrl,
  downloadFile
} from '../utils/requests';
import { loadHtmlString } from '../utils/cheerio';
import { log } from '../utils/logger';
import { createFolder } from '../utils/fs';
import { formatChanUrl } from '../utils/urls';

export class ChanScraper {
  public static downloadThread = async (url: string) => {
    log.urlToDownload(formatChanUrl(url));
    try {
      const { data } = await requestUrl<string>(formatChanUrl(url));
      const parsedHtmlString = loadHtmlString(data);
      const threadData = getThreadData(parsedHtmlString);

      const filesToDownload = getChanFiles(parsedHtmlString, threadData);
      if (filesToDownload.length === 0) {
        log.noFilesToDownload();
        return;
      }

      const folderPath = generateFolderForThread(
        threadData.board,
        threadData.thread
      );

      log.numFilesToDownload(filesToDownload.length, folderPath);

      await createFolder(folderPath);
      return await requestFilesInParallel<ChanFile>(filesToDownload)(
        downloadFile<ChanFile>(generateChanFileDestination)
      );
    } catch (e) {
      console.error(e);
      return;
    }
  };
}
