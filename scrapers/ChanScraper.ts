import { getFileUrls, getUrlData, fileSrcToChanData } from '../utils/chan';
import {
  createFolderForThread,
  downloadFilesInParallel,
  requestUrl
} from '../utils/requests';

export class ChanScraper {
  public static MIME_TYPE_WHITELIST = /webm/;

  private static keepWhitelistedFiles = (fileUrl: string) =>
    ChanScraper.MIME_TYPE_WHITELIST.test(fileUrl);

  public static downloadThread = async (url: string) => {
    const threadData = getUrlData(url);
    try {
      const { data } = await requestUrl<string>(url);

      const fileUrls = getFileUrls(data).filter(
        ChanScraper.keepWhitelistedFiles
      );
      const filesToDownload = fileUrls.map(fileSrcToChanData(threadData));

      console.log(`Downloading ${filesToDownload.length} files.`);

      await createFolderForThread(threadData);
      await downloadFilesInParallel(filesToDownload);
    } catch (e) {
      console.error(e);
    }
  };
}
