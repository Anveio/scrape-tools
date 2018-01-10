import {
  requestUrl,
  downloadFilesInParallel,
  downloadFile
} from '../utils/requests';
import {
  createFolderForImgurSubreddit,
  transformImgurApiResponse,
  generateImgurSubredditDestination
} from '../utils/imgur';
import { formatImgurUrl } from '../utils/urls';

export class ImgurScraper {
  public static downloadSubredditView = async (url: string) => {
    try {
      const response = await requestUrl<ImgurApiResponse>(formatImgurUrl(url), {
        responseType: 'json'
      });

      const filesToDownload = response.data.data
        .map(transformImgurApiResponse)
        .filter(file => file.size > 0);

      if (filesToDownload.length === 0) {
        console.info('Found no images to download.');
        return;
      }

      console.info(`Downloading ${filesToDownload.length} images.`);

      await createFolderForImgurSubreddit(filesToDownload[0].subreddit);
      await downloadFilesInParallel(filesToDownload)(
        downloadFile<ImgurFile>(generateImgurSubredditDestination)
      );
    } catch (e) {
      console.error(e);
    }
  };
}
