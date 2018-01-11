interface DownloadableFile {
  readonly src: string;
}

interface ChanFile extends ChanThreadData {
  readonly src: string;
  readonly filename: string;
}

interface ChanThreadData {
  readonly board: string;
  readonly thread: string;
}

interface ImgurFile {
  readonly src: string;
  readonly hash: string;
  readonly ext: string;
  readonly subreddit: string;
  readonly filename: string;
  readonly size: number;
}

interface ImgurApiResponse {
  readonly data: ImgurImageData[];
  readonly success: boolean;
  readonly status: number;
}

interface ImgurImageData {
  readonly id: number;
  readonly hash: string;
  readonly author: string;
  readonly title: string;
  readonly ext: string;
  readonly mimetype: string;
  readonly subreddit: string;
  readonly size: number;
}