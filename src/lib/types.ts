export interface Video {
  title: string;
  link: string;
  thumbnail: string;
  channel: string;
  publishDate: Date | string;
  description?: string;
}

export interface FeedConfig {
  feeds: string[];
}

export interface FeedResponse {
  videos: Video[];
  error?: string;
  cached?: boolean;
  cacheTimestamp?: number;
}
