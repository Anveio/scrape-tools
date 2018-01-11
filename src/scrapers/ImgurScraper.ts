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
import { logger } from '../utils/logger';
import { createFolder } from '../utils/fs';

export class ImgurScraper {
  public static downloadSubredditView = async (url: string) => {
    try {
      const response = await requestUrl<ImgurApiResponse>(formatImgurUrl(url), {
        responseType: 'json'
      });

      logger.reportTotalFiles(response.data.data.length);

      const filesToDownload = response.data.data
        .map(transformImgurApiResponse)
        .filter(file => file.size > 0);

      if (filesToDownload.length === 0) {
        logger.reportNoFilesToDownload();
        return;
      }

      logger.reportNumFilesToDownload(filesToDownload.length);

      await createFolder(
        generateImgurSubredditFolderPath(filesToDownload[0].subreddit)
      );
      await requestFilesInParallel(filesToDownload)(
        downloadFile<ImgurFile>(generateImgurSubredditFilePath)
      );
    } catch (e) {
      console.error(e);
    }
  };
}
