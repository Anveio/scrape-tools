import {
  getChanUrlsToDownload,
  generateFolderForThread,
  generateChanFileDestination,
  formatAsChanCdnUrl,
  getThreadTitle
} from '../utils/chan';
import {
  requestFilesInParallel,
  requestUrl,
  downloadFile
} from '../utils/requests';
import { log } from '../utils/logger';
import { createFolder } from '../utils/fs';
import { ChanApiResponse } from '../chan-api';

export class ChanScraper {
  public static downloadThread = async (url: string) => {
    const { formattedUrl, boardName } = formatAsChanCdnUrl(url);

    log.urlToDownload(url);
    try {
      const { data } = await requestUrl<ChanApiResponse>(formattedUrl);

      const threadTitle = getThreadTitle(data.posts[0]);
      const filesToDownload = getChanUrlsToDownload(
        data.posts,
        boardName,
        threadTitle
      );

      if (filesToDownload.length === 0) {
        log.noFilesToDownload();
        return;
      }

      const folderPath = generateFolderForThread(boardName, threadTitle);
      log.numFilesToDownload(filesToDownload.length, folderPath);

      await createFolder(folderPath);
      await requestFilesInParallel<ChanFile>(filesToDownload)(
        downloadFile<ChanFile>(generateChanFileDestination)
      );
      return;
    } catch (e) {
      console.error(e);
      return;
    }
  };
}
