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
  extractSubredditName,
  transformImgurApiResponse
} from '../utils/imgur';
import { prependSecureSchemeToUrl } from '../utils/cheerio';
import { formatImgurUrl } from '../utils/urls';

export class ImgurScraper {
  public static downloadSubredditView = async (url: string) => {
    const subreddit = extractSubredditName(url);
    try {
      const response = await requestUrl<ImgurApiResponse>(formatImgurUrl(url), {
        responseType: 'json'
      });

      const filesToDownload = response.data.data
        .map(transformImgurApiResponse)
        .filter(file => file.size > 0);

      console.info(`Downloading ${filesToDownload.length} images.`);

      await createFolderForImgurSubreddit(subreddit);
      await downloadFilesInParallel(filesToDownload)(downloadImgurFile);
    } catch (e) {
      console.error(e);
    }
  };
}
