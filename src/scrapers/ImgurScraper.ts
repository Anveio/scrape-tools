import {
  requestUrl,
  requestFilesInParallel,
  downloadFile
} from '../utils/requests';
import {
  transformImgurApiResponse,
  generateImgurSubredditFilePath,
  generateImgurSubredditFolderPath
} from '../utils/imgur';
import { formatImgurUrl } from '../utils/urls';
import { log } from '../utils/logger';
import { createFolder } from '../utils/fs';

export class ImgurScraper {
  public static downloadSubredditView = async (url: string) => {
    log.urlToDownload(formatImgurUrl(url));
    try {
      const response = await requestUrl<ImgurApiResponse>(formatImgurUrl(url));

      log.totalFilesFound(response.data.data.length);

      const filesToDownload = response.data.data
        .map(transformImgurApiResponse)
        .filter(file => file.size > 0);

      if (filesToDownload.length === 0) {
        log.noFilesToDownload();
        return;
      }

      const folderPath = generateImgurSubredditFolderPath(
        filesToDownload[0].subreddit
      );

      log.numFilesToDownload(filesToDownload.length, folderPath);

      await createFolder(folderPath);

      await requestFilesInParallel(filesToDownload)(
        downloadFile<ImgurFile>(generateImgurSubredditFilePath)
      );
    } catch (e) {
      console.error(e);
    }
  };
}
