import {
  requestUrl,
  downloadFilesInParallel,
  downloadImgurFile,
  requestUrlsInParallel,
  selectData
} from '../utils/requests';
import {
  extractAlbumUrls,
  createFolderForImgurSubreddit,
  transformImgurApiResponse
} from '../utils/imgur';
import { prependSecureSchemeToUrl } from '../utils/cheerio';
import { formatImgurUrl } from '../utils/urls';

export class ImgurScraper {
  public static downloadSubredditView = async (url: string) => {
    try {
      const response = await requestUrl<ImgurApiResponse>(formatImgurUrl(url), {
        responseType: 'json'
      });

      console.log(formatImgurUrl(url));

      const filesToDownload = response.data.data
        .map(transformImgurApiResponse)
        .filter(file => file.size > 0);

      if (filesToDownload.length === 0) {
        console.info('Found no images to download.');
        return;
      }

      console.info(`Downloading ${filesToDownload.length} images.`);

      await createFolderForImgurSubreddit(filesToDownload[0].subreddit);
      await downloadFilesInParallel(filesToDownload)(downloadImgurFile);
    } catch (e) {
      console.error(e);
    }
  };
}
