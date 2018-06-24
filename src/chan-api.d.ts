export interface ChanApiResponse {
  readonly posts: ChanPost[];
}

export interface ChanPost {
  readonly no: number;
  readonly now: string;
  readonly name: string;
  readonly filename?: string;
  readonly ext?: string;
  readonly tim: number;
  readonly replies?: number;
  readonly images?: number;
  readonly unique_ips?: number;
  readonly semantic_url?: string;
}

export interface ChanPostWithFile extends ChanPost {
  readonly filename: string;
  readonly ext: string;
  readonly tim: number; // File ID
}

export interface OriginalChanPost extends ChanPostWithFile {
  readonly replies: number;
  readonly images: number;
  readonly unique_ips: number;
  readonly semantic_url: string;
}
